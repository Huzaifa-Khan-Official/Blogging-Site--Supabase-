"use server";

import { getUserServer } from "@/utils/get-user-server";
import { createClient } from "@/utils/supabase/server";

export async function addComment(blogId: string, description: string) {
    const supabase = await createClient();
    const user = await getUserServer();
    const { error } = await supabase.from("Comments").insert({ blog_id: blogId, description, user_id: user?.id });

    if (error) {
        console.log("Error in addComment:", error.message);
        return { error: error.message };
    }

    return { success: true };
}

export async function getComments(blogId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from("Comments").select(`
    *,
    author:user_id (
      id,
      username,
      email, 
      img,
      title,
      role
    )
  `).eq("blog_id", blogId);

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

export async function updateComment(commentId: string, content: string, userId: string) {

    const supabase = await createClient();
    const user = await getUserServer();

    // Verify the user owns this comment
    const { data: comment, error: fetchError } = await supabase
        .from("Comments")
        .select()
        .eq("id", commentId)
        .eq("user_id", user?.id)
        .single();

    if (fetchError || !comment || comment.user_id !== userId) {
        return { data: null, error: "Unauthorized to update this comment" }
    }

    const { data, error } = await supabase
        .from("Comments")
        .update({
            description: content,
        })
        .eq("id", commentId)
        .eq("user_id", user?.id)
        .select()

    if (error) {
        return { data: null, error: error.message }
    }
    return { data, error: null }
}