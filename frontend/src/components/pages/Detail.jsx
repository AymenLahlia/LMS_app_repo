import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Rating } from 'react-simple-star-rating'
import { Accordion, Badge, ListGroup, Card } from "react-bootstrap"
import Layout from '../common/Layout'
import { apiUrl } from '../common/config'
import { toast } from 'react-toastify'

const Detail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [outcomes, setOutcomes] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [enrolled, setEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);
    const [loading, setLoading] = useState(true);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    const getUserInfo = () => JSON.parse(localStorage.getItem('userInfoLms') || '{}');
    const getToken = () => getUserInfo()?.token || null;
    const getUserRole = () => getUserInfo()?.role || 'student';
    const getUserId = () => getUserInfo()?.id || null;

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`${apiUrl}/public/courses/${id}`);
                const result = await res.json();
                if (res.ok) {
                    setCourse(result.data);
                    setChapters(result.chapters || []);
                    setOutcomes(result.outcomes || []);
                    setRequirements(result.requirements || []);
                    setReviews(result.reviews || []);
                    setAvgRating(result.avg_rating || 0);
                    // Check if current user already reviewed
                    const uid = getUserId();
                    if (uid && (result.reviews || []).some(r => r.user_id === uid)) {
                        setHasReviewed(true);
                    }
                } else {
                    toast.error('Course not found');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();

        // Check enrollment
        const token = getToken();
        if (token) {
            fetch(`${apiUrl}/check-enrollment/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            })
            .then(r => r.json())
            .then(result => {
                if (result.enrolled) setEnrolled(true);
            })
            .catch(() => {});
        }
    }, [id]);

    const handleEnroll = async () => {
        const token = getToken();
        if (!token) {
            toast.info('Please login to enroll');
            navigate('/account/login');
            return;
        }

        setEnrolling(true);
        const res = await fetch(`${apiUrl}/enroll/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        });
        const result = await res.json();
        setEnrolling(false);

        if (res.ok) {
            setEnrolled(true);
            toast.success('Enrolled successfully!');
        } else {
            toast.error(result.message || 'Failed to enroll');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (reviewRating === 0) {
            toast.error('Please select a rating');
            return;
        }
        const token = getToken();
        setSubmittingReview(true);
        const res = await fetch(`${apiUrl}/reviews/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
        });
        const result = await res.json();
        setSubmittingReview(false);
        if (res.ok) {
            setReviews([result.data, ...reviews]);
            setHasReviewed(true);
            setReviewRating(0);
            setReviewComment('');
            toast.success('Review submitted!');
        } else {
            toast.error(result.message || 'Failed to submit review');
        }
    };

    // Calculate totals for course structure summary
    const totalChapters = chapters.length;
    const totalLessons = chapters.reduce((sum, ch) => sum + (ch.lessons?.length || 0), 0);
    const totalDuration = chapters.reduce((sum, ch) => {
        return sum + (ch.lessons || []).reduce((s, l) => s + (l.duration || 0), 0);
    }, 0);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return <Layout><div className='container py-5 text-center'>Loading...</div></Layout>;
    }

    if (!course) {
        return <Layout><div className='container py-5 text-center'>Course not found.</div></Layout>;
    }

    const storageUrl = apiUrl.replace('/api', '') + '/storage/';

    return (
        <Layout>
        <div className='container pb-5 pt-3'>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/courses">Courses</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">{course.title}</li>
                </ol>
            </nav>

            {/* Preview Video Modal */}
            {previewVideo && (
                <>
                    <div className='modal-backdrop fade show' onClick={() => setPreviewVideo(null)}></div>
                    <div className='modal fade show d-block' tabIndex='-1' style={{ zIndex: 1060 }} onClick={() => setPreviewVideo(null)}>
                        <div className='modal-dialog modal-lg' onClick={(e) => e.stopPropagation()}>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h5 className='modal-title'>Preview</h5>
                                    <button type='button' className='btn-close' onClick={() => setPreviewVideo(null)}></button>
                                </div>
                                <div className='modal-body p-0'>
                                    <video
                                        src={`${storageUrl}${previewVideo}`}
                                        controls
                                        autoPlay
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className='row my-5'>
                <div className='col-lg-8'>
                    {/* Title + Badge + Rating */}
                    <h2>{course.title}</h2>
                    <div className='d-flex align-items-center mb-3'>
                        {course.category && (
                            <span className="badge me-3" style={{ backgroundColor: '#2a9d8f', fontSize: '0.8rem' }}>{course.category.name}</span>
                        )}
                        {avgRating > 0 && (
                            <div className='d-flex align-items-center'>
                                <span className='me-1 fw-bold'>{avgRating}</span>
                                <Rating initialValue={avgRating} size={18} readonly={true} allowFraction={true} />
                            </div>
                        )}
                    </div>

                    {/* Meta row: Category, Level, Students, Language */}
                    <div className="row mb-4">
                        {course.category && (
                            <div className="col">
                                <span className="text-muted d-block" style={{ fontSize: '0.85rem' }}>Category</span>
                                <span className="fw-bold">{course.category.name}</span>
                            </div>
                        )}
                        {course.level && (
                            <div className="col">
                                <span className="text-muted d-block" style={{ fontSize: '0.85rem' }}>Level</span>
                                <span className="fw-bold">{course.level.name}</span>
                            </div>
                        )}
                        <div className="col">
                            <span className="text-muted d-block" style={{ fontSize: '0.85rem' }}>Students</span>
                            <span className="fw-bold">{course.enrollments_count || 0}</span>
                        </div>
                        {course.language && (
                            <div className="col">
                                <span className="text-muted d-block" style={{ fontSize: '0.85rem' }}>Language</span>
                                <span className="fw-bold">{course.language.name}</span>
                            </div>
                        )}
                    </div>

                    {/* Overview */}
                    {course.description && (
                        <div className='col-md-12 mt-2'>
                            <div className='border bg-white rounded-3 p-4'>
                                <h3 className='mb-3 h4'>Overview</h3>
                                <div dangerouslySetInnerHTML={{ __html: course.description }} />
                            </div>
                        </div>
                    )}

                    {/* What you will learn */}
                    {outcomes.length > 0 && (
                        <div className='col-md-12 mt-4'>
                            <div className='border bg-white rounded-3 p-4'>
                                <h3 className='mb-3 h4'>What you will learn</h3>
                                <ul className="list-unstyled mt-3">
                                    {outcomes.map(o => (
                                        <li key={o.id} className="d-flex align-items-center mb-2">
                                            <span className="text-success me-2">&#10003;</span>
                                            <span>{o.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Requirements */}
                    {requirements.length > 0 && (
                        <div className='col-md-12 mt-4'>
                            <div className='border bg-white rounded-3 p-4'>
                                <h3 className='mb-3 h4'>Requirements</h3>
                                <ul className="list-unstyled mt-3">
                                    {requirements.map(r => (
                                        <li key={r.id} className="d-flex align-items-center mb-2">
                                            <span className="text-success me-2">&#10003;</span>
                                            <span>{r.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Course Structure */}
                    {chapters.length > 0 && (
                        <div className='col-md-12 mt-4'>
                            <div className='border bg-white rounded-3 p-4'>
                                <h3 className="h4 mb-1">Course Structure</h3>
                                <p className='text-muted mb-3' style={{ fontSize: '0.9rem' }}>
                                    {totalChapters} Chapter{totalChapters !== 1 ? 's' : ''} · {totalLessons} Lecture{totalLessons !== 1 ? 's' : ''} · {totalDuration} min
                                </p>
                                <Accordion id="courseAccordion">
                                    {chapters.map((chapter, idx) => {
                                        const chLessons = chapter.lessons || [];
                                        const chDuration = chLessons.reduce((s, l) => s + (l.duration || 0), 0);
                                        return (
                                            <Accordion.Item eventKey={String(idx)} key={chapter.id}>
                                                <Accordion.Header>
                                                    <span>{chapter.title}</span>
                                                    <span className="ms-2 text-muted" style={{ fontSize: '0.85rem' }}>
                                                        ({chLessons.length} lecture{chLessons.length !== 1 ? 's' : ''} – {chDuration} min)
                                                    </span>
                                                </Accordion.Header>
                                                <Accordion.Body className='p-0'>
                                                    <ListGroup variant='flush'>
                                                        {chLessons.map(lesson => (
                                                            <ListGroup.Item key={lesson.id} className="d-flex justify-content-between align-items-center px-3 py-2">
                                                                <span>{lesson.title}</span>
                                                                <div className='d-flex align-items-center gap-2'>
                                                                    {lesson.is_free_preview === 'yes' && lesson.video && (
                                                                        <Badge
                                                                            bg="primary"
                                                                            style={{ cursor: 'pointer' }}
                                                                            onClick={() => setPreviewVideo(lesson.video)}
                                                                        >
                                                                            Preview
                                                                        </Badge>
                                                                    )}
                                                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>{lesson.duration || 0} min</span>
                                                                </div>
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        );
                                    })}
                                </Accordion>
                            </div>
                        </div>
                    )}

                    {/* Reviews */}
                    <div className='col-md-12 mt-4'>
                        <div className='border bg-white rounded-3 p-4'>
                            <h3 className='mb-1 h4'>Reviews</h3>
                            <p className='text-muted' style={{ fontSize: '0.9rem' }}>Our student says about this course</p>

                            {reviews.length === 0 ? (
                                <p className='text-muted'>No reviews yet.</p>
                            ) : (
                                <div className='mt-3'>
                                    {reviews.map((review, idx) => (
                                        <div
                                            key={review.id}
                                            className={`d-flex align-items-start mb-3 pb-3 ${idx < reviews.length - 1 ? 'border-bottom' : ''}`}
                                        >
                                            <div
                                                className="rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{
                                                    width: 45, height: 45,
                                                    backgroundColor: '#e0e0e0',
                                                    color: '#666',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {review.user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <h6 className="mb-0">
                                                    <span className='fw-bold'>{review.user?.name || 'Anonymous'}</span>
                                                    {' '}
                                                    <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>
                                                        {formatDate(review.created_at)}
                                                    </span>
                                                </h6>
                                                <div className="mb-1">
                                                    <Rating initialValue={review.rating} size={16} readonly={true} />
                                                </div>
                                                <p className="mb-0" style={{ fontSize: '0.9rem' }}>{review.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Review submission form — only for enrolled students */}
                            {enrolled && !hasReviewed && getUserRole() === 'student' && (
                                <div className='mt-4 pt-3 border-top'>
                                    <h6 className='fw-bold'>Leave a Review</h6>
                                    <form onSubmit={handleSubmitReview}>
                                        <div className='mb-2'>
                                            <Rating
                                                onClick={(rate) => setReviewRating(rate)}
                                                initialValue={reviewRating}
                                                size={24}
                                            />
                                        </div>
                                        <div className='mb-2'>
                                            <textarea
                                                className='form-control'
                                                rows={3}
                                                placeholder='Write your review...'
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button
                                            type='submit'
                                            className='btn btn-sm text-white'
                                            style={{ backgroundColor: '#2a9d8f' }}
                                            disabled={submittingReview}
                                        >
                                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>
                            )}
                            {hasReviewed && enrolled && (
                                <p className='mt-3 text-success' style={{ fontSize: '0.9rem' }}>✓ You have already reviewed this course</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className='col-lg-4'>
                    <div className='border rounded-3 bg-white p-4 shadow-sm sticky-top' style={{ top: '20px' }}>
                        {/* Course Image */}
                        {course.image ? (
                            <img
                                src={`${storageUrl}${course.image}`}
                                alt={course.title}
                                className='img-fluid rounded mb-3'
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                        ) : (
                            <div
                                className='rounded mb-3 d-flex align-items-center justify-content-center'
                                style={{ width: '100%', height: '200px', backgroundColor: '#f0f0f0' }}
                            >
                                <span className='text-muted'>No Image</span>
                            </div>
                        )}

                        <h3 className="fw-bold mb-0">${course.price || 0}</h3>
                        {course.cross_price && (
                            <div className="text-muted text-decoration-line-through mb-2">${course.cross_price}</div>
                        )}

                        <div className="mt-3">
                            {enrolled ? (
                                <Link to="/account/courses-enrolled" className="btn btn-success w-100">
                                    Go to My Learning
                                </Link>
                            ) : (
                                <button
                                    className="btn w-100 text-white"
                                    style={{ backgroundColor: '#2a9d8f' }}
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                >
                                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                                </button>
                            )}
                        </div>

                        <div className='mt-4'>
                            <h6 className="fw-bold">This course includes</h6>
                            <ListGroup variant="flush">
                                <ListGroup.Item className='ps-0 border-0' style={{ fontSize: '0.9rem' }}>
                                    <span className='text-primary me-2'>∞</span>
                                    Full lifetime access
                                </ListGroup.Item>
                                <ListGroup.Item className='ps-0 border-0' style={{ fontSize: '0.9rem' }}>
                                    <span className='text-primary me-2'>📺</span>
                                    Access on mobile and TV
                                </ListGroup.Item>
                                <ListGroup.Item className='ps-0 border-0' style={{ fontSize: '0.9rem' }}>
                                    <span className='text-primary me-2'>🏆</span>
                                    Certificate of completion
                                </ListGroup.Item>
                            </ListGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Layout>
    )
}

export default Detail
