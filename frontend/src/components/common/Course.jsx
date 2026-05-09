import React from 'react'
import { Link } from 'react-router-dom'
import { apiUrl } from './config'

const Course = ({ id, title, level, language, enrolled, customClasses, image, price }) => {
    const imgSrc = image
        ? `${apiUrl.replace('/api', '')}/storage/${image}`
        : `https://placehold.co/600x350?text=${encodeURIComponent(title || 'Course')}`;

    return (
        <div className={customClasses}>
            <div className='card border-0 shadow-sm h-100'>
                <div className='card-img-top'>
                    <img src={imgSrc} alt={title} className='img-fluid' style={{ height: '180px', width: '100%', objectFit: 'cover' }} />
                </div>
                <div className='card-body'>
                    <div className="card-title fw-bold" style={{ fontSize: '0.95rem' }}>
                        {title}
                    </div>
                    <div className="meta d-flex py-2">
                        {level && (
                            <div className="level">
                                <div className="d-flex align-items-center">
                                    <div className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-briefcase" viewBox="0 0 16 16">
                                            <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5m1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0M1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5"/>
                                        </svg>
                                    </div>
                                    <div className="text ps-1" style={{ fontSize: '0.85rem' }}>{level}</div>
                                </div>
                            </div>
                        )}
                        {language && (
                            <div className="language ps-3">
                                <div className="d-flex align-items-center">
                                    <div className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-translate" viewBox="0 0 16 16">
                                            <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.738L5.447 3.746 4.773 5.976z"/>
                                            <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995c.193.301.402.583.63.846-.748.57-1.492 1.038-2.141 1.392L7 12.02l.311-.469A10 10 0 0 0 8.337 9.9zm.943-2.038c.678 0 1.291-.428 1.479-1.087l.213-.771a.5.5 0 0 0-.485-.634H8.99a.5.5 0 0 0-.46.311l-.213.771a1.446 1.446 0 0 0 1.764 1.764zm.11-1.49.13-.47h.81l-.13.47a.446.446 0 0 1-.81 0zM1.897 1.1c.193.301.402.583.63.846-.748.57-1.492 1.038-2.141 1.392L0 3.125l.311-.469A10 10 0 0 0 1.337 1.1zm.943-2.038c.678 0 1.291-.428 1.479-1.087l.213-.771a.5.5 0 0 0-.485-.634H0.99a.5.5 0 0 0-.46.311l-.213.771a1.446 1.446 0 0 0 1.764 1.764zm.11-1.49.13-.47h.81l-.13.47a.446.446 0 0 1-.81 0z"/>
                                            <path d="M10.582 12.444c-.39 0-.74.248-.83.605l-.18.663a.5.5 0 0 1-.971-.263l.18-.662a1.83 1.83 0 0 1 2.223-1.303l.662.18a.5.5 0 0 1-.262.971l-.663-.18a.831.831 0 0 0-1.159.989l.18.663a.5.5 0 0 1-.97.263l-.18-.662a1.83 1.83 0 0 1 2.223-1.303l.662.18a.5.5 0 0 1-.262.971l-.663-.18a.831.831 0 0 0-1.159.989"/>
                                        </svg>
                                    </div>
                                    <div className="text ps-1" style={{ fontSize: '0.85rem' }}>{language}</div>
                                </div>
                            </div>
                        )}
                        <div className="student ps-3">
                            <div className="d-flex align-items-center">
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                                    </svg>
                                </div>
                                <div className="text ps-1" style={{ fontSize: '0.85rem' }}>{enrolled || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-white border-0 pt-0">
                    <div className="d-flex py-2 justify-content-between align-items-center">
                        <div className="price fw-bold" style={{ color: '#2a9d8f' }}>${price || 0}</div>
                        <div className="add-to-cart">
                            <Link to={`/course/${id}`} className="btn btn-sm text-white" style={{ backgroundColor: '#2a9d8f' }}>Read More</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Course
