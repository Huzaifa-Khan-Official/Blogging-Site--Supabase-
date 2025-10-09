"use server";

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

  // redirect('/')
  return { success: true };
}

// export async function login(formData: FormData) {
//   const supabase = await createClient();

//   const { data, error } = await supabase.auth.signInWithPassword({
//     email: formData.email,
//     password: formData.password,
//   });

//   if (error) return { error: error.message };

//   // do not redirect here; just return success
//   return { success: true };
// }

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

  // const { error: insertUserError } = await supabase.from("Users").insert({
  //   username: formData.username,
  //   email: formData.email,
  //   password: formData.password
  // })

  // if (insertUserError) {
  //   console.log("Error: " + insertUserError.message);
  //   return { error: insertUserError.message };
  // }

  revalidatePath("/", "layout");
  return { success: true };
}
