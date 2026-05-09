import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Course from './../common/Course'
import Layout from './../common/Layout'
import { apiUrl } from '../common/config'

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);

    // Filter state
    const [keyword, setKeyword] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [sort, setSort] = useState('0');

    // Fetch filter options
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const res = await fetch(`${apiUrl}/public/filters`);
                const result = await res.json();
                if (res.ok) {
                    setCategories(result.categories || []);
                    setLevels(result.levels || []);
                    setLanguages(result.languages || []);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchFilters();
    }, []);

    // Fetch courses whenever filters change
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (keyword) params.append('keyword', keyword);
                if (selectedCategories.length) params.append('category_id', selectedCategories.join(','));
                if (selectedLevels.length) params.append('level_id', selectedLevels.join(','));
                if (selectedLanguages.length) params.append('language_id', selectedLanguages.join(','));
                params.append('sort', sort);

                const res = await fetch(`${apiUrl}/public/courses?${params.toString()}`);
                const result = await res.json();
                if (res.ok) {
                    setCourses(result.data || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [keyword, selectedCategories, selectedLevels, selectedLanguages, sort]);

    const toggleFilter = (list, setList, id) => {
        if (list.includes(id)) {
            setList(list.filter(i => i !== id));
        } else {
            setList([...list, id]);
        }
    };

    const clearFilters = () => {
        setKeyword('');
        setSelectedCategories([]);
        setSelectedLevels([]);
        setSelectedLanguages([]);
        setSort('0');
    };

    return (
        <Layout>
            <div className='container pb-5 pt-3'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Courses</li>
                    </ol>
                </nav>
                <div className='row'>
                    <div className='col-lg-3'>
                        <div className='sidebar mb-5 card border-0'>
                            <div className='card-body shadow'>
                                <input
                                    type="text"
                                    className='form-control'
                                    placeholder='Search by keyword'
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />

                                {/* Categories */}
                                <div className='pt-3'>
                                    <h3 className='h5 mb-2'>Category</h3>
                                    <ul className='list-unstyled'>
                                        {categories.map(cat => (
                                            <li key={cat.id}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`cat-${cat.id}`}
                                                        checked={selectedCategories.includes(cat.id)}
                                                        onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat.id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`cat-${cat.id}`}>
                                                        {cat.name}
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Levels */}
                                <div className='mb-3'>
                                    <h3 className='h5 mb-2'>Level</h3>
                                    <ul className='list-unstyled'>
                                        {levels.map(lvl => (
                                            <li key={lvl.id}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`lvl-${lvl.id}`}
                                                        checked={selectedLevels.includes(lvl.id)}
                                                        onChange={() => toggleFilter(selectedLevels, setSelectedLevels, lvl.id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`lvl-${lvl.id}`}>
                                                        {lvl.name}
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Languages */}
                                <div className='mb-3'>
                                    <h3 className='h5 mb-2'>Language</h3>
                                    <ul className='list-unstyled'>
                                        {languages.map(lang => (
                                            <li key={lang.id}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`lang-${lang.id}`}
                                                        checked={selectedLanguages.includes(lang.id)}
                                                        onChange={() => toggleFilter(selectedLanguages, setSelectedLanguages, lang.id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`lang-${lang.id}`}>
                                                        {lang.name}
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <span className='clear-filter' style={{ cursor: 'pointer', color: '#2a9d8f' }} onClick={clearFilters}>
                                    Clear All Filters
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-9'>
                        <section className='section-3'>
                            <div className='d-flex justify-content-between mb-3 align-items-center'>
                                <div className='h5 mb-0'>
                                    {!loading && `${courses.length} course${courses.length !== 1 ? 's' : ''} found`}
                                </div>
                                <div>
                                    <select className='form-select' value={sort} onChange={(e) => setSort(e.target.value)}>
                                        <option value="0">Newest First</option>
                                        <option value="1">Oldest First</option>
                                    </select>
                                </div>
                            </div>
                            {loading ? (
                                <p>Loading...</p>
                            ) : courses.length === 0 ? (
                                <p className='text-muted'>No courses found matching your filters.</p>
                            ) : (
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
                                            customClasses="col-lg-4 col-md-6"
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Courses
