import React from 'react'
import Layout from '../common/Layout'
import { Link, useNavigate} from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { apiUrl } from '../common/config';
import { toast } from 'react-hot-toast';


const Register = () => {
    const navigate = useNavigate();
    const {
        handleSubmit, register, formState: {errors}, setError
    } = useForm();

    const onSubmit = async (data) => {
        // console.log(data)
        await fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            if (result.status === 200) {
                toast.success(result.message)
                navigate('/account/login');
            } else {
                const errors = result.errors;
                Object.keys(errors).forEach(field => {
                    setError(field,{message: errors[field][0]})
                })
            }
        })
    }
  return (
    <Layout>
        <div className='container py-5 mt-5'>
            <div className='d-flex align-items-center justify-content-center'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='card border-0 shadow register'>
                        <div className='card-body p-4'>
                            <h3 className='border-bottom pb-3 mb-3'>Register</h3>

                            <div className='mb-3'>
                                <label className='form-label' htmlFor="name">Name</label>
                                <input    
                                {
                                    ...register("name", { 
                                        required: "Name is required", 
                                     })
                                }                                 
                                type="text" 
                                className={`form-control ${errors.name && 'is-invalid'}`} 
                                placeholder='Name' />   
                                {
                                    errors.name && <p className='invalid-feedback'>{errors.name.message}</p>
                                }                            
                            </div>


                            <div className='mb-3'>
                                <label className='form-label' htmlFor="email">Email</label>
                                <input 
                                 {
                                    ...register("email", { 
                                        required: "email is required", 
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        } 
                                     })
                                }   
                                type="text" 
                                className={`form-control ${errors.email && 'is-invalid'}` } 
                                placeholder='Email' />
                                {
                                    errors.email && <p className='invalid-feedback'>{errors.email.message}</p>
                                }    
                                
                            </div>

                            <div className='mb-3'>
                                <label className='form-label' htmlFor="password">Password</label>
                                <input 
                                {
                                    ...register("password", { 
                                        required: "password is required", 
                                     })
                                }     
                                type="password" 
                                className={`form-control ${errors.password && 'is-invalid'}`} 
                                placeholder='Password' />   
                                {
                                    errors.password && <p className='invalid-feedback'>{errors.password.message}</p>
                                }                                 
                            </div>

                            <div>
                                <button className='btn btn-primary w-100'>Register</button>
                            </div>

                            <div className='d-flex justify-content-center py-3'>
                                Already have account? &nbsp;<Link className='text-secondary' to={`/account/login`}> Login</Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </Layout>
  )
}

export default Register
