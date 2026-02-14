// Post related types
export interface Post {
  id: number;
  title: string;
  description: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  upvoteCount: number;
  isUpvotedByCurrentUser?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  description: string;
}

export interface UpdatePostRequest {
  title?: string;
  description?: string;
}

export interface PostsResponse {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Upvote {
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
}

export interface PostFilters {
  sortBy?: "created_at" | "upvote_count";
  sortDirection?: "asc" | "desc";
  authorId?: number;
  page?: number;
  size?: number;
  search?: string;
}

export interface UserDashboardStats {
  totalPosts: number;
  totalUpvotesReceived: number;
  totalUpvotesGiven: number;
  recentPosts: Post[];
  recentUpvotes: Post[];
}
