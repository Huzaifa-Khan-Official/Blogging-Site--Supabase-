"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useForm, type UseFormRegister } from "react-hook-form"
import { toast } from "react-toastify"
import { getBlog, saveBlog, uploadFile } from "@/actions/write/actions"
import CoverImageUpload from "@/components/CoverImageUpload"
import TitleInput from "@/components/TitleInput"
import CategorySelect from "@/components/CategorySelect"
import DescriptionTextarea from "@/components/DescriptionTextarea"
import EditorSection from "@/components/EditorSection"
import SubmitButton from "@/components/SubmitButton"
import { useParams } from "next/navigation"

interface BlogFormProps {
    mode?: "create" | "edit"
    slug?: string
    onSuccess?: () => void
}

interface BlogPost {
    id: string
    title: string
    category: string
    desc: string
    content: string
    img?: string
}

interface FormData {
    title: string
    category: string
    desc: string
}

const BlogForm: React.FC<BlogFormProps> = ({ mode = "create", slug, onSuccess }) => {
    const params = useParams<{ slug?: string }>()
    const effectiveSlug = slug || params?.slug

    const [data, setData] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(mode === "edit")
    const [content, setContent] = useState("")
    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<FormData>()

    useEffect(() => {
        if (mode === "edit" && effectiveSlug) {
            setLoading(true)
            const fetchPost = async () => {
                const { data, error } = await getBlog(effectiveSlug)

                if (error) {
                    toast.error(error)
                } else {
                    const blogData = Array.isArray(data) ? (data[0] ?? null) : (data ?? null)
                    setData(blogData)

                    if (blogData) {
                        // Pre-fill form fields
                        setValue("title", blogData.title)
                        setValue("category", blogData.category)
                        setValue("desc", blogData.description)
                        setContent(blogData.content)
                    }
                }
                setLoading(false)
            }

            fetchPost()
        }
    }, [mode, effectiveSlug, setValue])

    const onSubmit = async (formData: FormData) => {
        setIsLoading(true)

        let imageUrl: string | null = null
        if (coverImage) {
            imageUrl = await uploadFile(coverImage)
        }

        const submitData = {
            title: formData.title,
            category: formData.category,
            desc: formData.desc,
            content: content,
            img: imageUrl ?? data?.img ?? null,
        }

        const res = await saveBlog(submitData)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success(mode === "edit" ? "Blog updated successfully" : "Blog published successfully")

            if (mode === "create") {
                reset()
                setContent("")
                setCoverImage(null)
            }

            onSuccess?.()
        }
        setIsLoading(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className="mt-6 min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex flex-col gap-6">
            <h1 className="text-xl font-light">{mode === "edit" ? "Edit Post" : "Create a New Post"}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 flex-1 mb-20">
                <CoverImageUpload coverImage={coverImage} onCoverImageChange={setCoverImage} existingImage={data?.img} />

                <TitleInput register={register as unknown as UseFormRegister<{ title: string }>} errors={errors} />

                <CategorySelect register={register as unknown as UseFormRegister<{ category: string }>} errors={errors} />

                <DescriptionTextarea register={register as unknown as UseFormRegister<{ desc: string }>} errors={errors} />

                <EditorSection content={content} onContentChange={setContent} />

                <SubmitButton loading={isLoading} mode={mode} />
            </form>
        </div>
    )
}

export default BlogForm
