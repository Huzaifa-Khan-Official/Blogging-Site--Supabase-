"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { slugify } from "@/utils/slugify";
import { getUserServer } from "@/utils/get-user-server";

interface FormData {
  title: string;
  category: string;
  desc: string;
  content: string;
  img: string | null;
}

export async function saveBlog(formData: FormData) {
  const supabase = await createClient();
  const user = await getUserServer();

  if (!formData.title?.trim()) {
    return { error: "Title is required" };
  }

  const baseSlug = slugify(formData.title);

  let slug = baseSlug || 'blog-post';

  let { data: existingBlog, error: checkError } = await supabase
    .from("Blogs")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();

  if (checkError) {
    console.error("Error checking existing slug:", checkError);
    return { error: "Failed to check existing posts" };
  }

  let counter = 2;
  while (existingBlog) {
    slug = `${baseSlug}-${counter}`;
    const { data: nextBlog } = await supabase
      .from("Blogs")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();
    existingBlog = nextBlog;
    counter++;


    if (counter > 100) {
      return { error: "Too many duplicate slugs" };
    }
  }

  const data = {
    title: formData.title.trim(),
    category: formData.category,
    description: formData.desc?.trim(),
    content: formData.content,
    slug,
    img: formData.img,
    user_id: user?.id,
    created_at: new Date().toISOString(),
  };

  const { data: res, error: insertError } = await supabase
    .from("Blogs")
    .insert([data])
    .select();

  if (insertError) {
    console.error("Database error:", insertError);
    return { error: insertError.message };
  }

  redirect(`/blog/${data.slug}`);
}

export async function getBlogs() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Blogs")
    .select(`
      *,
      UserProfile (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }

  const formattedData = data?.map(blog => ({
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    category: blog.category,
    description: blog.description,
    content: blog.content,
    img: blog.img,
    created_at: blog.created_at,
    is_featured: blog.is_featured,
    visit: blog.visit,
    author: blog.UserProfile ? {
      id: blog.UserProfile.id,
      username: blog.UserProfile.username,
      email: blog.UserProfile.email,
      role: blog.UserProfile.role,
      img: blog.UserProfile.img,
      title: blog.UserProfile.title
    } : null
  }));

  return { data: formattedData || [] };
}

export async function getBlog(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Blogs")
    .select(`
      *,
      UserProfile (*)
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    return { error: error.message };
  }

  return {
    data: {
      id: data.id,
      title: data.title,
      slug: data.slug,
      category: data.category,
      description: data.description,
      content: data.content,
      img: data.img,
      created_at: data.created_at,
      is_featured: data.is_featured,
      visit: data.visit,
      author: data.UserProfile ? {
        id: data.UserProfile.id,
        username: data.UserProfile.username,
        email: data.UserProfile.email,
        role: data.UserProfile.role,
        img: data.UserProfile.img,
        title: data.UserProfile.title
      } : null
    }
  };
}

export async function getCurrentUserBlogs() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.log("User Error:", userError?.message);
    return { error: "User not authenticated" };
  }

  const { data, error } = await supabase
    .from("Blogs")
    .select(`
      *,
      UserProfile (*)
    `)
    .eq("user_id", user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.log("Error:", error.message);
    return { error: error.message };
  }

  const formattedData = data?.map(blog => ({
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    category: blog.category,
    description: blog.description,
    content: blog.content,
    img: blog.img,
    created_at: blog.created_at,
    is_featured: blog.is_featured,
    visit: blog.visit,
    author: blog.UserProfile ? {
      id: blog.UserProfile.id,
      username: blog.UserProfile.username,
      email: blog.UserProfile.email,
      role: blog.UserProfile.role,
      img: blog.UserProfile.img,
      title: blog.UserProfile.title
    } : null
  }));

  return { data: formattedData || [] };
}

export async function featureBlog(id: string, isFeatured: boolean) {
  const supabase = await createClient();

  const { error } = await supabase.from("Blogs").update({ is_featured: isFeatured }).eq("id", id);

  if (error) {
    console.log("Error in featureBlog:", error.message);
    return { error: error.message };
  }

  return { success: true };
}

export async function getFeaturedPosts() {

  const supabase = await createClient();

  const { data, error } = await supabase.from("Blogs").select("*").eq("is_featured", true).order("created_at", { ascending: false });

  if (error) {
    console.log("Error in getFeaturedPosts:", error.message);
    return { error: error.message };
  }

  return { data };
}

export async function uploadFile(file: File): Promise<string | null> {
  const supabase = await createClient();
  const filePath = `${file.name}-${Date.now()}`;
  const { error } = await supabase.storage.from("blogging-site").upload(filePath, file);

  if (error) {
    console.log("Error in uploadFile:", error.message);
    return null;
  }

  const { data } = await supabase.storage.from("blogging-site").getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteFile(url: string) {
  const supabase = await createClient();
  const { error } = await supabase.storage.from("blogging-site").remove([url]);
  if (error) {
    console.log("Error in deleteFile:", error.message);
    return { error: error.message };
  }
  return { success: true };
}

export async function deleteBlog(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("Blogs").delete().eq("id", id);
  if (error) {
    console.log("Error in deleteBlog:", error.message);
    return { error: error.message };
  }
  return { success: true };
}