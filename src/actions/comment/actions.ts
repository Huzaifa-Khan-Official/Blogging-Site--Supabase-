"use server";

import { createClient } from "@/utils/supabase/server";

export async function addComment(blogId: string, description: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("Comments").insert({ blog_id: blogId, description });

    if (error) {
        console.log("Error in addComment:", error.message);
        return { error: error.message };
    }

    return { success: true };
}

export async function getComments(blogId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("Comments").select("*").eq("blog_id", blogId);

    if (error) {
        console.log("Error in getComments:", error.message);
        return { error: error.message };
    }

    return { data };
}

export async function deleteComment(commentId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("Comments").delete().eq("id", commentId);

    if (error) {
        console.log("Error in deleteComment:", error.message);
        return { error: error.message };
    }

    return { success: true };
}