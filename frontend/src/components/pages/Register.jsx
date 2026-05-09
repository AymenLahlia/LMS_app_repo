import React, { useState } from 'react'
import Layout from '../common/Layout'
import { Link, useNavigate} from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { apiUrl } from '../common/config';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


const Register = () => {
    const navigate = useNavigate();
    const [showTerms, setShowTerms] = useState(false);
    const {
        handleSubmit, register, formState: {errors}, setError
    } = useForm();

    const onSubmit = async (data) => {
        // Normalize email
        data.email = data.email.trim().toLowerCase();

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
                if (errors) {
                    Object.keys(errors).forEach(field => {
                        setError(field,{message: errors[field][0]})
                    })
                } else {
                    toast.error(result.message || "Registration failed");
                }
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
                                <label className='form-label' htmlFor="name">First Name</label>
                                <input    
                                {
                                    ...register("name", { 
                                        required: "Name is required", 
                                     })
                                }                                 
                                type="text" 
                                className={`form-control ${errors.name && 'is-invalid'}`} 
                                placeholder='First Name' />   
                                {
                                    errors.name && <p className='invalid-feedback'>{errors.name.message}</p>
                                }                            
                            </div>


                            <div className='mb-3'>
                                <label className='form-label' htmlFor="email">Email</label>
                                <input 
                                 {
                                    ...register("email", { 
                                        required: "Email is required", 
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address (must include local part, @, domain and TLD)"
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
                                        required: "Password is required",
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                            message: "Password must have at least one uppercase, one lowercase, one number, one symbol and be at least 8 characters long"
                                        }
                                     })
                                }     
                                type="password" 
                                className={`form-control ${errors.password && 'is-invalid'}`} 
                                placeholder='Password' />   
                                {
                                    errors.password && <p className='invalid-feedback'>{errors.password.message}</p>
                                }                                 
                            </div>

                            <div className="mb-3 form-check">
                                <input 
                                    type="checkbox" 
                                    className={`form-check-input ${errors.terms_accepted && 'is-invalid'}`} 
                                    id="terms_accepted"
                                    {...register("terms_accepted", { required: "You must accept the terms" })}
                                />
                                <label className="form-check-label" htmlFor="terms_accepted">
                                    I accept the <a href="#" onClick={(e) => { e.preventDefault(); setShowTerms(true); }}>Terms & Conditions</a>
                                </label>
                                {errors.terms_accepted && <p className='invalid-feedback'>{errors.terms_accepted.message}</p>}
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

        <Modal show={showTerms} onHide={() => setShowTerms(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Terms & Conditions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h6>1. Information Disclosure</h6>
                <p>By registering, you acknowledge that your profile information (Name, Email, Phone, Nationality, etc.) will be visible to the system administrators for management and educational tracking purposes.</p>
                
                <h6>2. Security</h6>
                <p>We implement professional-grade security measures for your data. You are responsible for maintaining the confidentiality of your password.</p>

                <h6>3. Course Content</h6>
                <p>All materials provided in courses are for personal educational use only.</p>

                <h6>4. Conduct</h6>
                <p>Students are expected to maintain professional conduct within the platform.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowTerms(false)}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </Layout>
  )
}

export default Register
