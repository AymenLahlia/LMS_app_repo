import React from 'react'
import UserSidebar from '../../../common/UserSidebar'
import Header from '../../../common/Header'
import Footer from '../../../common/Footer'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { apiUrl, userToken } from '../../../common/config.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateCourse = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {

        const userInfo = localStorage.getItem('userInfoLms');
        const token = userInfo ? JSON.parse(userInfo).token : null;

        const res = await fetch(`${apiUrl}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            navigate('/account/courses/edit/' + result.data.id);
        } else {
            toast.error(result.message || "Error");
        }
    };
    return (
        <>
            <Header />
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h3 mb-0 pb-0'>Create Course</h2>
                                <Link to='/account/my-courses/create' className='btn btn-primary'>Back</Link>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='card border-0'>
                                    <div className='card-body'>
                                        <div className='row'>
                                            <div className='mb-3'>
                                                <label htmlFor="" className='form-label'>Title</label>
                                                <input type="text" placeholder='Title' className='form-control'
                                                    {...register('title', { required: "Title is required" })} />
                                                {errors.title && <span className='text-danger'>
                                                    {errors.title.message}
                                                </span>}
                                            </div>
                                            <div>
                                                <button className='btn btn-primary'>Create</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};
export default CreateCourse;