import React, { useState, useEffect, useContext } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import { apiUrl } from '../../common/config'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/Auth'

const Profile = () => {
    const { user, login } = useContext(AuthContext);
    const navigate = React.useMemo(() => {}, []); // Placeholder for navigation logic if needed later
    
    // Check if user is admin, redirect if so
    if (user && user.role === 'admin') {
        window.location.href = '/account/dashboard';
        return null;
    }

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [phonePrefix, setPhonePrefix] = useState('+1');
    const [language, setLanguage] = useState('');
    const [nationality, setNationality] = useState('');
    const [gender, setGender] = useState('');
    const [birthday, setBirthday] = useState('');
    const [bio, setBio] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState('');
    const [updating, setUpdating] = useState(false);

    // Dropdown options
    const [languages, setLanguages] = useState([]);
    const nationalities = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
        "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
        "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
        "Denmark", "Djibouti", "Dominica", "Dominican Republic",
        "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
        "Fiji", "Finland", "France",
        "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
        "Haiti", "Holy See", "Honduras", "Hungary",
        "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
        "Jamaica", "Japan", "Jordan",
        "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
        "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
        "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
        "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
        "Oman",
        "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
        "Qatar",
        "Romania", "Russia", "Rwanda",
        "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
        "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
        "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
        "Vanuatu", "Venezuela", "Vietnam",
        "Yemen",
        "Zambia", "Zimbabwe"
    ];

    const phonePrefixes = [
        { code: '+1', country: 'USA/Canada', placeholder: '201 555 0123' },
        { code: '+7', country: 'Russia', placeholder: '900 123 45 67' },
        { code: '+20', country: 'Egypt', placeholder: '10 1234 5678' },
        { code: '+27', country: 'South Africa', placeholder: '82 123 4567' },
        { code: '+33', country: 'France', placeholder: '6 12 34 56 78' },
        { code: '+34', country: 'Spain', placeholder: '612 345 678' },
        { code: '+44', country: 'UK', placeholder: '7700 900123' },
        { code: '+49', country: 'Germany', placeholder: '170 1234567' },
        { code: '+90', country: 'Turkey', placeholder: '532 123 45 67' },
        { code: '+91', country: 'India', placeholder: '98765 43210' },
        { code: '+212', country: 'Morocco', placeholder: '6 12 34 56 78' },
        { code: '+213', country: 'Algeria', placeholder: '5 12 34 56 78' },
        { code: '+216', country: 'Tunisia', placeholder: '20 123 456' },
        { code: '+966', country: 'Saudi Arabia', placeholder: '50 123 4567' },
        { code: '+971', country: 'UAE', placeholder: '50 123 4567' },
    ];

    useEffect(() => {
        // Correct API route for filters
        fetch(`${apiUrl}/public/filters`)
            .then(res => res.json())
            .then(data => {
                setLanguages(data.languages || []);
            });

        if (user) {
            setName(user.name || '');
            setLastName(user.last_name || '');
            setEmail(user.email || '');
            
            // Handle phone prefix parsing
            const userPhone = user.phone || '';
            const matchingPrefix = [...phonePrefixes].sort((a, b) => b.code.length - a.code.length).find(p => userPhone.startsWith(p.code));
            if (matchingPrefix) {
                setPhonePrefix(matchingPrefix.code);
                setPhone(userPhone.replace(matchingPrefix.code, '').trim());
            } else {
                setPhone(userPhone);
            }

            setLanguage(user.language || '');
            setNationality(user.nationality || '');
            setGender(user.gender || '');
            setBirthday(user.birthday || '');
            setBio(user.bio || '');
            if (user.profile_pic) {
                const storageUrl = apiUrl.replace('/api', '') + '/storage/';
                setProfilePicUrl(storageUrl + user.profile_pic);
            }
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const fullPhone = phone ? `${phonePrefix}${phone.replace(/\s+/g, '')}` : '';

        const formData = new FormData();
        formData.append('_method', 'PUT'); // REQUIRED for file uploads with PUT in Laravel
        formData.append('name', name);
        formData.append('last_name', lastName);
        formData.append('email', email);
        formData.append('phone', fullPhone);
        formData.append('language', language);
        formData.append('nationality', nationality);
        formData.append('gender', gender);
        formData.append('birthday', birthday);
        formData.append('bio', bio);
        if (profilePic) {
            formData.append('profile_pic', profilePic);
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        const token = userInfo?.token;

        const res = await fetch(`${apiUrl}/profile`, {
            method: 'POST', // Use POST with _method PUT for files
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData
        });

        const result = await res.json();
        setUpdating(false);

        if (res.ok) {
            toast.success('Profile updated successfully');
            const updatedUser = { ...user, ...result.data, token: token };
            localStorage.setItem('userInfoLms', JSON.stringify(updatedUser));
            login(updatedUser);
        } else {
            const errors = result.errors;
            if (errors) {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key][0]);
                });
            } else {
                toast.error(result.message || 'Update failed');
            }
        }
    };

    const currentPrefixObj = phonePrefixes.find(p => p.code === phonePrefix);

    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <h2 className='h4 mb-0'>My Profile</h2>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <div className='card border-0 shadow-sm'>
                                <div className='card-body p-4'>
                                    <form onSubmit={handleUpdate}>
                                        <div className='row mb-4 align-items-center'>
                                            <div className='col-auto'>
                                                <div className='profile-pic-container' style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#eee' }}>
                                                    {profilePicUrl ? (
                                                        <img src={profilePicUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div className='d-flex align-items-center justify-content-center h-100 text-muted'>No Pic</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <label className='form-label'>Profile Picture</label>
                                                <input
                                                    type="file"
                                                    className='form-control'
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        setProfilePic(file);
                                                        setProfilePicUrl(URL.createObjectURL(file));
                                                    }}
                                                    accept="image/*"
                                                />
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-6 mb-3'>
                                                <label className='form-label'>First Name</label>
                                                <input type="text" className='form-control' value={name} onChange={(e) => setName(e.target.value)} required />
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <label className='form-label'>Last Name</label>
                                                <input type="text" className='form-control' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <label className='form-label'>Email</label>
                                                <input type="email" className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} required />
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <label className='form-label'>Phone Number</label>
                                                <div className='input-group'>
                                                    <select 
                                                        className='form-select' 
                                                        style={{ maxWidth: '110px' }} 
                                                        value={phonePrefix} 
                                                        onChange={(e) => setPhonePrefix(e.target.value)}
                                                    >
                                                        {phonePrefixes.map(p => (
                                                            <option key={p.code} value={p.code}>{p.code}</option>
                                                        ))}
                                                    </select>
                                                    <input 
                                                        type="text" 
                                                        className='form-control' 
                                                        value={phone} 
                                                        onChange={(e) => setPhone(e.target.value)} 
                                                        placeholder={currentPrefixObj?.placeholder || '123 456 789'}
                                                    />
                                                </div>
                                                {currentPrefixObj && (
                                                    <div className='form-text small'>{currentPrefixObj.country} format</div>
                                                )}
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <label className='form-label'>Language</label>
                                                <select 
                                                    className='form-select' 
                                                    value={language} 
                                                    onChange={(e) => setLanguage(e.target.value)}
                                                >
                                                    <option value="">Select Language</option>
                                                    {languages.map(lang => (
                                                        <option key={lang.id} value={lang.name}>{lang.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <label className='form-label'>Nationality</label>
                                                <select 
                                                    className='form-select' 
                                                    value={nationality} 
                                                    onChange={(e) => setNationality(e.target.value)}
                                                >
                                                    <option value="">Select Nationality</option>
                                                    {nationalities.map(n => (
                                                        <option key={n} value={n}>{n}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <label className='form-label'>Gender</label>
                                                <select className='form-select' value={gender} onChange={(e) => setGender(e.target.value)}>
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className='col-md-6 mb-3'>
                                                <label className='form-label'>Birthday</label>
                                                <input type="date" className='form-control' value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                                            </div>
                                            <div className='col-md-12 mb-3'>
                                                <label className='form-label'>Bio</label>
                                                <textarea className='form-control' rows="3" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..."></textarea>
                                            </div>
                                        </div>
                                        <button type="submit" className='btn btn-primary' disabled={updating}>
                                            {updating ? 'Updating...' : 'Save Profile'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default Profile
