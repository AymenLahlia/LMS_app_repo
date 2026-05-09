import React, { useEffect, useState } from 'react'
import UserSidebar from '../../../common/UserSidebar'
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiUrl } from '../../../common/config';
import CourseOutcomes from './CourseOutcomes';
import CourseRequirements from './CourseRequirements';
import CourseCoverImage from './CourseCoverImage';
import CourseChapters from './CourseChapters';

const CourseEdit = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const navigate = useNavigate();
    const { id } = useParams();

    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [courseImage, setCourseImage] = useState(null);
    const [courseStatus, setCourseStatus] = useState(0);

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
                const courseData = result.data || result;
                reset(courseData);
                setCourseImage(courseData.image || null);
                setCourseStatus(courseData.status ?? 0);
            } else {
                toast.error('Failed to load course');
            }
        };

        const fetchDropdowns = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
            const token = userInfo?.token || null;
            const res = await fetch(`${apiUrl}/course-dropdowns`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            const result = await res.json();
            if (res.ok) {
                setCategories(result.categories);
                setLevels(result.levels);
                setLanguages(result.languages);
            }
        };

        if (id) fetchCourse();
        fetchDropdowns();
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

    const togglePublish = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token || null;
        const res = await fetch(`${apiUrl}/courses/${id}/toggle-publish`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        const result = await res.json();
        if (res.ok) {
            setCourseStatus(result.data.status);
            toast.success(result.message);
        } else {
            toast.error('Failed to update status');
        }
    };

    return (
        <section className='section-4'>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12 mt-5 mb-3'>
                        <div className='d-flex justify-content-end'>
                            <button
                                className='btn text-white'
                                style={{ backgroundColor: courseStatus == 1 ? '#6c757d' : '#2a9d8f' }}
                                onClick={togglePublish}
                            >
                                {courseStatus == 1 ? 'Unpublish' : 'Publish'}
                            </button>
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
                                                <select className='form-select' {...register('category_id')}>
                                                    <option value="">Select Category</option>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                </select>
                                            </div>
                                            <div className='mb-3'>
                                                <label className="form-label">Level</label>
                                                <select className='form-select' {...register('level_id')}>
                                                    <option value="">Select Level</option>
                                                    {levels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                                </select>
                                            </div>
                                            <div className='mb-3'>
                                                <label className="form-label">Language</label>
                                                <select className='form-select' {...register('language_id')}>
                                                    <option value="">Select Language</option>
                                                    {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
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
                                <CourseChapters courseId={id} />
                            </div>
                            <div className='col-md-5'>
                                <CourseCoverImage courseId={id} currentImage={courseImage} />
                                <CourseOutcomes courseId={id} />
                                <CourseRequirements courseId={id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CourseEdit;