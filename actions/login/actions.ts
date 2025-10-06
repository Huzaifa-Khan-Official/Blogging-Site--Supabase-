"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import { toast } from "react-toastify";

interface FormData {
  email: string;
  password: string;
  username?: string;
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { data: res, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    // redirect("/error");
    console.log("Error: " + error.message);
    // toast.error("Error: " + error.message);
    return { error: error.message };
  }

  //   revalidatePath("/", "layout");
  //   redirect("/");

  console.log("res ==>", res.user);
  
  revalidatePath("/", "layout");
  return { success: true, user: res.user };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    username: formData.username,
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log("Error: " + error.message);
    return { error: error.message };
  }

  return { success: true };
}
