interface UserProfile {
  id: string;
  username: string;
  title?: string;
  email: string;
  img?: string;
  role: string;
  saved_posts: string[];
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface BlogPost {
  id: string; //
  user_id?: string; // todo
  title: string; //
  slug: string; //
  category: string; //
  description: string; //
  content: string; //
  img?: string; //
  is_featured: boolean; //
  visit: number; //
  created_at: string; //
  // profiles?: UserProfile; // Joined data
}

interface Comment {
  id: string;
  user_id?: string;
  post_id: string;
  description: string;
  created_at: string;
  profiles?: UserProfile; // Joined data
}
