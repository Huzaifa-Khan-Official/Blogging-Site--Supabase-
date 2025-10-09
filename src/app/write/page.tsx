"use client"
import "react-quill-new/dist/quill.snow.css";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { saveBlog, uploadFile, deleteFile } from "@/actions/write/actions";

// ReactQuill ko dynamically import karein with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="flex-1 rounded-xl bg-gray-100 min-h-60 flex items-center justify-center">
    <p>Editor loading...</p>
  </div>
});

interface UploadedFile {
  url: string;
  fileName: string;
  type: 'image' | 'video';
}

const Write = () => {
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const coverImgRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // File size limits (5MB for images, 20MB for videos)
  const FILE_LIMITS = {
    image: 5 * 1024 * 1024, // 5MB
    video: 20 * 1024 * 1024 // 20MB
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // File upload handler
  const handleFileUpload = async (file: File, type: 'image' | 'video') => {
    // File size check
    if (type === 'image' && file.size > FILE_LIMITS.image) {
      toast.error(`Image size should be less than 5MB`);
      return null;
    }

    if (type === 'video' && file.size > FILE_LIMITS.video) {
      toast.error(`Video size should be less than 20MB`);
      return null;
    }

    // File type validation
    if (type === 'image' && !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return null;
    }

    if (type === 'video' && !file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return null;
    }

    try {
      setProgress(10);
      const fileUrl = await uploadFile(file);
      setProgress(100);

      if (fileUrl) {
        const uploadedFile: UploadedFile = {
          url: fileUrl,
          fileName: file.name,
          type: type
        };

        setUploadedFiles(prev => [...prev, uploadedFile]);

        // Add to editor content
        if (type === 'image') {
          setValue(prev => prev + `<div class="uploaded-image-container" data-file-name="${file.name}">
            <img src="${fileUrl}" alt="${file.name}" style="max-width: 500px; max-height: 500px; border-radius: 8px;" />           
          </div>`);
        } else {
          setValue(prev => prev + `<div class="uploaded-video-container" data-file-name="${file.name}">
            <video controls style="max-width: 100%; border-radius: 8px;">
              <source src="${fileUrl}" type="${file.type}">
              Your browser does not support the video tag.
            </video>
            <span class="delete-btn" onclick="handleDeleteFile('${fileUrl}', '${file.name}', 'video')">❌</span>
          </div>`);
        }

        toast.success(`${type === 'image' ? 'Image' : 'Video'} uploaded successfully!`);
        return fileUrl;
      }
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
      console.error(`Upload error:`, error);
    } finally {
      setTimeout(() => setProgress(0), 1000);
    }
    return null;
  };

  // File delete handler
  const handleDeleteFile = async (fileUrl: string, fileName: string, type: 'image' | 'video') => {
    try {
      // Remove from uploaded files list
      setUploadedFiles(prev => prev.filter(file => file.url !== fileUrl));

      // Remove from editor content
      const fileElementClass = type === 'image' ? 'uploaded-image-container' : 'uploaded-video-container';
      const regex = new RegExp(`<div class="${fileElementClass}" data-file-name="${fileName}"[\\s\\S]*?<\\/div>`, 'g');
      setValue(prev => prev.replace(regex, ''));

      // Delete from storage
      await deleteFile(fileUrl);

      toast.success(`${type === 'image' ? 'Image' : 'Video'} deleted successfully!`);
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
      console.error(`Delete error:`, error);
    }
  };

  // Image upload handler
  const handleImageUpload = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0], 'image');
      e.target.value = ''; // Reset input
    }
  };

  // Video upload handler
  const handleVideoUpload = () => {
    videoInputRef.current?.click();
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0], 'video');
      e.target.value = ''; // Reset input
    }
  };

  // Cover image handler
  const handleFileChange = (file: File) => {
    if (file) {
      if (file.size > FILE_LIMITS.image) {
        toast.error('Cover image size should be less than 5MB');
        return;
      }
      setCover(URL.createObjectURL(file));
      setCoverImage(file);
    }
  };

  const onSubmit = async (data: any) => {
    let imageUrl: string | null = null;

    if (coverImage) {
      imageUrl = await uploadFile(coverImage);
    }

    const formData = {
      title: data.title,
      category: data.category,
      desc: data.desc,
      content: value,
      img: imageUrl
    };

    const res = await saveBlog(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Blog saved successfully");
      reset();
      setValue("");
      setCover("");
      setUploadedFiles([]);
    }
  }

  // Global function for delete buttons (since ReactQuill uses innerHTML)
  useEffect(() => {
    // @ts-ignore
    window.handleDeleteFile = handleDeleteFile;

    return () => {
      // @ts-ignore
      delete window.handleDeleteFile;
    };
  }, []);

  return (
    <div className="mt-6 min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Create a New Post</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 flex-1 mb-20"
      >
        {/* Cover Image */}
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
            if (e.target.files) {
              handleFileChange(e.target.files[0]);
            }
          }}
          ref={coverImgRef}
        />

        {cover && (
          <img
            src={cover}
            alt="Cover"
            className="w-48 h-48 object-cover rounded-2xl"
          />
        )}

        {/* Title */}
        <input
          type="text"
          placeholder="My Awesome Story"
          className="text-4xl font-semibold bg-transparent outline-none"
          {...register("title", {
            required: {
              value: true,
              message: "Title is required",
            },
          })}
        />
        {errors.title && errors.title?.message && (
          <p className="text-red-500">{String(errors.title.message)}</p>
        )}

        {/* Category */}
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm">
            Choose a category:
          </label>
          <select
            {...register("category", {
              required: {
                value: true,
                message: "Category is required",
              }
            })}
            className="p-2 rounded-xl bg-white shadow-md"
          >
            <option value="general">General</option>
            <option value="web-design">Web Design</option>
            <option value="development">Development</option>
            <option value="databases">Databases</option>
            <option value="seo">Search Engines</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
        {errors.category && errors.category?.message && (
          <p className="text-red-500">{String(errors.category.message)}</p>
        )}

        {/* Description */}
        <textarea
          {...register("desc", {
            required: {
              value: true,
              message: "Description is required",
            }
          })}
          placeholder="A short Description"
          className="p-4 rounded-xl bg-white shadow-md"
        />
        {errors.desc && errors.desc?.message && (
          <p className="text-red-500">{String(errors.desc.message)}</p>
        )}

        {/* Progress Bar */}
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
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
              className="toolbar-button"
              onClick={handleImageUpload}
              title="Upload Image (Max 5MB)"
            >
              📷
            </button>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              ref={imageInputRef}
            />

            {/* Video Upload Button */}
            <button
              type="button"
              className="toolbar-button"
              onClick={handleVideoUpload}
              title="Upload Video (Max 20MB)"
            >
              ▶️
            </button>

            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoChange}
              ref={videoInputRef}
            />
          </div>

          {isMounted && (
            <ReactQuill
              theme="snow"
              className="flex-1 rounded-xl bg-white shadow-md min-h-60 w-full"
              value={value}
              onChange={setValue}
              readOnly={progress > 0 && progress < 100}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['link', 'blockquote', 'code-block'],
                  ['clean']
                ],
              }}
            />
          )}
        </div>

        {/* Uploaded Files Summary */}
        {uploadedFiles.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
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

        <button
          type="submit"
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer"
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default Write;