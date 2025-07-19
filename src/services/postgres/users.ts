// src/services/postgres/users.ts
'use server';

import { randomUUID } from 'crypto';
import { query } from './db';
import type { Role, Permission, UserTemplate, UserTemplateData, UserProfile } from '@/types/users';

// --- Roles ---
export async function getRoles(): Promise<Role[]> {
  const { rows } = await query('SELECT * FROM roles ORDER BY name');
  return rows.map(row => ({
    ...row,
    id: row.id.toString(),
    created_at: new Date(row.created_at).toISOString(),
  }));
}

export async function addRole(roleData: Pick<Role, 'name' | 'description'>): Promise<Role> {
  const sql = 'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING *;';
  const { rows } = await query(sql, [roleData.name, roleData.description]);
  return {
    ...rows[0],
    id: rows[0].id.toString(),
    created_at: new Date(rows[0].created_at).toISOString(),
  };
}

// --- Permissions ---
export async function getPermissions(): Promise<Permission[]> {
  const staticPermissions: Permission[] = [
    {
      id: 'perm_sub_view',
      slug: 'subscribers.view',
      group_name: 'Subscribers',
      created_at: new Date().toISOString(),
      description: 'Can view subscriber information',
    },
    {
      id: 'perm_sub_add',
      slug: 'subscribers.add',
      group_name: 'Subscribers',
      created_at: new Date().toISOString(),
      description: 'Can add new subscribers',
    },
  ];
  return staticPermissions;
}

// --- User Templates ---
export async function getUserTemplates(): Promise<UserTemplate[]> {
  const { rows: templates } = await query(`
    SELECT ut.id, ut.template_name, ut.description, ut.default_role, ut.created_at,
           array_agg(tp.permission_id) FILTER (WHERE tp.permission_id IS NOT NULL) as permission_ids
    FROM user_templates ut
    LEFT JOIN template_permissions tp ON ut.id = tp.template_id
    GROUP BY ut.id, ut.template_name, ut.description, ut.default_role, ut.created_at
    ORDER BY ut.template_name;
  `);
  return templates.map(t => ({
    id: t.id.toString(),
    template_name: t.template_name,
    description: t.description,
    default_role_id: t.default_role ? t.default_role.toString() : null,
    created_at: new Date(t.created_at).toISOString(),
    permissions: t.permission_ids || [],
  }));
}

export async function addUserTemplate(templateData: UserTemplateData): Promise<UserTemplate> {
  const { permission_ids, ...rest } = templateData;

  const insertTemplateSql =
    'INSERT INTO user_templates (template_name, description, default_role) VALUES ($1, $2, $3) RETURNING *;';
  const { rows } = await query(insertTemplateSql, [
    rest.template_name,
    rest.description,
    rest.default_role_id,
  ]);
  const newTemplate = rows[0];

  if (!newTemplate) throw new Error('Failed to create template');

  if (permission_ids && permission_ids.length > 0) {
    const placeholders = permission_ids.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(',');
    const values = permission_ids.flatMap(pid => [newTemplate.id, pid]);
    await query(`INSERT INTO template_permissions (template_id, permission_id) VALUES ${placeholders}`, values);
  }

  return {
    id: newTemplate.id.toString(),
    template_name: newTemplate.template_name,
    description: newTemplate.description,
    default_role_id: newTemplate.default_role ? newTemplate.default_role.toString() : null,
    created_at: new Date(newTemplate.created_at).toISOString(),
    permissions: permission_ids || [],
  };
}

export async function updateUserTemplate(templateId: string, templateData: UserTemplateData): Promise<UserTemplate> {
  const { permission_ids, ...rest } = templateData;

  const updateSql =
    'UPDATE user_templates SET template_name = $1, description = $2, default_role = $3, updated_at = NOW() WHERE id = $4 RETURNING *;';
  const { rows } = await query(updateSql, [
    rest.template_name,
    rest.description,
    rest.default_role_id,
    templateId,
  ]);
  const updated = rows[0];
  if (!updated) throw new Error('Template not found or not updated.');

  await query('DELETE FROM template_permissions WHERE template_id = $1;', [templateId]);

  if (permission_ids && permission_ids.length > 0) {
    const placeholders = permission_ids.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(',');
    const values = permission_ids.flatMap(pid => [updated.id, pid]);
    await query(`INSERT INTO template_permissions (template_id, permission_id) VALUES ${placeholders}`, values);
  }

  return {
    id: updated.id.toString(),
    template_name: updated.template_name,
    description: updated.description,
    default_role_id: updated.default_role ? updated.default_role.toString() : null,
    created_at: new Date(updated.created_at).toISOString(),
    permissions: permission_ids || [],
  };
}

export async function deleteUserTemplate(templateId: string): Promise<void> {
  await query('DELETE FROM user_templates WHERE id = $1;', [templateId]);
}

// --- User Profiles ---
export async function getUserProfiles(): Promise<UserProfile[]> {
  const result = await query(`
    SELECT 
      up.id AS user_id,
      up.full_name,
      up.username,
      up.avatar_url,
      up.role,
      up.created_at AS user_created_at,
      up.updated_at AS user_updated_at,
      r.id AS role_id,
      r.name AS role_name,
      r.description AS role_description,
      r.created_at AS role_created_at
    FROM user_profiles up
    LEFT JOIN roles r ON up.role = r.id;
  `);

  return result.rows.map((row) => {
    const hasRole = row.role_id && row.role_name;
    return {
      id: row.user_id.toString(),
      full_name: row.full_name,
      username: row.username,
      avatar_url: row.avatar_url,
      role_id: row.role ? row.role.toString() : null,
      role: hasRole
        ? {
            id: row.role_id.toString(),
            name: row.role_name,
            description: row.role_description,
            created_at: new Date(row.role_created_at).toISOString(),
          }
        : undefined,
      created_at: new Date(row.user_created_at).toISOString(),
      updated_at: new Date(row.user_updated_at).toISOString(),
    };
  });
}

export async function updateUserProfile(
  userId: string,
  data: Partial<Pick<UserProfile, 'full_name' | 'avatar_url' | 'role_id'>>
): Promise<UserProfile> {
  const { full_name, avatar_url, role_id } = data;
  await query(
    `
    UPDATE user_profiles
    SET full_name = COALESCE($1, full_name),
        avatar_url = COALESCE($2, avatar_url),
        role = COALESCE($3, role),
        updated_at = NOW()
    WHERE id = $4;
  `,
    [full_name, avatar_url, role_id, userId]
  );
  const profiles = await getUserProfiles();
  const updated = profiles.find(p => p.id === userId);
  if (!updated) throw new Error('Updated user not found');
  return updated;
}

export interface NewUserInput {
  username: string;
  password: string;
  full_name: string;
  role: 'admin' | 'user';
}

export async function createUser(userData: NewUserInput): Promise<UserProfile> {
  const authUser = await createAuthUserPlaceholder(userData.username, userData.password);
  const { rows } = await query(
    `
    INSERT INTO user_profiles (id, username, full_name, role, created_at, updated_at)
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING *;
  `,
    [authUser.id, userData.username, userData.full_name, userData.role]
  );
  const user = rows[0];
  return {
    id: user.id.toString(),
    full_name: user.full_name,
    username: user.username,
    avatar_url: user.avatar_url,
    role_id: user.role ? user.role.toString() : null,
    created_at: new Date(user.created_at).toISOString(),
    updated_at: new Date(user.updated_at).toISOString(),
  };
}

export async function deleteUser(userId: string): Promise<void> {
  await query('DELETE FROM user_profiles WHERE id = $1;', [userId]);
}

export async function updateUser(
  userId: string,
  data: { username: string; full_name: string; role: 'admin' | 'user' }
): Promise<void> {
  await query(
    'UPDATE user_profiles SET username = $1, full_name = $2, role = $3, updated_at = NOW() WHERE id = $4',
    [data.username, data.full_name, data.role, userId]
  );
}

// --- Auth Placeholders ---
export async function createAuthUserPlaceholder(
  username: string,
  passwordHash: string
): Promise<{ id: string; username: string }> {
  return { id: randomUUID(), username };
}

export async function sendPasswordResetEmail(username: string): Promise<void> {
  console.warn('sendPasswordResetEmail placeholder for', username);
}

export async function updatePasswordWithToken(token: string, newPassword: string): Promise<void> {
  console.warn('updatePasswordWithToken placeholder called for token', token);
}
