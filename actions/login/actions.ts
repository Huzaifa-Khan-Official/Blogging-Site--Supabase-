"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import { cookies } from "next/headers";

interface FormData {
  email: string;
  password: string;
  username?: string;
}

// export async function login(formData: FormData) {
//   const supabase = await createClient();

//   const data = {
//     email: formData.email,
//     password: formData.password,
//   };

//   const { data: res, error } = await supabase.auth.signInWithPassword(data);

//   if (error) {
//     // redirect("/error");
//     console.log("Error: " + error.message);
//     // toast.error("Error: " + error.message);
//     return { error: error.message };
//   }

//   //   revalidatePath("/", "layout");
//   //   redirect("/");

//   console.log("res ==>", res.user);

//   revalidatePath("/", "layout");
//   return { success: true, user: res.user };
// }


export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { data: res, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log("Error: " + error.message);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

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

  const { error: insertUserError } = await supabase.from("Users").insert({
    username: formData.username,
    email: formData.email,
    password: formData.password
  })

  if (insertUserError) {
    console.log("Error: " + insertUserError.message);
    return { error: insertUserError.message };
  }

  return { success: true };
}
