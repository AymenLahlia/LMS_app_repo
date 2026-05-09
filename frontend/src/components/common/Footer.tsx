import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#2a9d8f' }} className='text-white pt-5 pb-3 mt-5'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-4 mb-4'>
                        <h5 className='fw-bold mb-3'>LMS</h5>
                        <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>
                            Join our Learning Management System and explore a wide range of courses to enhance your skills and achieve your goals.
                        </p>
                    </div>
                    <div className='col-md-4 mb-4'>
                        <h5 className='fw-bold mb-3'>Popular Categories</h5>
                        <ul className='list-unstyled' style={{ fontSize: '0.9rem', opacity: 0.85 }}>
                            <li className='mb-1'><Link to='/courses' className='text-white text-decoration-none'>Web Development</Link></li>
                            <li className='mb-1'><Link to='/courses' className='text-white text-decoration-none'>Finance</Link></li>
                            <li className='mb-1'><Link to='/courses' className='text-white text-decoration-none'>Personal Development</Link></li>
                            <li className='mb-1'><Link to='/courses' className='text-white text-decoration-none'>Marketing</Link></li>
                        </ul>
                    </div>
                    <div className='col-md-4 mb-4'>
                        <h5 className='fw-bold mb-3'>Quick Links</h5>
                        <ul className='list-unstyled' style={{ fontSize: '0.9rem', opacity: 0.85 }}>
                            <li className='mb-1'><Link to='/account/login' className='text-white text-decoration-none'>Login</Link></li>
                            <li className='mb-1'><Link to='/account/register' className='text-white text-decoration-none'>Register</Link></li>
                            <li className='mb-1'><Link to='/account/profile' className='text-white text-decoration-none'>My Account</Link></li>
                            <li className='mb-1'><Link to='/courses' className='text-white text-decoration-none'>Courses</Link></li>
                        </ul>
                    </div>
                </div>
                <hr style={{ opacity: 0.3 }} />
                <div className='text-center' style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    &copy; {new Date().getFullYear()} LMS. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer
