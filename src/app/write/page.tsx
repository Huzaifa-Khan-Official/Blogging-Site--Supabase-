"use client"

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { saveBlog, uploadFile } from "@/actions/write/actions";
import CoverImageUpload from "@/components/CoverImageUpload";
import TitleInput from "@/components/TitleInput";
import CategorySelect from "@/components/CategorySelect";
import DescriptionTextarea from "@/components/DescriptionTextarea";
import EditorSection from "@/components/EditorSection";
import SubmitButton from "@/components/SubmitButton";

const Write = () => {
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    let imageUrl: string | null = null;
    if (coverImage) {
      imageUrl = await uploadFile(coverImage);
    }

    const formData = {
      title: data.title,
      category: data.category,
      desc: data.desc,
      content: content,
      img: imageUrl
    };

    const res = await saveBlog(formData);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Blog saved successfully");
      reset();
      setContent("");
      setCoverImage(null);
    }
    setIsLoading(false);
  };

  return (
    <div className="mt-6 min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Create a New Post</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 flex-1 mb-20"
      >
        <CoverImageUpload
          coverImage={coverImage}
          onCoverImageChange={setCoverImage}
        />

        <TitleInput
          register={register}
          errors={errors}
        />

        <CategorySelect
          register={register}
          errors={errors}
        />

        <DescriptionTextarea
          register={register}
          errors={errors}
        />

        <EditorSection
          content={content}
          onContentChange={setContent}
        />

        <SubmitButton
          loading={loading}
        />
      </form>
    </div>
  );
};

export default Write;