import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from './config'

const FeaturedCtegories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${apiUrl}/public/filters`);
                const result = await res.json();
                if (res.ok) {
                    setCategories(result.categories || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    if (categories.length === 0) return null;

    return (
        <section className='section-2'>
            <div className="container">
                <div className='section-title py-3 mt-4'>
                    <h2 className='h3'>Explore Categories</h2>
                    <p>Discover categories designed to help you excel in your professional and personal growth.</p>
                </div>
                <div className='row gy-3'>
                    {categories.map(cat => (
                        <div className='col-6 col-md-6 col-lg-3' key={cat.id}>
                            <Link to='/courses' className='text-decoration-none'>
                                <div className='card shadow border-0 h-100'>
                                    <div className='card-body'>
                                        <span className='text-dark fw-bold'>{cat.name}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedCtegories
