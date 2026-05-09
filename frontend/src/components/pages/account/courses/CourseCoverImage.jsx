import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiUrl } from '../../../common/config';

const CourseCoverImage = ({ courseId, currentImage }) => {
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(currentImage || null);

    // Sync when currentImage prop changes (course data loaded async)
    useEffect(() => {
        if (currentImage) setImageUrl(currentImage);
    }, [currentImage]);

    // Derive the backend base URL from apiUrl (remove /api)
    const backendUrl = apiUrl.replace('/api', '');

    const getToken = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');
        return userInfo?.token || null;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select an image first');
            return;
        }

        setUploading(true);
        const token = getToken();
        const formData = new FormData();
        formData.append('image', selectedFile);

        const res = await fetch(`${apiUrl}/courses/${courseId}/update-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData
        });
        const result = await res.json();
        setUploading(false);

        if (res.ok) {
            setImageUrl(result.data.image);
            setPreview(null);
            setSelectedFile(null);
            toast.success('Cover image updated!');
        } else {
            toast.error(result.errors?.image?.[0] || 'Failed to upload image');
        }
    };

    const displayImage = preview
        ? preview
        : imageUrl
            ? `${backendUrl}/storage/${imageUrl}`
            : null;

    return (
        <div className='card border-0 shadow-sm mb-4'>
            <div className='card-header bg-white'>
                <h4 className='mb-0'>Cover Image</h4>
            </div>
            <div className='card-body'>
                {/* Image preview */}
                {displayImage ? (
                    <div className='mb-3 text-center'>
                        <img
                            src={displayImage}
                            alt='Course cover'
                            className='img-fluid rounded'
                            style={{ maxHeight: '220px', objectFit: 'cover', width: '100%' }}
                        />
                    </div>
                ) : (
                    <div
                        className='mb-3 d-flex align-items-center justify-content-center rounded'
                        style={{
                            height: '160px',
                            backgroundColor: '#f0f0f0',
                            border: '2px dashed #ccc',
                        }}
                    >
                        <span className='text-muted'>No cover image</span>
                    </div>
                )}

                {/* File input */}
                <div className='mb-3'>
                    <input
                        type='file'
                        className='form-control'
                        accept='image/jpeg,image/png,image/jpg,image/gif,image/webp'
                        onChange={handleFileChange}
                    />
                    <small className='text-muted'>Max 2MB. JPG, PNG, GIF, or WebP.</small>
                </div>

                {/* Upload button */}
                {selectedFile && (
                    <button
                        className='btn btn-primary w-100'
                        onClick={handleUpload}
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CourseCoverImage;
