import React, { useEffect, useState } from 'react'
import Course from './Course'
import { apiUrl } from './config'

const FeaturedCourses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch(`${apiUrl}/public/courses/featured`);
                const result = await res.json();
                if (res.ok) {
                    setCourses(result.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch featured courses', err);
            }
        };
        fetchFeatured();
    }, []);

    if (courses.length === 0) return null;

    return (
        <section className='section-3 my-5'>    
            <div className="container">
                <div className='section-title py-3 mt-4'>
                    <h2 className='h3'>Featured Courses</h2>
                    <p>Discover courses designed to help you excel in your professional and personal growth.</p>
                </div>
                <div className="row gy-4">
                    {courses.map(course => (
                        <Course
                            key={course.id}
                            id={course.id}
                            title={course.title}
                            level={course.level?.name}
                            language={course.language?.name}
                            enrolled={course.enrollments_count}
                            image={course.image}
                            price={course.price}
                            customClasses="col-lg-3 col-md-6"
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedCourses
