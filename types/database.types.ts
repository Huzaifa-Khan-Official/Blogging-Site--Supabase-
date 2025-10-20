/* eslint-disable @typescript-eslint/no-unused-vars */

interface UserProfile {
  id: string;
  username: string;
  title?: string;
  email: string;
  img?: string;
  role: string;
  saved_posts?: string[];
  created_at?: string;
}

interface BlogPost {
  id: string; 
  user_id: string; 
  title: string; 
  slug: string; 
  category: string; 
  description: string; 
  content: string; 
  img: string;
  created_at: string;
  is_featured: boolean;
  author: {
    id: string;
    username: string;
    email: string;
    role: string;
    img: string;
    title: string;
  }
}

interface Comment {
  id: string;
  user_id?: string;
  blog_id: string;
  description: string;
  created_at: string;
  author?: UserProfile;
}
