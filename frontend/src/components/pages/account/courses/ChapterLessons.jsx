import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiUrl } from '../../../common/config';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ChapterLessons = ({ chapterId, allChapters }) => {
    const [lessons, setLessons] = useState([]);
    const [reorderMode, setReorderMode] = useState(false);
    const navigate = useNavigate();

    const getToken = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        return userInfo?.token || null;
    };

    const fetchLessons = async () => {
        const token = getToken();
        const res = await fetch(`${apiUrl}/chapters/${chapterId}/lessons`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        const result = await res.json();
        if (res.ok) {
            setLessons(result.data || []);
        }
    };

    useEffect(() => {
        if (chapterId) fetchLessons();
    }, [chapterId]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this lesson?')) return;

        const token = getToken();
        const res = await fetch(`${apiUrl}/lessons/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (res.ok) {
            setLessons(lessons.filter(l => l.id !== id));
            toast.success('Lesson deleted');
        } else {
            toast.error('Failed to delete lesson');
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;

        const reordered = Array.from(lessons);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);

        setLessons(reordered);

        const token = getToken();
        await fetch(`${apiUrl}/lessons/sort`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({ ids: reordered.map(l => l.id) })
        });
        toast.success('Lessons reordered');
    };

    return (
        <div className='mt-3'>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h6 className='mb-0 fw-bold'>Lessons</h6>
                <span
                    className='fw-bold'
                    style={{ cursor: 'pointer', fontSize: '0.85rem', color: reorderMode ? '#2a9d8f' : '#333' }}
                    onClick={() => setReorderMode(!reorderMode)}
                >
                    {reorderMode ? 'Done Reordering' : 'Reorder Lessons'}
                </span>
            </div>

            {lessons.length === 0 && (
                <p className='text-muted small'>No lessons in this chapter yet.</p>
            )}

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`lessons-${chapterId}`}>
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {lessons.map((lesson, index) => (
                                <Draggable
                                    key={String(lesson.id)}
                                    draggableId={`lesson-${lesson.id}`}
                                    index={index}
                                    isDragDisabled={!reorderMode}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            className={`d-flex align-items-center py-2 px-3 mb-2 rounded border ${snapshot.isDragging ? 'shadow-sm' : ''}`}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            style={{
                                                ...provided.draggableProps.style,
                                                backgroundColor: '#fff',
                                                borderLeft: '3px solid #2a9d8f',
                                            }}
                                        >
                                            {reorderMode && (
                                                <span
                                                    {...provided.dragHandleProps}
                                                    className='me-2'
                                                    style={{ cursor: 'grab', userSelect: 'none' }}
                                                >
                                                    ☰
                                                </span>
                                            )}
                                            {!reorderMode && <span {...provided.dragHandleProps} style={{ display: 'none' }}></span>}

                                            <span className='flex-grow-1'>{lesson.title}</span>

                                            {/* Duration - always visible */}
                                            <span className='text-muted me-2' style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                                                {lesson.duration || 0} Mins
                                            </span>

                                            <button
                                                className='btn btn-sm'
                                                style={{ border: 'none', padding: '2px 6px' }}
                                                onClick={() => navigate(`/account/lessons/${lesson.id}/edit`)}
                                                title='Edit'
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className='btn btn-sm'
                                                style={{ border: 'none', padding: '2px 6px' }}
                                                onClick={() => handleDelete(lesson.id)}
                                                title='Delete'
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default ChapterLessons;
