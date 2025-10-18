"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { toast } from "react-toastify"
import { uploadFile, deleteFile } from "@/actions/write/actions"

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => (
        <div className="flex-1 rounded-xl bg-gray-100 min-h-60 flex items-center justify-center">
            <p>Editor loading...</p>
        </div>
    ),
})

import 'react-quill-new/dist/quill.snow.css';

interface UploadedFile {
    url: string
    fileName: string
    type: "image" | "video"
}

interface EditorSectionProps {
    content: string
    onContentChange: (content: string) => void
}

const EditorSection: React.FC<EditorSectionProps> = ({ content, onContentChange }) => {
    const [isMounted, setIsMounted] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [progress, setProgress] = useState(0)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const videoInputRef = useRef<HTMLInputElement>(null)

    const FILE_LIMITS = {
        image: 5 * 1024 * 1024, // 5MB
        video: 20 * 1024 * 1024, // 20MB
    }

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleFileUpload = async (file: File, type: "image" | "video") => {
        if (type === "image" && file.size > FILE_LIMITS.image) {
            toast.error(`Image size should be less than 5MB`)
            return null
        }

        if (type === "video" && file.size > FILE_LIMITS.video) {
            toast.error(`Video size should be less than 20MB`)
            return null
        }

        if (type === "image" && !file.type.startsWith("image/")) {
            toast.error("Please select a valid image file")
            return null
        }

        if (type === "video" && !file.type.startsWith("video/")) {
            toast.error("Please select a valid video file")
            return null
        }

        try {
            setProgress(10)
            const fileUrl = await uploadFile(file)
            setProgress(100)

            if (fileUrl) {
                const uploadedFile: UploadedFile = {
                    url: fileUrl,
                    fileName: file.name,
                    type: type,
                }

                setUploadedFiles((prev) => [...prev, uploadedFile])

                if (type === "image") {
                    onContentChange(
                        content +
                        `<div class="uploaded-image-container" data-file-name="${file.name}">
            <img src="${fileUrl}" alt="${file.name}" style="max-width: 500px; max-height: 500px; border-radius: 8px;" />           
          </div>`,
                    )
                } else {
                    onContentChange(
                        content +
                        `<div class="uploaded-video-container" data-file-name="${file.name}">
            <video controls style="max-width: 100%; border-radius: 8px;">
              <source src="${fileUrl}" type="${file.type}">
              Your browser does not support the video tag.
            </video>
          </div>`,
                    )
                }

                toast.success(`${type === "image" ? "Image" : "Video"} uploaded successfully!`)
                return fileUrl
            }
        } catch (error) {
            toast.error(`Failed to upload ${type}`)
            console.error(`Upload error:`, error)
        } finally {
            setTimeout(() => setProgress(0), 1000)
        }
        return null
    }

    const handleDeleteFile = async (fileUrl: string, fileName: string, type: "image" | "video") => {
        try {
            setUploadedFiles((prev) => prev.filter((file) => file.url !== fileUrl))

            const fileElementClass = type === "image" ? "uploaded-image-container" : "uploaded-video-container"
            const regex = new RegExp(`<div class="${fileElementClass}" data-file-name="${fileName}"[\\s\\S]*?<\\/div>`, "g")
            onContentChange(content.replace(regex, ""))

            await deleteFile(fileUrl)

            toast.success(`${type === "image" ? "Image" : "Video"} deleted successfully!`)
        } catch (error) {
            toast.error(`Failed to delete ${type}`)
            console.error(`Delete error:`, error)
        }
    }

    const handleImageUpload = () => {
        imageInputRef.current?.click()
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0], "image")
            e.target.value = ""
        }
    }

    const handleVideoUpload = () => {
        videoInputRef.current?.click()
    }

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0], "video")
            e.target.value = ""
        }
    }

    if (!isMounted) {
        return (
            <div className="flex-1 rounded-xl bg-gray-100 min-h-60 flex items-center justify-center">
                <p>Editor loading...</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            {/* Progress Bar */}
            {progress > 0 && progress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                    <p className="text-sm text-gray-600 mt-1">Upload Progress: {progress}%</p>
                </div>
            )}

            {/* Text Editor with Custom Toolbar */}
            <div className="flex w-full">
                <div className="flex flex-col gap-2 mr-2">
                    {/* Image Upload Button */}
                    <button
                        type="button"
                        className="toolbar-button p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={handleImageUpload}
                        title="Upload Image (Max 5MB)"
                    >
                        📷
                    </button>

                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} ref={imageInputRef} />

                    {/* Video Upload Button */}
                    <button
                        type="button"
                        className="toolbar-button p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={handleVideoUpload}
                        title="Upload Video (Max 20MB)"
                    >
                        ▶️
                    </button>

                    <input type="file" accept="video/*" className="hidden" onChange={handleVideoChange} ref={videoInputRef} />
                </div>

                <div className="flex-1">
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={onContentChange}
                        readOnly={progress > 0 && progress < 100}
                        modules={{
                            toolbar: [
                                [{ header: [1, 2, 3, false] }],
                                ["bold", "italic", "underline", "strike"],
                                [{ list: "ordered" }, { list: "bullet" }],
                                ["link", "blockquote", "code-block"],
                                ["clean"],
                            ],
                        }}
                        placeholder="Start writing your blog content here..."
                        className="min-h-60 rounded-xl bg-white shadow-md"
                    />
                </div>
            </div>

            {/* Uploaded Files Summary */}
            {uploadedFiles.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h3 className="text-sm font-medium mb-2">Uploaded Files:</h3>
                    <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <span>{file.fileName}</span>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteFile(file.url, file.fileName, file.type)}
                                    className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditorSection
