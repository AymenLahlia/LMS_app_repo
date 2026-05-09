import React, { useState, useEffect } from 'react'
import Layout from '../../common/Layout'
import { Link } from 'react-router-dom'
import UserSidebar from '../../common/UserSidebar'
import { apiUrl } from '../../common/config'

const Dashboard = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
    const role = userInfo?.role || 'student';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = userInfo?.token;
                const res = await fetch(`${apiUrl}/dashboard-stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                const result = await res.json();
                if (res.ok) setStats(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/account/dashboard">Account</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                        </ol>
                    </nav>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <h2 className='h4 mb-0 pb-0'>
                                {role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
                            </h2>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            {loading ? <p>Loading...</p> : role === 'admin' ? (
                                /* ── Admin Dashboard ── */
                                <div className='row gy-4'>
                                    <div className='col-md-3'>
                                        <div className='card shadow border-0 text-center'>
                                            <div className='card-body p-3'>
                                                <h2 style={{ color: '#2a9d8f' }}>{stats.total_students || 0}</h2>
                                                <span className='text-muted'>Students</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-3'>
                                        <div className='card shadow border-0 text-center'>
                                            <div className='card-body p-3'>
                                                <h2 style={{ color: '#2a9d8f' }}>{stats.total_courses || 0}</h2>
                                                <span className='text-muted'>Courses</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-3'>
                                        <div className='card shadow border-0 text-center'>
                                            <div className='card-body p-3'>
                                                <h2 style={{ color: '#2a9d8f' }}>{stats.total_enrollments || 0}</h2>
                                                <span className='text-muted'>Enrollments</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-3'>
                                        <div className='card shadow border-0 text-center'>
                                            <div className='card-body p-3'>
                                                <h2 style={{ color: '#2a9d8f' }}>{stats.courses || 0}</h2>
                                                <span className='text-muted'>My Published</span>
                                            </div>
                                            <div className='card-footer bg-white border-0'>
                                                <Link to="/account/my-courses" style={{ color: '#2a9d8f' }}>View Courses</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* ── Student Dashboard ── */
                                <div className='row gy-4'>
                                    <div className='col-md-4'>
                                        <div className='card shadow border-0 text-center'>
                                            <div className='card-body p-3'>
                                                <h2 style={{ color: '#2a9d8f' }}>{stats.enrolled || 0}</h2>
                                                <span className='text-muted'>Enrolled Courses</span>
                                            </div>
                                            <div className='card-footer bg-white border-0'>
                                                <Link to="/account/my-learning" style={{ color: '#2a9d8f' }}>My Learning</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='card shadow border-0 text-center'>
                                            <div className='card-body p-3'>
                                                <h2 style={{ color: '#2a9d8f' }}>{stats.completed_lessons || 0}</h2>
                                                <span className='text-muted'>Lessons Completed</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className='card shadow border-0 text-center'>
                                            <div className='card-body p-3'>
                                                <h2 style={{ color: '#2a9d8f' }}>
                                                    <Link to="/courses" className='btn text-white' style={{ backgroundColor: '#2a9d8f' }}>
                                                        Browse
                                                    </Link>
                                                </h2>
                                                <span className='text-muted'>Find Courses</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Dashboard