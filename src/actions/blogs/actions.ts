"use server";

import { getUserServer } from "@/utils/get-user-server";
import { createClient } from "@/utils/supabase/server";

interface SavedStatus {
    isSaved: boolean;
    error: string | null;
}

export async function checkIsBlogSaved(blogId: string): Promise<SavedStatus> {
    const supabase = await createClient();
    const user = await getUserServer();

    if (!user) {

        return { isSaved: false, error: null };
    }

    const { data, error } = await supabase
        .from('UserSavedBlogs')
        .select('blog_id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('blog_id', blogId)
        .limit(1);

    if (error) {
        console.error("Supabase error checking saved status:", error);
        return { isSaved: false, error: error.message };
    }

    const isSaved = (data?.length ?? 0) > 0;

    return { isSaved, error: null };
}

export async function saveBlog(blogId: string) {
    const supabase = await createClient();

    const user = await getUserServer();

    if (!user) {
        return { success: false, operation: null, message: "User not authenticated." };
    }

    const { data: existingEntry, error: checkError } = await supabase
        .from('UserSavedBlogs')
        .select('id')
        .eq('user_id', user.id)
        .eq('blog_id', blogId)
        .limit(1);

    if (checkError) {
        return { success: false, operation: null, message: `Error checking save status: ${checkError.message}` };
    }

    if (existingEntry && existingEntry.length > 0) {
        const { error: deleteError } = await supabase
            .from('UserSavedBlogs')
            .delete()
            .eq('user_id', user.id)
            .eq('blog_id', blogId);

        if (deleteError) {
            return { success: false, operation: 'Unsave', message: `Error unsaving blog: ${deleteError.message}` };
        }
        return { success: true, operation: 'Unsaved', message: "Blog successfully unsaved." };
    } else {
        const { error: insertError } = await supabase
            .from('UserSavedBlogs')
            .insert({
                user_id: user.id,
                blog_id: blogId,
            });

        if (insertError) {
            return { success: false, operation: 'Save', message: `Error saving blog: ${insertError.message}` };
        }
        return { success: true, operation: 'Saved', message: "Blog successfully saved." };
    }
}

interface UserProfile {
    id: string;
    username: string;
    email: string;
    role: string;
    img: string;
    title: string;
}

interface Blog {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    content: string;
    img: string;
    created_at: string;
    is_featured: boolean;
    visit: number;
    UserProfile: UserProfile;
}

interface SavedBlog {
    saved_at: string;
    blog: Blog;
}

export async function getAllSavedBlogs() {
    const supabase = await createClient();
    const user = await getUserServer();

    if (!user) {
        return { blogs: [], success: false, message: "User not authenticated." };
    }

    const { data, error } = await supabase
        .from('UserSavedBlogs')
        .select(`
            saved_at,
            blog:blog_id (
                id,
                title,
                slug,
                category,
                description,
                content,
                img,
                created_at,
                is_featured,
                visit,
                UserProfile (
                    id,
                    username,
                    email,
                    role,
                    img,
                    title
                )
            )
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

    if (error) {
        console.error("Error fetching saved blogs:", error);
        return { blogs: null, success: false, message: `Error: ${error.message}` };
    }

    const savedBlogs = ((data as unknown) as SavedBlog[]).map(item => ({
        id: item.blog.id,
        title: item.blog.title,
        slug: item.blog.slug,
        category: item.blog.category,
        description: item.blog.description,
        content: item.blog.content,
        img: item.blog.img,
        created_at: item.blog.created_at,
        is_featured: item.blog.is_featured,
        visit: item.blog.visit,
        saved_at: item.saved_at,
        author: item.blog.UserProfile ? {
            id: item.blog.UserProfile.id,
            username: item.blog.UserProfile.username,
            email: item.blog.UserProfile.email,
            role: item.blog.UserProfile.role,
            img: item.blog.UserProfile.img,
            title: item.blog.UserProfile.title
        } : null
    }));

    return { blogs: savedBlogs || [], success: true, message: "Successfully fetched saved blogs." };
}