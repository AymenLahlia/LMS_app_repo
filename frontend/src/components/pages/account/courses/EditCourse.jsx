import React, { useEffect } from 'react'
import UserSidebar from '../../../common/UserSidebar'
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiUrl } from '../../../common/config';

const CourseEdit = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchCourse = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
            const token = userInfo?.token || null;
            const res = await fetch(`${apiUrl}/courses/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                reset(result.data || result);
            } else {
                toast.error('Failed to load course');
            }
        };
        if (id) fetchCourse();
    }, [id]);

    const onSubmit = async (data) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;
        const res = await fetch(`${apiUrl}/courses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok) {
            toast.success('Course updated successfully!');
        } else {
            toast.error(result.message || "Error");
        }
    };

    return (
        <section className='section-4'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12 mt-5 mb-3'>
                        <div className='d-flex justify-content-between'>
                            <h2 className='h3 mb-0 pb-0'>Edit Course</h2>
                            <Link to='/account/my-courses' className='btn btn-primary'>Back</Link>
                        </div>
                    </div>
                    <div className='col-lg-3 account-sidebar'>
                        <UserSidebar />
                    </div>
                    <div className='col-lg-9'>
                        <div className='row'>
                            <div className='col-md-7'>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className='card-body'>
                                        <div className='row'>
                                            <h4 className='pb-3 mb-3'>Course Details</h4>
                                            <div className='mb-3'>
                                                <label className="form-label">Title</label>
                                                <input type="text" placeholder='Title' className='form-control'
                                                    {...register('title', { required: "Title is required" })} />
                                                {errors.title && <span className='text-danger'>{errors.title.message}</span>}
                                            </div>
                                            <div className='mb-3'>
                                                <label className="form-label">Category</label>
                                                <select className='form-select' {...register('category')}>
                                                    <option value="">Select Category</option>
                                                </select>
                                            </div>
                                            <div className='mb-3'>
                                                <label className="form-label">Level</label>
                                                <select className='form-select' {...register('level')}>
                                                    <option value="">Select Level</option>
                                                </select>
                                            </div>
                                            <div className='mb-3'>
                                                <label className="form-label">Language</label>
                                                <select className='form-select' {...register('language')}>
                                                    <option value="">Select Language</option>
                                                </select>
                                            </div>
                                            <div className='mb-3'>
                                                <label className="form-label">Description</label>
                                                <textarea placeholder='Description' className='form-control' rows={5}
                                                    {...register('description')}></textarea>
                                            </div>
                                            <h4 className='pb-3 mb-3'>Pricing</h4>
                                            <div className='mb-3'>
                                                <label className="form-label">Price</label>
                                                <input type="text" placeholder='Price' className='form-control'
                                                    {...register('price', { required: "Price is required" })} />
                                                {errors.price && <span className='text-danger'>{errors.price.message}</span>}
                                            </div>
                                            <div>
                                                <button className='btn btn-primary'>Save Changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className='col-md-5'></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CourseEdit;