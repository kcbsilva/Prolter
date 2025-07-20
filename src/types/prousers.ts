// /types/prousers.ts

export type UserStatus = 'active' | 'inactive'

export interface ProUser {
    id: string;
    system_id: string; // ✅ Added
    full_name: string;
    username: string;
    password?: string; // optional, never returned by API
    role_id: string;
    status: UserStatus;
    is_archived?: boolean;
    created_at: string;
  }