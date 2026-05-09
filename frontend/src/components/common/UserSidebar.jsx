import React from 'react'
import { FaChartBar, FaDesktop, FaUserLock, FaUser, FaUsers } from "react-icons/fa";
import { BsMortarboardFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const UserSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
    const role = userInfo?.role || 'student';

    const handleLogout = () => {
        localStorage.removeItem('userInfoLms');
        navigate('/account/login');
    };

    const isActive = (path) => currentPath === path;
    const linkStyle = (path) => isActive(path) ? { color: '#2a9d8f' } : {};

    return (
        <div className='card border-0 shadow-lg'>
            <div className='card-body p-4'>
                <ul>
                    <li className='d-flex align-items-center'>
                        <Link to="/account/dashboard" style={linkStyle('/account/dashboard')}>
                            <FaChartBar size={16} className='me-2' /> Dashboard
                        </Link>
                    </li>
                    {role === 'student' && (
                        <li className='d-flex align-items-center'>
                            <Link to="/account/profile" style={linkStyle('/account/profile')}>
                                <FaUser size={16} className='me-2' /> My Account
                            </Link>
                        </li>
                    )}

                    {role === 'admin' && (
                        <>
                            <li className='d-flex align-items-center'>
                                <Link to="/account/my-courses" style={linkStyle('/account/my-courses')}>
                                    <FaDesktop size={16} className='me-2' /> My Courses
                                </Link>
                            </li>
                            <li className='d-flex align-items-center'>
                                <Link to="/account/manage-students" style={linkStyle('/account/manage-students')}>
                                    <FaUsers size={16} className='me-2' /> Manage Students
                                </Link>
                            </li>
                        </>
                    )}

                    {role === 'student' && (
                        <li className='d-flex align-items-center'>
                            <Link to="/account/my-learning" style={linkStyle('/account/my-learning')}>
                                <BsMortarboardFill size={16} className='me-2' /> My Enrollments
                            </Link>
                        </li>
                    )}

                    <li className='d-flex align-items-center'>
                        <Link to="/account/change-password" style={linkStyle('/account/change-password')}>
                            <FaUserLock size={16} className='me-2' /> Change Password
                        </Link>
                    </li>
                    <li>
                        <span className='text-danger' style={{ cursor: 'pointer' }} onClick={handleLogout}>
                            <MdLogout size={16} className='me-2' /> Logout
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default UserSidebar
