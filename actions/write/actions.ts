"use server";

import { redirect } from "next/navigation";
import { getUserServer } from "../../utils/get-user-server";
import { createClient } from "../../utils/supabase/server";
import { slugify } from "../../utils/slugify";

interface FormData {
  title: string;
  category: string;
  desc: string;
  content: string;
  img: string | null;
}

// export async function saveBlog(formData: FormData) {
//   const supabase = await createClient();
//   // const user = await getUserServer();

//   // console.log("user in saveBlog =>", user);

//   const baseSlug = formData.title.replace(/ /g, "-").toLowerCase();
//   let slug = baseSlug;

//   let { data: existingBlog, error: existingBlogError } = await supabase
//     .from("Blogs")
//     .select("*")
//     .eq("slug", slug)
//     .maybeSingle();

//   let counter = 2;

//   while (existingBlog) {
//     slug = `${baseSlug}-${counter}`;
//     const { data: nextBlog } = await supabase
//       .from("Blogs")
//       .select("*")
//       .eq("slug", slug)
//       .maybeSingle();
//     existingBlog = nextBlog;
//     counter++;
//   }

//   const data = {
//     title: formData.title,
//     category: formData.category,
//     description: formData.desc,
//     content: formData.content,
//     slug,
//     img: formData.img,
//   };

//   const { data: res, error } = await supabase.from("Blogs").insert([data]);

//   if (error) {
//     console.log("Error:", error.message);
//     return { error: error.message };
//   }

//   // return { success: true };
//   redirect(`/blog/${slug}`);
// }

export async function saveBlog(formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Validate required fields
    if (!formData.title?.trim()) {
      return { error: "Title is required" };
    }

    // Generate slug
    const baseSlug = slugify(formData.title);
    
    // Fallback if slug is empty after cleaning
    let slug = baseSlug || 'blog-post';

    // Check for existing slug
    let { data: existingBlog, error: checkError } = await supabase
      .from("Blogs")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing slug:", checkError);
      return { error: "Failed to check existing posts" };
    }

    // Handle duplicate slugs
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
      
      // Safety check to prevent infinite loop
      if (counter > 100) {
        return { error: "Too many duplicate slugs" };
      }
    }

    // Prepare data
    const data = {
      title: formData.title.trim(),
      category: formData.category,
      description: formData.desc?.trim(),
      content: formData.content,
      slug,
      img: formData.img,
      created_at: new Date().toISOString(),
    };

    // Insert into database
    const { data: res, error: insertError } = await supabase
      .from("Blogs")
      .insert([data])
      .select();

    if (insertError) {
      console.error("Database error:", insertError);
      return { error: insertError.message };
    }

    // Success - redirect to blog post
    redirect(`/blog/${slug}`);
    
  } catch (error) {
    console.error("Unexpected error in saveBlog:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getBlogs() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("Blogs").select("*");

  if (error) {
    console.log("Error:", error.message);
    return { error: error.message };
  }

  return { data };
}

export async function getBlog(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("Blogs").select("*").eq("slug", slug);

  if (error) {
    console.log("Error:", error.message);
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