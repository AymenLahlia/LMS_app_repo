import React, { useState } from 'react'
import UserSidebar from '../common/UserSidebar'
import Layout from '../common/Layout'
import { apiUrl } from '../common/config'
import { toast } from 'react-toastify'

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        setSaving(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;

        const res = await fetch(`${apiUrl}/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: confirmPassword,
            })
        });

        const result = await res.json();
        setSaving(false);

        if (res.ok) {
            toast.success('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            toast.error(result.message || 'Failed to change password');
        }
    };

    return (
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="/account/dashboard">Account</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">Change Password</li>
                                </ol>
                            </nav>
                            <h2 className='h4 mb-0 pb-0'>Change Password</h2>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <div className='card border-0 shadow-sm'>
                                <div className='card-body p-4'>
                                    <form onSubmit={handleSubmit}>
                                        <div className='mb-3'>
                                            <label className='form-label' style={{ color: '#2a9d8f', fontWeight: 'bold' }}>
                                                Current Password
                                            </label>
                                            <input
                                                type='password'
                                                className='form-control'
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                required
                                                placeholder='Enter current password'
                                            />
                                        </div>
                                        <div className='mb-3'>
                                            <label className='form-label' style={{ color: '#2a9d8f', fontWeight: 'bold' }}>
                                                New Password
                                            </label>
                                            <input
                                                type='password'
                                                className='form-control'
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                placeholder='Enter new password'
                                            />
                                        </div>
                                        <div className='mb-3'>
                                            <label className='form-label' style={{ color: '#2a9d8f', fontWeight: 'bold' }}>
                                                Confirm New Password
                                            </label>
                                            <input
                                                type='password'
                                                className='form-control'
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                placeholder='Confirm new password'
                                            />
                                        </div>
                                        <button
                                            type='submit'
                                            className='btn text-white'
                                            style={{ backgroundColor: '#2a9d8f' }}
                                            disabled={saving}
                                        >
                                            {saving ? 'Updating...' : 'Change Password'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default ChangePassword
