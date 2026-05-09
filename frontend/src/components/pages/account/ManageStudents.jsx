import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import { apiUrl } from '../../common/config'

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
            const token = userInfo?.token;
            const res = await fetch(`${apiUrl}/admin/students`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) setStudents(result.data || []);
            setLoading(false);
        };
        fetchStudents();
    }, []);

    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/account/dashboard">Account</Link></li>
                            <li className="breadcrumb-item active">Manage Students</li>
                        </ol>
                    </nav>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <h2 className='h4 mb-0'>Manage Students</h2>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            {loading ? <p>Loading...</p> : (
                                <div className='card border-0 shadow-sm'>
                                    <div className='card-body p-0'>
                                        <div className='table-responsive'>
                                            <table className='table table-hover mb-0'>
                                                <thead style={{ backgroundColor: '#2a9d8f', color: 'white' }}>
                                                    <tr>
                                                        <th className='px-3 py-2'>Name</th>
                                                        <th className='px-3 py-2'>Email</th>
                                                        <th className='px-3 py-2'>Enrolled</th>
                                                        <th className='px-3 py-2'>Avg Progress</th>
                                                        <th className='px-3 py-2'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {students.length === 0 ? (
                                                        <tr><td colSpan={5} className='text-center py-3'>No students yet.</td></tr>
                                                    ) : students.map(s => (
                                                        <tr key={s.id}>
                                                            <td className='px-3 py-2'>{s.name}</td>
                                                            <td className='px-3 py-2'>{s.email}</td>
                                                            <td className='px-3 py-2'>{s.enrollments_count}</td>
                                                            <td className='px-3 py-2'>
                                                                <div className='d-flex align-items-center gap-2'>
                                                                    <div className="progress flex-grow-1" style={{ height: '8px' }}>
                                                                        <div
                                                                            className="progress-bar"
                                                                            style={{ width: `${s.avg_progress}%`, backgroundColor: '#2a9d8f' }}
                                                                        />
                                                                    </div>
                                                                    <span style={{ fontSize: '0.8rem' }}>{s.avg_progress}%</span>
                                                                </div>
                                                            </td>
                                                            <td className='px-3 py-2'>
                                                                <Link to={`/account/student-progress/${s.id}`} className='btn btn-sm text-white' style={{ backgroundColor: '#2a9d8f' }}>
                                                                    View Progress
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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

export default ManageStudents
