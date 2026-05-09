import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiUrl } from '../../../common/config';
import ChapterLessons from './ChapterLessons';

const CourseChapters = ({ courseId }) => {
    const [chapters, setChapters] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [expandedChapter, setExpandedChapter] = useState(null);
    const [editingChapterId, setEditingChapterId] = useState(null);
    const [editingChapterTitle, setEditingChapterTitle] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalChapterId, setModalChapterId] = useState('');
    const [modalLessonTitle, setModalLessonTitle] = useState('');
    const [modalStatus, setModalStatus] = useState('1');
    const [modalLoading, setModalLoading] = useState(false);

    const getToken = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        return userInfo?.token || null;
    };

    const fetchChapters = async () => {
        const token = getToken();
        const res = await fetch(`${apiUrl}/courses/${courseId}/chapters`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        const result = await res.json();
        if (res.ok) {
            setChapters(result.data || []);
        }
    };

    useEffect(() => {
        if (courseId) fetchChapters();
    }, [courseId]);

    const toggleExpand = (id) => {
        setExpandedChapter(expandedChapter === id ? null : id);
    };

    // Add chapter
    const handleAddChapter = async (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        setLoading(true);
        const token = getToken();
        const res = await fetch(`${apiUrl}/courses/${courseId}/chapters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({ title: newTitle })
        });
        const result = await res.json();
        setLoading(false);

        if (res.ok) {
            setChapters([...chapters, result.data]);
            setNewTitle('');
            toast.success('Chapter added');
        } else {
            toast.error(result.errors?.title?.[0] || 'Failed to add chapter');
        }
    };

    // Update chapter title
    const handleUpdateChapter = async (id) => {
        if (!editingChapterTitle.trim()) return;
        const token = getToken();
        const res = await fetch(`${apiUrl}/chapters/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({ title: editingChapterTitle })
        });
        const result = await res.json();
        if (res.ok) {
            setChapters(chapters.map(c => c.id === id ? result.data : c));
            setEditingChapterId(null);
            setEditingChapterTitle('');
            toast.success('Chapter updated');
        } else {
            toast.error('Failed to update chapter');
        }
    };

    // Delete chapter
    const handleDeleteChapter = async (id) => {
        if (!window.confirm('Delete this chapter and all its lessons?')) return;
        const token = getToken();
        const res = await fetch(`${apiUrl}/chapters/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        if (res.ok) {
            setChapters(chapters.filter(c => c.id !== id));
            if (expandedChapter === id) setExpandedChapter(null);
            toast.success('Chapter deleted');
        } else {
            toast.error('Failed to delete chapter');
        }
    };

    // Start editing chapter
    const startEditChapter = (chapter) => {
        setEditingChapterId(chapter.id);
        setEditingChapterTitle(chapter.title);
    };

    // Modal: Add lesson
    const handleModalSave = async () => {
        if (!modalChapterId || !modalLessonTitle.trim()) {
            toast.error('Please select a chapter and enter a lesson title');
            return;
        }

        setModalLoading(true);
        const token = getToken();
        const res = await fetch(`${apiUrl}/chapters/${modalChapterId}/lessons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({ title: modalLessonTitle })
        });
        const result = await res.json();
        setModalLoading(false);

        if (res.ok) {
            toast.success('Lesson added');
            setShowModal(false);
            setModalChapterId('');
            setModalLessonTitle('');
            setModalStatus('1');
            // Expand the chapter so user sees the new lesson
            setExpandedChapter(parseInt(modalChapterId));
        } else {
            toast.error(result.errors?.title?.[0] || 'Failed to add lesson');
        }
    };

    return (
        <>
            <div className='card border-0 shadow-sm mt-4'>
                <div className='card-header bg-white d-flex justify-content-between align-items-center'>
                    <h4 className='mb-0'>Chapters</h4>
                    <button
                        className='btn btn-link text-decoration-none fw-bold'
                        style={{ color: '#2a9d8f' }}
                        onClick={() => setShowModal(true)}
                    >
                        + Add Lesson
                    </button>
                </div>
                <div className='card-body'>
                    {/* Add chapter form */}
                    <form onSubmit={handleAddChapter} className='mb-4'>
                        <div className='mb-2'>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Chapter'
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>
                        <button
                            className='btn text-white'
                            style={{ backgroundColor: '#2a9d8f' }}
                            type='submit'
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </form>

                    {chapters.length === 0 && (
                        <p className='text-muted text-center py-3'>No chapters added yet.</p>
                    )}

                    {/* Chapter accordion */}
                    {chapters.map((chapter) => (
                        <div key={chapter.id} className='border rounded mb-3'>
                            {/* Chapter header */}
                            <div
                                className='d-flex justify-content-between align-items-center px-3 py-2'
                                style={{ cursor: 'pointer', backgroundColor: '#fafafa' }}
                                onClick={() => toggleExpand(chapter.id)}
                            >
                                <strong>{chapter.title}</strong>
                                <span style={{ fontSize: '1.2rem' }}>
                                    {expandedChapter === chapter.id ? '∧' : '∨'}
                                </span>
                            </div>

                            {/* Expanded content */}
                            {expandedChapter === chapter.id && (
                                <div className='px-3 pb-3 pt-2'>
                                    {/* Edit chapter title */}
                                    {editingChapterId === chapter.id ? (
                                        <div className='mb-3'>
                                            <input
                                                type='text'
                                                className='form-control mb-2'
                                                value={editingChapterTitle}
                                                onChange={(e) => setEditingChapterTitle(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    ) : null}

                                    {/* Lessons */}
                                    <ChapterLessons chapterId={chapter.id} allChapters={chapters} key={expandedChapter} />

                                    {/* Chapter action buttons */}
                                    <div className='mt-3 d-flex gap-2'>
                                        <button
                                            className='btn btn-danger btn-sm'
                                            onClick={() => handleDeleteChapter(chapter.id)}
                                        >
                                            Delete Chapter
                                        </button>
                                        {editingChapterId === chapter.id ? (
                                            <button
                                                className='btn btn-sm text-white'
                                                style={{ backgroundColor: '#2a9d8f' }}
                                                onClick={() => handleUpdateChapter(chapter.id)}
                                            >
                                                Save Changes
                                            </button>
                                        ) : (
                                            <button
                                                className='btn btn-sm text-white'
                                                style={{ backgroundColor: '#2a9d8f' }}
                                                onClick={() => startEditChapter(chapter)}
                                            >
                                                Update Chapter
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Lesson Modal */}
            {showModal && (
                <>
                    <div className='modal-backdrop fade show'></div>
                    <div className='modal fade show d-block' tabIndex='-1'>
                        <div className='modal-dialog'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h5 className='modal-title'>Create Lesson</h5>
                                    <button type='button' className='btn-close' onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className='modal-body'>
                                    <div className='mb-3'>
                                        <label className='form-label'>Chapter</label>
                                        <select
                                            className='form-select'
                                            value={modalChapterId}
                                            onChange={(e) => setModalChapterId(e.target.value)}
                                        >
                                            <option value=''>Select a Chapter</option>
                                            {chapters.map(c => (
                                                <option key={c.id} value={c.id}>{c.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='mb-3'>
                                        <label className='form-label'>Lesson</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            placeholder='Lesson'
                                            value={modalLessonTitle}
                                            onChange={(e) => setModalLessonTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <label className='form-label'>Status</label>
                                        <select
                                            className='form-select'
                                            value={modalStatus}
                                            onChange={(e) => setModalStatus(e.target.value)}
                                        >
                                            <option value='1'>Active</option>
                                            <option value='0'>Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='modal-footer'>
                                    <button
                                        className='btn text-white'
                                        style={{ backgroundColor: '#2a9d8f' }}
                                        onClick={handleModalSave}
                                        disabled={modalLoading}
                                    >
                                        {modalLoading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default CourseChapters;
