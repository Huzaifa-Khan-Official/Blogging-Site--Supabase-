"use server";

import { getUserServer } from "@/utils/get-user-server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface FormData {
  email: string;
  password: string;
  username?: string;
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const credentials = {
    email: formData.email,
    password: formData.password,
  };

  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    console.log("Error: " + error.message);
    return { error: error.message };
  }

  revalidatePath('/', "layout")

  return { success: true };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const credentials = {
    username: formData.username,
    email: formData.email,
    password: formData.password,
  };

  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        username: credentials.username,
      },
    }
  });

  if (error) {
    console.log("Error: " + error.message);
    return { error: error.message };
  } else if (data?.user?.identities?.length === 0) {
    return { error: "Username already exists with this email, please try again" };
  }

  const { error: insertUserError } = await supabase.from("UserProfile").insert({
    id: data.user && data.user.id,
    username: credentials.username,
    email: credentials.email,
    role: "user",
  })

  if (insertUserError) {
    console.log("Error: " + insertUserError.message);
    return { error: insertUserError.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function getProfile() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.log("Error: " + error?.message);
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("UserProfile")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    console.log("Error: " + profileError.message);
    return null;
  }

  return {
    id: profile.id,
    username: profile.username,
    email: profile.email,
    role: profile.role,
    img: profile.img,
    title: profile.title,
    created_at: profile.created_at
  };
}

export async function updateProfile({ imgUrl, username, title }: { imgUrl?: string, username?: string, title?: string }) {
  const supabase = await createClient();
  const user = await getUserServer();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const { error: updateUserError } = await supabase.auth.updateUser({
    data: {
      full_name: username,
      avatar_url: imgUrl,
    },
  })

  if (updateUserError) {
    console.log("Error: " + updateUserError.message);
    return { error: updateUserError.message };
  }

  const { data, error } = await supabase
    .from("UserProfile")
    .update({ img: imgUrl, username, title })
    .eq("id", user.id)
    .single();

  if (error) {
    console.log("Error: " + error.message);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}