"use client"

import Image from "next/image"
import type React from "react"
import { useRef, useState } from "react"

interface CoverImageUploadProps {
    coverImage: File | null
    onCoverImageChange: (file: File | null) => void
    existingImage?: string
}

const CoverImageUpload: React.FC<CoverImageUploadProps> = ({ coverImage, onCoverImageChange, existingImage }) => {
    const coverImgRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(existingImage || null)

    const handleFileChange = (file: File) => {
        const FILE_LIMIT = 5 * 1024 * 1024 // 5MB

        if (file.size > FILE_LIMIT) {
            alert("Cover image size should be less than 5MB")
            return
        }
        onCoverImageChange(file)
    }

    const coverUrl = coverImage ? URL.createObjectURL(coverImage) : ""

    return (
        <>
            {preview && (
                <div className="relative w-full h-64">
                    <Image src={preview || "/placeholder.svg"} alt="Cover preview" fill className="object-cover rounded-lg" />
                </div>
            )}

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
                        handleFileChange(e.target.files[0])
                    }
                }}
                ref={coverImgRef}
            />

            {coverUrl && (
                <img src={coverUrl || "/placeholder.svg"} alt="Cover" className="w-48 h-48 object-cover rounded-2xl" />
            )}
        </>
    )
}

export default CoverImageUpload
