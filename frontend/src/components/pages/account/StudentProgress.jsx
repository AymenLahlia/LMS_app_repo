import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import { apiUrl } from '../../common/config'
import { toast } from 'react-toastify'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const StudentProgress = () => {
    const { userId } = useParams();
    const [student, setStudent] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editEmail, setEditEmail] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchProgress = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
            const token = userInfo?.token;
            const res = await fetch(`${apiUrl}/admin/students/${userId}/progress`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setStudent(result.student);
                setCourses(result.courses || []);
                setEditEmail(result.student.email);
            }
            setLoading(false);
        };
        fetchProgress();
    }, [userId]);

    const handleUpdateStudent = async (e) => {
        e.preventDefault();

        // Validation
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!emailRegex.test(editEmail.trim())) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (editPassword && !passwordRegex.test(editPassword)) {
            toast.error("Password must include uppercase, lowercase, numbers, symbols and be min 8 chars");
            return;
        }

        setUpdating(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token;

        const res = await fetch(`${apiUrl}/admin/students/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: editEmail.trim().toLowerCase(),
                password: editPassword
            })
        });

        const result = await res.json();
        setUpdating(false);

        if (res.ok) {
            toast.success('Student updated successfully');
            setEditPassword('');
            setStudent({ ...student, email: editEmail.trim().toLowerCase() });
            setShowEditModal(false);
        } else {
            const errors = result.errors;
            if (errors) {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key][0]);
                });
            } else {
                toast.error(result.message || 'Update failed');
            }
        }
    };

    const storageUrl = apiUrl.replace('/api', '') + '/storage/';

    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/account/dashboard">Account</Link></li>
                            <li className="breadcrumb-item"><Link to="/account/manage-students">Students</Link></li>
                            <li className="breadcrumb-item active">{student?.name || 'Student'}</li>
                        </ol>
                    </nav>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3 d-flex justify-content-between align-items-center'>
                            <h2 className='h4 mb-0'>
                                Student Progress {student && <span className='text-muted'>— {student.name} {student.last_name}</span>}
                            </h2>
                            <button className='btn btn-outline-primary btn-sm' onClick={() => setShowEditModal(true)}>
                                Edit Login Details
                            </button>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            {/* Student Profile Info (Read-only) */}
                            {student && (
                                <div className='card border-0 shadow-sm mb-4'>
                                    <div className='card-body p-4'>
                                        <div className='row align-items-center mb-4'>
                                            <div className='col-auto'>
                                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#eee' }}>
                                                    {student.profile_pic ? (
                                                        <img src={`${storageUrl}${student.profile_pic}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div className='d-flex align-items-center justify-content-center h-100 text-muted' style={{ fontSize: '0.8rem' }}>No Pic</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <h5 className='mb-1'>{student.name} {student.last_name}</h5>
                                                <p className='text-muted mb-0' style={{ fontSize: '0.9rem' }}>{student.email}</p>
                                            </div>
                                        </div>
                                        <div className='row g-3'>
                                            <div className='col-md-4'>
                                                <span className='text-muted d-block' style={{ fontSize: '0.8rem' }}>Phone</span>
                                                <span className='fw-bold'>{student.phone || 'N/A'}</span>
                                            </div>
                                            <div className='col-md-4'>
                                                <span className='text-muted d-block' style={{ fontSize: '0.8rem' }}>Nationality</span>
                                                <span className='fw-bold'>{student.nationality || 'N/A'}</span>
                                            </div>
                                            <div className='col-md-4'>
                                                <span className='text-muted d-block' style={{ fontSize: '0.8rem' }}>Language</span>
                                                <span className='fw-bold'>{student.language || 'N/A'}</span>
                                            </div>
                                            <div className='col-md-4'>
                                                <span className='text-muted d-block' style={{ fontSize: '0.8rem' }}>Gender</span>
                                                <span className='fw-bold'>{student.gender || 'N/A'}</span>
                                            </div>
                                            <div className='col-md-4'>
                                                <span className='text-muted d-block' style={{ fontSize: '0.8rem' }}>Birthday</span>
                                                <span className='fw-bold'>{student.birthday || 'N/A'}</span>
                                            </div>
                                            <div className='col-md-4'>
                                                <span className='text-muted d-block' style={{ fontSize: '0.8rem' }}>Terms Accepted</span>
                                                <span className='badge bg-success'>Yes</span>
                                            </div>
                                            {student.bio && (
                                                <div className='col-12'>
                                                    <span className='text-muted d-block' style={{ fontSize: '0.8rem' }}>Bio</span>
                                                    <p className='mb-0' style={{ fontSize: '0.9rem' }}>{student.bio}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h5 className='mb-3'>Enrolled Courses Progress</h5>
                            {loading ? <p>Loading...</p> : courses.length === 0 ? (
                                <p className='text-muted'>This student has no enrollments yet.</p>
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
                                                        style={{ height: '140px', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div className='card-img-top d-flex align-items-center justify-content-center' style={{ height: '140px', backgroundColor: '#f0f0f0' }}>
                                                        <span className='text-muted'>No Image</span>
                                                    </div>
                                                )}
                                                <div className='card-body'>
                                                    <h6 className='fw-bold'>{course.title}</h6>
                                                    {course.category_name && (
                                                        <span className='badge me-2 mb-2' style={{ backgroundColor: '#2a9d8f', fontSize: '0.7rem' }}>
                                                            {course.category_name}
                                                        </span>
                                                    )}
                                                    <div className='mt-2'>
                                                        <div className='d-flex justify-content-between mb-1' style={{ fontSize: '0.85rem' }}>
                                                            <span>{course.completed_lessons}/{course.total_lessons} lessons</span>
                                                            <span className='fw-bold'>{course.progress_percentage}%</span>
                                                        </div>
                                                        <div className="progress" style={{ height: '10px' }}>
                                                            <div
                                                                className="progress-bar"
                                                                style={{
                                                                    width: `${course.progress_percentage}%`,
                                                                    backgroundColor: course.progress_percentage === 100 ? '#28a745' : '#2a9d8f'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
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

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <form onSubmit={handleUpdateStudent}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Login Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p className='text-muted small'>Admins can only edit Email and Password for security reasons. Other profile details are managed by the student.</p>
                        <div className='mb-3'>
                            <label className='form-label'>Email</label>
                            <input
                                type="email"
                                className='form-control'
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <label className='form-label'>New Password (optional)</label>
                            <input
                                type="password"
                                className='form-control'
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                                placeholder="******"
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={updating}>
                            {updating ? 'Updating...' : 'Save Changes'}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </Layout>
    )
}

export default StudentProgress
