import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../../common/Layout'
import Accordion from 'react-bootstrap/Accordion'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { MdSlowMotionVideo } from "react-icons/md"
import { IoMdCheckmarkCircleOutline, IoMdCheckmarkCircle } from "react-icons/io"
import { apiUrl } from '../../common/config'
import { toast } from 'react-toastify'

const WatchCourse = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [completedIds, setCompletedIds] = useState([]);
    const [totalLessons, setTotalLessons] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lessonFinished, setLessonFinished] = useState(false);

    const storageUrl = apiUrl.replace('/api', '') + '/storage/';

    const getToken = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        return userInfo?.token || null;
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = getToken();

            // Fetch course details
            const courseRes = await fetch(`${apiUrl}/public/courses/${courseId}`);
            const courseData = await courseRes.json();
            if (courseRes.ok) {
                setCourse(courseData.data);
                setChapters(courseData.chapters || []);

                // Set first lesson as current
                const allLessons = [];
                (courseData.chapters || []).forEach(ch => {
                    (ch.lessons || []).forEach(l => allLessons.push(l));
                });
                if (allLessons.length > 0) setCurrentLesson(allLessons[0]);
            }

            // Fetch progress
            const progressRes = await fetch(`${apiUrl}/progress/course/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const progressData = await progressRes.json();
            if (progressRes.ok) {
                setCompletedIds(progressData.completed_ids || []);
                setTotalLessons(progressData.total_lessons || 0);
                setCompletedCount(progressData.completed_lessons || 0);
            }

            setLoading(false);
        };
        fetchData();
    }, [courseId]);

    useEffect(() => {
        setLessonFinished(false);
    }, [currentLesson]);

    const handleMarkComplete = async (lessonId) => {
        const token = getToken();
        const res = await fetch(`${apiUrl}/progress/complete/${lessonId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });

        if (res.ok) {
            // Toggle completed state
            if (completedIds.includes(lessonId)) {
                setCompletedIds(completedIds.filter(id => id !== lessonId));
                setCompletedCount(prev => prev - 1);
            } else {
                setCompletedIds([...completedIds, lessonId]);
                setCompletedCount(prev => prev + 1);
            }
            toast.success('Progress updated');
        }
    };

    const handleVideoEnd = () => {
        setLessonFinished(true);
        // Automatically mark as complete if not already
        if (currentLesson && !completedIds.includes(currentLesson.id)) {
            handleMarkComplete(currentLesson.id);
        }
    };

    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    if (loading) {
        return <Layout><div className='container py-5 text-center'>Loading...</div></Layout>;
    }

    if (!course) {
        return <Layout><div className='container py-5 text-center'>Course not found.</div></Layout>;
    }

    return (
        <Layout>
            <section className='section-5 my-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-8'>
                            {/* Video player */}
                            <div className='video bg-dark rounded mb-3' style={{ minHeight: '400px' }}>
                                {currentLesson?.video ? (
                                    <video
                                        key={currentLesson.id}
                                        width="100%"
                                        height="400"
                                        controls
                                        autoPlay
                                        onEnded={handleVideoEnd}
                                    >
                                        <source src={`${storageUrl}${currentLesson.video}`} type="video/mp4" />
                                    </video>
                                ) : (
                                    <div className='d-flex align-items-center justify-content-center text-white' style={{ height: '400px' }}>
                                        <div className='text-center'>
                                            <MdSlowMotionVideo size={60} />
                                            <p className='mt-2'>No video available for this lesson</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Lesson meta */}
                            <div className='meta-content'>
                                <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 pt-1'>
                                    <h3 className='pt-2 h5'>{currentLesson?.title || 'Select a lesson'}</h3>
                                    {currentLesson && (
                                        <button
                                            className={`btn btn-sm ${completedIds.includes(currentLesson.id) ? 'btn-success' : 'btn-primary'}`}
                                            onClick={() => handleMarkComplete(currentLesson.id)}
                                            disabled={currentLesson.video && !lessonFinished && !completedIds.includes(currentLesson.id)}
                                            title={currentLesson.video && !lessonFinished && !completedIds.includes(currentLesson.id) ? "Watch the full video to complete" : ""}
                                        >
                                            {completedIds.includes(currentLesson.id) ? (
                                                <><IoMdCheckmarkCircle size={18} /> Completed</>
                                            ) : (
                                                <><IoMdCheckmarkCircleOutline size={18} /> Mark as Complete</>
                                            )}
                                        </button>
                                    )}
                                </div>
                                {currentLesson?.description && (
                                    <div dangerouslySetInnerHTML={{ __html: currentLesson.description }} />
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className='col-md-4'>
                            <div className='card rounded-0'>
                                <div className='card-body'>
                                    <h6><strong>{course.title}</strong></h6>
                                    <div className='py-2'>
                                        <ProgressBar
                                            now={progressPercent}
                                            variant={progressPercent === 100 ? 'success' : undefined}
                                            style={{ height: '10px' }}
                                        />
                                        <div className='pt-1 d-flex justify-content-between' style={{ fontSize: '0.85rem' }}>
                                            <span>{completedCount}/{totalLessons} lessons</span>
                                            <span className='fw-bold'>{progressPercent}% complete</span>
                                        </div>
                                    </div>
                                    <Accordion defaultActiveKey="0" flush>
                                        {chapters.map((chapter, idx) => (
                                            <Accordion.Item eventKey={String(idx)} key={chapter.id}>
                                                <Accordion.Header>{chapter.title}</Accordion.Header>
                                                <Accordion.Body className='pt-2 pb-0 ps-0'>
                                                    <ul className='lessons mb-0 list-unstyled'>
                                                        {(chapter.lessons || []).map(lesson => {
                                                            const isCompleted = completedIds.includes(lesson.id);
                                                            const isActive = currentLesson?.id === lesson.id;
                                                            return (
                                                                <li
                                                                    key={lesson.id}
                                                                    className={`pb-2 px-2 py-1 rounded ${isActive ? 'bg-light' : ''}`}
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => setCurrentLesson(lesson)}
                                                                >
                                                                    <div className='d-flex align-items-center justify-content-between'>
                                                                        <div className='d-flex align-items-center'>
                                                                            {isCompleted ? (
                                                                                <IoMdCheckmarkCircle size={18} className='text-success me-2' />
                                                                            ) : (
                                                                                <MdSlowMotionVideo size={18} className='me-2' />
                                                                            )}
                                                                            <span style={{ fontSize: '0.9rem' }}>{lesson.title}</span>
                                                                        </div>
                                                                        <span className='text-muted' style={{ fontSize: '0.75rem' }}>
                                                                            {lesson.duration || 0}m
                                                                        </span>
                                                                    </div>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default WatchCourse
