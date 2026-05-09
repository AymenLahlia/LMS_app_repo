import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserSidebar from '../../common/UserSidebar'
import Layout from '../../common/Layout'
import { apiUrl } from '../../common/config'

const MyLearning = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
                const token = userInfo?.token;
                const res = await fetch(`${apiUrl}/progress/my`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                const result = await res.json();
                if (res.ok) {
                    setCourses(result.data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, []);

    const storageUrl = apiUrl.replace('/api', '') + '/storage/';

    return (
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <h2 className='h4 mb-0 pb-0'>My Learning</h2>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            {loading ? (
                                <p>Loading...</p>
                            ) : courses.length === 0 ? (
                                <div className='text-center py-5'>
                                    <p className='text-muted mb-3'>You haven't enrolled in any courses yet.</p>
                                    <Link to='/courses' className='btn text-white' style={{ backgroundColor: '#2a9d8f' }}>
                                        Browse Courses
                                    </Link>
                                </div>
                            ) : (
                                <div className='row gy-4'>
                                    {courses.map(course => (
                                        <div key={course.id} className='col-md-6'>
                                            <div className='card border-0 shadow-sm h-100'>
                                                {course.image ? (
                                                    <img
                                                        src={`${storageUrl}${course.image}`}
                                                        alt={course.title}
                                                        className='card-img-top'
                                                        style={{ height: '160px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div
                                                        className='card-img-top d-flex align-items-center justify-content-center'
                                                        style={{ height: '160px', backgroundColor: '#f0f0f0' }}
                                                    >
                                                        <span className='text-muted'>No Image</span>
                                                    </div>
                                                )}
                                                <div className='card-body'>
                                                    <h6 className='card-title fw-bold'>{course.title}</h6>
                                                    {course.category_name && (
                                                        <span className='badge mb-2' style={{ backgroundColor: '#2a9d8f', fontSize: '0.7rem' }}>
                                                            {course.category_name}
                                                        </span>
                                                    )}
                                                    <div className='mt-2 mb-2'>
                                                        <div className='d-flex justify-content-between' style={{ fontSize: '0.8rem' }}>
                                                            <span>{course.completed_lessons}/{course.total_lessons} lessons</span>
                                                            <span className='fw-bold'>{course.progress_percentage}%</span>
                                                        </div>
                                                        <div className="progress mt-1" style={{ height: '8px' }}>
                                                            <div
                                                                className="progress-bar"
                                                                style={{
                                                                    width: `${course.progress_percentage}%`,
                                                                    backgroundColor: course.progress_percentage === 100 ? '#28a745' : '#2a9d8f'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Link
                                                        to={`/account/watch-course/${course.id}`}
                                                        className='btn btn-sm text-white w-100'
                                                        style={{ backgroundColor: '#2a9d8f' }}
                                                    >
                                                        Continue Learning
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default MyLearning
