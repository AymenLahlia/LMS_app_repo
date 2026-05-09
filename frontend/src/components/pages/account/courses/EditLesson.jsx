import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiUrl } from '../../../common/config';
import UserSidebar from '../../../common/UserSidebar';
import JoditEditor from 'jodit-react';

const EditLesson = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [title, setTitle] = useState('');
    const [chapterId, setChapterId] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('1');
    const [freePreview, setFreePreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [chapters, setChapters] = useState([]);

    // Video state
    const [videoFile, setVideoFile] = useState(null);
    const [videoUploading, setVideoUploading] = useState(false);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const editor = useRef(null);
    const fileInputRef = useRef(null);

    const editorConfig = useMemo(() => ({
        readonly: false,
        height: 250,
        toolbarButtonSize: 'small',
    }), []);

    const getToken = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        return userInfo?.token || null;
    };

    // Fetch lesson data
    useEffect(() => {
        const fetchLesson = async () => {
            const token = getToken();
            const res = await fetch(`${apiUrl}/lessons/${lessonId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok && result.data) {
                const l = result.data;
                setLesson(l);
                setTitle(l.title || '');
                setChapterId(l.chapter_id || '');
                setDuration(l.duration || '');
                setDescription(l.description || '');
                setStatus(String(l.status ?? '1'));
                setFreePreview(l.is_free_preview === 'yes');
                setCurrentVideo(l.video || null);
            } else {
                toast.error('Lesson not found');
            }
        };
        if (lessonId) fetchLesson();
    }, [lessonId]);

    // Fetch chapters for the dropdown
    useEffect(() => {
        const fetchChapters = async () => {
            if (!lesson) return;
            // Get the course ID from the lesson's chapter
            const token = getToken();
            // First get the chapter (lesson table) to find the course_id
            const res = await fetch(`${apiUrl}/chapters/${lesson.chapter_id}/lessons`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            // We'll use the chapterId to find course chapters
        };
        if (lesson) fetchChapters();
    }, [lesson]);

    // Save lesson
    const handleSave = async () => {
        if (!title.trim()) {
            toast.error('Title is required');
            return;
        }

        setLoading(true);
        const token = getToken();
        const res = await fetch(`${apiUrl}/lessons/${lessonId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                title,
                duration: duration ? parseInt(duration) : null,
                description,
                is_free_preview: freePreview ? 'yes' : 'no',
            })
        });
        const result = await res.json();
        setLoading(false);

        if (res.ok) {
            setLesson(result.data);
            toast.success('Lesson updated');
        } else {
            toast.error(result.errors?.title?.[0] || 'Failed to update');
        }
    };

    // Upload video
    const handleVideoUpload = async (file) => {
        if (!file) return;

        setVideoUploading(true);
        const token = getToken();
        const formData = new FormData();
        formData.append('video', file);

        const res = await fetch(`${apiUrl}/lessons/${lessonId}/upload-video`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData
        });
        const result = await res.json();
        setVideoUploading(false);

        if (res.ok) {
            setCurrentVideo(result.data.video);
            setVideoFile(null);
            toast.success('Video uploaded!');
        } else {
            toast.error(result.errors?.video?.[0] || 'Failed to upload video');
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            handleVideoUpload(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            handleVideoUpload(file);
        } else {
            toast.error('Please drop a video file');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    return (
        <section className='section bg-light py-5'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserSidebar />
                    </div>
                    <div className='col-md-9'>
                        {/* Back button */}
                        <div className='d-flex justify-content-end mb-3'>
                            <button
                                className='btn text-white'
                                style={{ backgroundColor: '#2a9d8f' }}
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </button>
                        </div>

                        <div className='row'>
                            {/* Left: Basic Information */}
                            <div className='col-md-7'>
                                <div className='card border-0 shadow-sm'>
                                    <div className='card-body'>
                                        <h5 className='fw-bold mb-4'>Basic Information</h5>

                                        <div className='mb-3'>
                                            <label className='form-label'>Title</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>

                                        <div className='mb-3'>
                                            <label className='form-label'>Chapter</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={`Chapter ID: ${chapterId}`}
                                                disabled
                                            />
                                        </div>

                                        <div className='mb-3'>
                                            <label className='form-label'>Duration(Mins)</label>
                                            <input
                                                type='number'
                                                className='form-control'
                                                placeholder='e.g. 10'
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                            />
                                        </div>

                                        <div className='mb-3'>
                                            <label className='form-label'>Description</label>
                                            <JoditEditor
                                                ref={editor}
                                                value={description}
                                                config={editorConfig}
                                                onBlur={newContent => setDescription(newContent)}
                                            />
                                        </div>

                                        <div className='mb-3'>
                                            <label className='form-label'>Status</label>
                                            <select
                                                className='form-select'
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                            >
                                                <option value='1'>Active</option>
                                                <option value='0'>Inactive</option>
                                            </select>
                                        </div>

                                        <div className='mb-3 form-check'>
                                            <input
                                                type='checkbox'
                                                className='form-check-input'
                                                id='freePreviewCheck'
                                                checked={freePreview}
                                                onChange={(e) => setFreePreview(e.target.checked)}
                                            />
                                            <label className='form-check-label' htmlFor='freePreviewCheck'>
                                                Free Lesson
                                            </label>
                                        </div>

                                        <button
                                            className='btn text-white'
                                            style={{ backgroundColor: '#2a9d8f' }}
                                            onClick={handleSave}
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Lesson Video */}
                            <div className='col-md-5'>
                                <div className='card border-0 shadow-sm'>
                                    <div className='card-body'>
                                        <h5 className='fw-bold mb-3' style={{ color: '#2a9d8f' }}>Lesson Video</h5>

                                        {/* Drag & Drop Zone */}
                                        <div
                                            className='text-center p-4 mb-3 rounded'
                                            style={{
                                                border: `2px dashed ${dragOver ? '#2a9d8f' : '#ccc'}`,
                                                backgroundColor: dragOver ? '#f0faf9' : '#fafafa',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                            }}
                                            onClick={() => fileInputRef.current?.click()}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                        >
                                            {videoUploading ? (
                                                <div>
                                                    <div className='spinner-border text-success mb-2' role='status'>
                                                        <span className='visually-hidden'>Uploading...</span>
                                                    </div>
                                                    <p className='text-muted mb-0'>Uploading video...</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className='mb-1' style={{ color: '#666' }}>
                                                        Drag & Drop your files or <span style={{ color: '#2a9d8f', fontWeight: 'bold' }}>Browse</span>
                                                    </p>
                                                    <small className='text-muted'>MP4, MOV, AVI, WMV, WebM (Max 100MB)</small>
                                                </div>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type='file'
                                                accept='video/mp4,video/mov,video/avi,video/wmv,video/webm'
                                                onChange={handleFileSelect}
                                                style={{ display: 'none' }}
                                            />
                                        </div>

                                        {/* Current Video Player */}
                                        {currentVideo && (
                                            <div>
                                                <video
                                                    src={`${apiUrl.replace('/api', '')}/storage/${currentVideo}`}
                                                    controls
                                                    style={{
                                                        width: '100%',
                                                        borderRadius: '8px',
                                                        backgroundColor: '#000',
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {!currentVideo && !videoUploading && (
                                            <p className='text-muted text-center small'>No video uploaded yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditLesson;
