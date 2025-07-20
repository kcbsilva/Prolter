// src/types/users.ts

// Describes an individual permission
export interface Permission {
  id: string; // UUID
  slug: string; // e.g., 'subscribers.view'
  description?: string | null;
  group_name?: string | null; // For UI grouping
  created_at: string; // ISO date string
}

// Describes a user role
export interface Role {
  id: string; // UUID
  name: string;
  description?: string | null;
  created_at: string; // ISO date string
  permissions?: Permission[]; // Permissions associated with this role (fetched separately or via join)
}

// Describes a user template
export interface UserTemplate {
  id: string; // UUID
  template_name: string;
  description?: string | null;
  default_role_id?: string | null; // UUID, Foreign Key to roles.id
  created_at: string; // ISO date string
  permissions?: string[]; // Array of permission slugs or IDs associated with this template
}

// Data needed to create or update a user template
export interface UserTemplateData {
  template_name: string;
  description?: string | null;
  default_role_id?: string | null;
  permission_ids: string[]; // Array of permission UUIDs
}

// User profile data extending Supabase auth.users
export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string; // Added missing email property
  name: string; // Added missing name property (can be computed from full_name)
  avatar_url?: string | null;
  role?: Role;
  role_id?: string | null;
  status: 'active' | 'inactive' | 'pending'; // Added missing status property
  created_at: string;
  updated_at: string;
  createdAt: string; // Alias for created_at for compatibility
}

// Additional interfaces for the enhanced functionality
export interface UpdateUserData {
  id: string;
  username?: string;
  full_name?: string;
  email?: string;
  role?: 'admin' | 'user' | 'manager';
  status?: 'active' | 'inactive' | 'pending';
}

export interface CreateUserData {
  username: string;
  email: string;
  full_name: string;
  password: string;
  role: 'admin' | 'user' | 'manager';
  status?: 'active' | 'inactive' | 'pending';
}