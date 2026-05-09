import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiUrl } from '../../../common/config';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const CourseRequirements = ({ courseId }) => {
    const [requirements, setRequirements] = useState([]);
    const [newText, setNewText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [loading, setLoading] = useState(false);

    const getToken = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        return userInfo?.token || null;
    };

    // Fetch all requirements for this course
    const fetchRequirements = async () => {
        const token = getToken();
        const res = await fetch(`${apiUrl}/courses/${courseId}/requirements`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        const result = await res.json();
        if (res.ok) {
            setRequirements(result.data || []);
        }
    };

    useEffect(() => {
        if (courseId) fetchRequirements();
    }, [courseId]);

    // Add a new requirement
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newText.trim()) return;

        setLoading(true);
        const token = getToken();
        const res = await fetch(`${apiUrl}/courses/${courseId}/requirements`, {
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
            setRequirements([...requirements, result.data]);
            setNewText('');
            toast.success('Requirement added');
        } else {
            toast.error(result.errors?.text?.[0] || 'Failed to add requirement');
        }
    };

    // Start editing
    const handleEditStart = (requirement) => {
        setEditingId(requirement.id);
        setEditingText(requirement.text);
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
        const res = await fetch(`${apiUrl}/requirements/${id}`, {
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
            setRequirements(requirements.map(r => r.id === id ? result.data : r));
            setEditingId(null);
            setEditingText('');
            toast.success('Requirement updated');
        } else {
            toast.error(result.errors?.text?.[0] || 'Failed to update');
        }
    };

    // Delete a requirement
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this requirement?')) return;

        const token = getToken();
        const res = await fetch(`${apiUrl}/requirements/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (res.ok) {
            setRequirements(requirements.filter(r => r.id !== id));
            toast.success('Requirement deleted');
        } else {
            toast.error('Failed to delete requirement');
        }
    };

    // Handle drag end
    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        if (result.destination.index === result.source.index) return;

        const reordered = Array.from(requirements);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);

        setRequirements(reordered);

        // Save new order to backend
        const token = getToken();
        await fetch(`${apiUrl}/requirements/sort`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({ ids: reordered.map(r => r.id) })
        });
    };

    return (
        <div className='card border-0 shadow-sm mt-4'>
            <div className='card-header bg-white'>
                <h4 className='mb-0'>Course Requirements</h4>
                <small className='text-muted'>Prerequisites students need before taking this course</small>
            </div>
            <div className='card-body'>
                {/* Add new requirement form */}
                <form onSubmit={handleAdd} className='mb-3'>
                    <div className='input-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='e.g. Basic knowledge of HTML'
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                        />
                        <button className='btn btn-primary' type='submit' disabled={loading}>
                            {loading ? '...' : 'Add'}
                        </button>
                    </div>
                </form>

                {/* Requirements list */}
                {requirements.length === 0 && (
                    <p className='text-muted text-center py-3'>No requirements added yet.</p>
                )}

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="requirements-list">
                        {(provided) => (
                            <ul
                                className='list-group list-group-flush'
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {requirements.map((requirement, index) => (
                                    <Draggable key={String(requirement.id)} draggableId={String(requirement.id)} index={index}>
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

                                                {editingId === requirement.id ? (
                                                    <div className='d-flex w-100 gap-2'>
                                                        <input
                                                            type='text'
                                                            className='form-control form-control-sm'
                                                            value={editingText}
                                                            onChange={(e) => setEditingText(e.target.value)}
                                                            autoFocus
                                                        />
                                                        <button className='btn btn-sm btn-success' onClick={() => handleEditSave(requirement.id)}>
                                                            Save
                                                        </button>
                                                        <button className='btn btn-sm btn-secondary' onClick={handleEditCancel}>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span className='flex-grow-1'>{requirement.text}</span>
                                                        <button
                                                            className='btn btn-sm btn-outline-primary me-1'
                                                            onClick={() => handleEditStart(requirement)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className='btn btn-sm btn-outline-danger'
                                                            onClick={() => handleDelete(requirement.id)}
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

export default CourseRequirements;
