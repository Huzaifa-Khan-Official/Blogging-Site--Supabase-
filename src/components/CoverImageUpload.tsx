import React, { useRef } from 'react';

interface CoverImageUploadProps {
    coverImage: File | null;
    onCoverImageChange: (file: File | null) => void;
}

const CoverImageUpload: React.FC<CoverImageUploadProps> = ({
    coverImage,
    onCoverImageChange
}) => {
    const coverImgRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File) => {
        const FILE_LIMIT = 5 * 1024 * 1024; // 5MB

        if (file.size > FILE_LIMIT) {
            alert('Cover image size should be less than 5MB');
            return;
        }
        onCoverImageChange(file);
    };

    const coverUrl = coverImage ? URL.createObjectURL(coverImage) : '';

    return (
        <>
            <button
                type="button"
                className="p-2 px-4 rounded-xl bg-white shadow-md w-fit cursor-pointer"
                onClick={() => coverImgRef.current?.click()}
            >
                Choose a cover image
            </button>

            <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    if (e.target.files?.[0]) {
                        handleFileChange(e.target.files[0]);
                    }
                }}
                ref={coverImgRef}
            />

            {coverUrl && (
                <img
                    src={coverUrl}
                    alt="Cover"
                    className="w-48 h-48 object-cover rounded-2xl"
                />
            )}
        </>
    );
};

export default CoverImageUpload;