import React, { useState, useEffect } from 'react'
import Layout from './../../common/Layout';
import { Link } from 'react-router-dom';
import UserSidebar from '../../common/UserSidebar';
import { apiUrl } from '../../common/config';

const MyCourses = () => {
    // State to store the list of courses fetched from the API
    const [courses, setCourses] = useState([]);
    // State to show a loading message while fetching data
    const [loading, setLoading] = useState(true);

    // useEffect runs once when the component loads
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Get the logged-in user's token from localStorage
                const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
                const token = userInfo?.token || null;

                // Call the API to get all courses for the logged-in user
                const res = await fetch(`${apiUrl}/courses`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });

                const result = await res.json();

                // If the request was successful, save courses in state
                if (res.ok) {
                    setCourses(result);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                // Always stop the loading indicator when done
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        {/* Page header with title and Create button */}
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>My Courses</h2>
                                <Link to="/account/courses/create" className='btn btn-primary'>Create</Link>
                            </div>
                        </div>

                        {/* Left sidebar with navigation links */}
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>

                        {/* Main content area */}
                        <div className='col-lg-9'>
                            {loading ? (
                                <p>Loading...</p>
                            ) : courses.length === 0 ? (
                                <p>No courses yet.</p>
                            ) : (
                                <div className='row gy-4'>
                                    {courses.map((course) => (
                                        <div key={course.id} className='col-md-6'>
                                            <div className='card'>
                                                <div className='card-body'>
                                                    <h5 className='card-title'>{course.title}</h5>
                                                    <p className='card-text'>Price: ${course.price}</p>
                                                    <Link to={`/account/courses/edit/${course.id}`} className='btn btn-sm btn-primary'>Edit</Link>
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

export default MyCourses