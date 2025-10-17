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

export async function getBlogs(search?: string | null, category?: string | null, sort?: string | null) {
  const supabase = await createClient();

  let query = supabase
    .from("Blogs")
    .select(`
      *,
      UserProfile (*)
    `);

  if (search) {
    query = query.or(`
      title.ilike.%${search}%,
      description.ilike.%${search}%,
      content.ilike.%${search}%,
      category.ilike.%${search}%,
      UserProfile.username.ilike.%${search}%
    `);
  }

  if (category && category !== 'all') {
    const formattedCategory = category.replace(/-/g, " ");
    query = query.eq('category', formattedCategory);
  }

  if (sort) {
    const formattedSort = sort.toLowerCase().replace(/-/g, "_");

    switch (formattedSort) {
      case 'most_viewed':
      case 'most_visited':
      case 'popular':
      case 'trending':
        query = query.order('visit', { ascending: false }).order('title', { ascending: true });
        break;

      case 'newest':
      case 'most_recent':
        query = query.order('created_at', { ascending: false });
        break;

      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;

      case 'featured':
        query = query.eq('is_featured', true).order('created_at', { ascending: false });
        break;

      case 'a_z':
        query = query.order('title', { ascending: true });
        break;

      case 'z_a':
        query = query.order('title', { ascending: false });
        break;

      default:
        query = query.order('created_at', { ascending: false });
    }
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    return { error: error.message };
  }

  if (sort && (sort.includes('popular') || sort.includes('trending'))) {
    data?.forEach(blog => {
      console.log(`- ${blog.title}: ${blog.visit} visits`);
    });
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
  console.log("id ==>", id);
  const { error } = await supabase.from("Blogs").delete().eq("id", id);
  if (error) {
    console.log("Error in deleteBlog:", error.message);
    return { error: error.message };
  }
  return { success: true };
}

export async function incrementBlogVisits(slug: string) {
  if (!slug) {
    return { success: false, message: 'Slug is required' }
  }

  const supabase = await createClient();

  const { data: blog, error: fetchError } = await supabase
    .from('Blogs')
    .select('visit')
    .eq('slug', slug)
    .single()

  if (fetchError) {
    console.error('Error fetching blog:', fetchError)
    return { success: false, message: fetchError.message }
  }

  if (!blog) {
    return { success: false, message: 'Blog not found' }
  }

  const { error: updateError } = await supabase
    .from('Blogs')
    .update({
      visit: blog.visit + 1,
    })
    .eq('slug', slug)

  if (updateError) {
    console.error('Error updating blog visits:', updateError)
    return { success: false, message: updateError.message }
  }

  return { success: true }
}