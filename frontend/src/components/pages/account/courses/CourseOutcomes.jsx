import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiUrl } from '../../../common/config';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const CourseOutcomes = ({ courseId }) => {
    const [outcomes, setOutcomes] = useState([]);
    const [newText, setNewText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [loading, setLoading] = useState(false);

    const getToken = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        return userInfo?.token || null;
    };

    // Fetch all outcomes for this course
    const fetchOutcomes = async () => {
        const token = getToken();
        const res = await fetch(`${apiUrl}/courses/${courseId}/outcomes`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        const result = await res.json();
        if (res.ok) {
            setOutcomes(result.data || []);
        }
    };

    useEffect(() => {
        if (courseId) fetchOutcomes();
    }, [courseId]);

    // Add a new outcome
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newText.trim()) return;

        setLoading(true);
        const token = getToken();
        const res = await fetch(`${apiUrl}/courses/${courseId}/outcomes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({ text: newText })
        });
        const result = await res.json();
        setLoading(false);

        if (res.ok) {
            setOutcomes([...outcomes, result.data]);
            setNewText('');
            toast.success('Outcome added');
        } else {
            toast.error(result.errors?.text?.[0] || 'Failed to add outcome');
        }
    };

    // Start editing
    const handleEditStart = (outcome) => {
        setEditingId(outcome.id);
        setEditingText(outcome.text);
    };

    // Cancel editing
    const handleEditCancel = () => {
        setEditingId(null);
        setEditingText('');
    };

    // Save edit
    const handleEditSave = async (id) => {
        if (!editingText.trim()) return;

        const token = getToken();
        const res = await fetch(`${apiUrl}/outcomes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({ text: editingText })
        });
        const result = await res.json();

        if (res.ok) {
            setOutcomes(outcomes.map(o => o.id === id ? result.data : o));
            setEditingId(null);
            setEditingText('');
            toast.success('Outcome updated');
        } else {
            toast.error(result.errors?.text?.[0] || 'Failed to update');
        }
    };

    // Delete an outcome
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this outcome?')) return;

        const token = getToken();
        const res = await fetch(`${apiUrl}/outcomes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (res.ok) {
            setOutcomes(outcomes.filter(o => o.id !== id));
            toast.success('Outcome deleted');
        } else {
            toast.error('Failed to delete outcome');
        }
    };

    // Handle drag end
    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;

        const reordered = Array.from(outcomes);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);

        setOutcomes(reordered);

        // Save new order to backend
        const token = getToken();
        await fetch(`${apiUrl}/outcomes/sort`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({ ids: reordered.map(o => o.id) })
        });
    };

    return (
        <div className='card border-0 shadow-sm'>
            <div className='card-header bg-white'>
                <h4 className='mb-0'>Course Outcomes</h4>
                <small className='text-muted'>What students will learn from this course</small>
            </div>
            <div className='card-body'>
                {/* Add new outcome form */}
                <form onSubmit={handleAdd} className='mb-3'>
                    <div className='input-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='e.g. Build a full-stack app'
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                        />
                        <button className='btn btn-primary' type='submit' disabled={loading}>
                            {loading ? '...' : 'Add'}
                        </button>
                    </div>
                </form>

                {/* Outcomes list */}
                {outcomes.length === 0 && (
                    <p className='text-muted text-center py-3'>No outcomes added yet.</p>
                )}

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="outcomes-list">
                        {(provided) => (
                            <ul
                                className='list-group list-group-flush'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {outcomes.map((outcome, index) => (
                                    <Draggable key={String(outcome.id)} draggableId={String(outcome.id)} index={index}>
                                        {(provided, snapshot) => (
                                            <li
                                                className={`list-group-item d-flex align-items-center px-0 ${snapshot.isDragging ? 'bg-light shadow-sm' : ''}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                {/* Drag handle */}
                                                <span
                                                    {...provided.dragHandleProps}
                                                    className='me-2'
                                                    style={{ cursor: 'grab', userSelect: 'none' }}
                                                    title='Drag to reorder'
                                                >
                                                    ☰
                                                </span>

                                                {editingId === outcome.id ? (
                                                    <div className='d-flex w-100 gap-2'>
                                                        <input
                                                            type='text'
                                                            className='form-control form-control-sm'
                                                            value={editingText}
                                                            onChange={(e) => setEditingText(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <button className='btn btn-sm btn-success' onClick={() => handleEditSave(outcome.id)}>
                                                            Save
                                                        </button>
                                                        <button className='btn btn-sm btn-secondary' onClick={handleEditCancel}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className='flex-grow-1'>{outcome.text}</span>
                                                        <button
                                                            className='btn btn-sm btn-outline-primary me-1'
                                                            onClick={() => handleEditStart(outcome)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className='btn btn-sm btn-outline-danger'
                                                            onClick={() => handleDelete(outcome.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};

export default CourseOutcomes;
