// src/services/postgres/subscribers.ts
'use server';

import { query } from './db';
import type {
  Subscriber,
  SubscriberData,
  SubscriberStatus,
  SubscriberType,
} from '@/types/subscribers';

/* -------------------------------------------------------------
   Types for enhanced filtering
-------------------------------------------------------------- */
interface ListSubscribersOptions {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  subscriberType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ListSubscribersResult {
  subscribers: Subscriber[];
  total: number;
  totalPages: number;
}

/* -------------------------------------------------------------
   Helper – map a DB row to the frontend Subscriber shape
-------------------------------------------------------------- */
function mapRowToSubscriber(row: any): Subscriber {
  return {
    id: row.id.toString(),
    subscriberType: row.subscriber_type as SubscriberType,

    /* personal / business */
    fullName: row.full_name,
    companyName: row.company_name,
    birthday: row.birthday ? new Date(row.birthday) : undefined,
    establishedDate: row.established_date
      ? new Date(row.established_date)
      : undefined,

    /* address & contact */
    address: row.address,
    pointOfReference: row.point_of_reference,
    email: row.email,
    phoneNumber: row.phone_number,
    mobileNumber: row.mobile_number,

    /* IDs */
    taxId: row.tax_id,
    businessNumber: row.business_number,
    idNumber: row.id_number,

    /* meta */
    signupDate: new Date(row.signup_date),
    status: row.status as SubscriberStatus,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),

    /* stubs for yet-to-implement relations */
    services: [],
    billing: {
      balance: 0,
      nextBillDate: '',
      pastInvoices: [],
      pendingInvoices: [],
      canceledInvoices: [],
      paymentPlans: [],
      promisesToPay: [],
    },
    serviceCalls: [],
    inventory: [],
    documents: [],
    notes: [],
    history: [],
  };
}

/* -------------------------------------------------------------
   Enhanced LIST with multiple filters and sorting
-------------------------------------------------------------- */
export async function listSubscribers(
  options: ListSubscribersOptions = {}
): Promise<ListSubscribersResult> {
  const {
    page = 1,
    perPage = 10,
    status,
    search,
    subscriberType,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = options;

  const offset = (page - 1) * perPage;
  const conditions: string[] = ['deleted_at IS NULL'];
  const values: any[] = [];
  let paramIndex = 1;

  // Status filter
  if (status) {
    conditions.push(`status = $${paramIndex}`);
    values.push(status);
    paramIndex++;
  }

  // Subscriber type filter
  if (subscriberType) {
    conditions.push(`subscriber_type = $${paramIndex}`);
    values.push(subscriberType);
    paramIndex++;
  }

  // Search filter (searches across multiple fields)
  if (search && search.trim()) {
    const searchTerm = `%${search.trim()}%`;
    conditions.push(`(
      full_name ILIKE $${paramIndex} OR 
      company_name ILIKE $${paramIndex} OR 
      email ILIKE $${paramIndex} OR
      phone_number ILIKE $${paramIndex} OR
      mobile_number ILIKE $${paramIndex} OR
      address ILIKE $${paramIndex} OR
      tax_id ILIKE $${paramIndex} OR
      business_number ILIKE $${paramIndex} OR
      id_number ILIKE $${paramIndex}
    )`);
    values.push(searchTerm);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate and sanitize sort parameters
  const allowedSortFields = [
    'created_at', 
    'updated_at', 
    'signup_date',
    'full_name', 
    'company_name', 
    'status', 
    'subscriber_type',
    'email',
    'phone_number',
    'address'
  ];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
  const safeSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  // Add pagination parameters
  values.push(perPage, offset);
  const limitOffset = `LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

  const dataQuery = `
    SELECT * FROM subscribers
    ${whereClause}
    ORDER BY ${safeSortBy} ${safeSortOrder}
    ${limitOffset}
  `;

  const countQuery = `
    SELECT COUNT(*) FROM subscribers
    ${whereClause}
  `;

  // Execute both queries
  const [dataResult, countResult] = await Promise.all([
    query(dataQuery, values),
    query(countQuery, values.slice(0, -2)) // Remove LIMIT/OFFSET params for count
  ]);

  const total = Number(countResult.rows[0]?.count ?? 0);
  const totalPages = Math.ceil(total / perPage);

  return {
    subscribers: dataResult.rows.map(mapRowToSubscriber),
    total,
    totalPages,
  };
}

/* -------------------------------------------------------------
   Backward compatibility - keep the old signature working
-------------------------------------------------------------- */
export async function listSubscribersLegacy(
  page = 1,
  perPage = 10,
  status?: string
): Promise<ListSubscribersResult> {
  return listSubscribers({ page, perPage, status });
}

/* -------------------------------------------------------------
   BULK OPERATIONS
-------------------------------------------------------------- */
export async function bulkUpdateSubscriberStatus(
  ids: string[],
  newStatus: SubscriberStatus
): Promise<{ updated: number; failed: string[] }> {
  if (ids.length === 0) {
    return { updated: 0, failed: [] };
  }

  const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
  
  try {
    const result = await query(
      `UPDATE subscribers 
       SET status = $${ids.length + 1}, updated_at = NOW()
       WHERE id IN (${placeholders}) AND deleted_at IS NULL
       RETURNING id`,
      [...ids, newStatus]
    );

    const updatedIds = result.rows.map(row => row.id.toString());
    const failed = ids.filter(id => !updatedIds.includes(id));

    return {
      updated: result.rowCount || 0,
      failed
    };
  } catch (error) {
    console.error('Bulk update failed:', error);
    return { updated: 0, failed: ids };
  }
}

export async function bulkDeleteSubscribers(
  ids: string[]
): Promise<{ deleted: number; failed: string[] }> {
  if (ids.length === 0) {
    return { deleted: 0, failed: [] };
  }

  const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
  
  try {
    const result = await query(
      `UPDATE subscribers 
       SET deleted_at = NOW(), updated_at = NOW()
       WHERE id IN (${placeholders}) AND deleted_at IS NULL
       RETURNING id`,
      ids
    );

    const deletedIds = result.rows.map(row => row.id.toString());
    const failed = ids.filter(id => !deletedIds.includes(id));

    return {
      deleted: result.rowCount || 0,
      failed
    };
  } catch (error) {
    console.error('Bulk delete failed:', error);
    return { deleted: 0, failed: ids };
  }
}

/* -------------------------------------------------------------
   ADVANCED SEARCH
-------------------------------------------------------------- */
export async function searchSubscribers(
  searchQuery: string,
  filters: {
    status?: SubscriberStatus[];
    subscriberType?: SubscriberType[];
    signupDateFrom?: Date;
    signupDateTo?: Date;
  } = {},
  options: {
    page?: number;
    perPage?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<ListSubscribersResult> {
  const { page = 1, perPage = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;
  const offset = (page - 1) * perPage;
  
  const conditions: string[] = ['deleted_at IS NULL'];
  const values: any[] = [];
  let paramIndex = 1;

  // Text search
  if (searchQuery && searchQuery.trim()) {
    const searchTerm = `%${searchQuery.trim()}%`;
    conditions.push(`(
      full_name ILIKE $${paramIndex} OR 
      company_name ILIKE $${paramIndex} OR 
      email ILIKE $${paramIndex} OR
      phone_number ILIKE $${paramIndex} OR
      address ILIKE $${paramIndex}
    )`);
    values.push(searchTerm);
    paramIndex++;
  }

  // Status filter
  if (filters.status && filters.status.length > 0) {
    const statusPlaceholders = filters.status.map(() => `$${paramIndex++}`).join(',');
    conditions.push(`status IN (${statusPlaceholders})`);
    values.push(...filters.status);
  }

  // Subscriber type filter
  if (filters.subscriberType && filters.subscriberType.length > 0) {
    const typePlaceholders = filters.subscriberType.map(() => `$${paramIndex++}`).join(',');
    conditions.push(`subscriber_type IN (${typePlaceholders})`);
    values.push(...filters.subscriberType);
  }

  // Date range filters
  if (filters.signupDateFrom) {
    conditions.push(`signup_date >= $${paramIndex}`);
    values.push(filters.signupDateFrom.toISOString().split('T')[0]);
    paramIndex++;
  }

  if (filters.signupDateTo) {
    conditions.push(`signup_date <= $${paramIndex}`);
    values.push(filters.signupDateTo.toISOString().split('T')[0]);
    paramIndex++;
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  // Validate sort parameters
  const allowedSortFields = ['created_at', 'updated_at', 'signup_date', 'full_name', 'company_name', 'status'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
  const safeSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

  values.push(perPage, offset);

  const dataQuery = `
    SELECT * FROM subscribers
    ${whereClause}
    ORDER BY ${safeSortBy} ${safeSortOrder}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const countQuery = `
    SELECT COUNT(*) FROM subscribers
    ${whereClause}
  `;

  const [dataResult, countResult] = await Promise.all([
    query(dataQuery, values),
    query(countQuery, values.slice(0, -2))
  ]);

  const total = Number(countResult.rows[0]?.count ?? 0);
  const totalPages = Math.ceil(total / perPage);

  return {
    subscribers: dataResult.rows.map(mapRowToSubscriber),
    total,
    totalPages,
  };
}

/* -------------------------------------------------------------
   ADD (unchanged)
-------------------------------------------------------------- */
export async function addSubscriber(
  subscriberData: SubscriberData
): Promise<Subscriber> {
  const dataToInsert = {
    subscriber_type: subscriberData.subscriber_type,
    full_name: subscriberData.full_name || null,
    company_name: subscriberData.company_name || null,
    birthday: subscriberData.birthday
      ? new Date(subscriberData.birthday).toISOString().split('T')[0]
      : null,
    established_date: subscriberData.established_date
      ? new Date(subscriberData.established_date).toISOString().split('T')[0]
      : null,
    address: subscriberData.address,
    point_of_reference: subscriberData.point_of_reference || null,
    email: subscriberData.email,
    phone_number: subscriberData.phone_number,
    mobile_number: subscriberData.mobile_number || null,
    tax_id: subscriberData.tax_id || null,
    business_number: subscriberData.business_number || null,
    id_number: subscriberData.id_number || null,
    signup_date: subscriberData.signup_date
      ? new Date(subscriberData.signup_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    status: subscriberData.status || 'Active',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const cols = Object.keys(dataToInsert).join(', ');
  const placeholders = Object.keys(dataToInsert)
    .map((_, i) => `$${i + 1}`)
    .join(', ');
  const values = Object.values(dataToInsert);

  const { rows } = await query(
    `INSERT INTO subscribers (${cols}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  if (rows.length === 0) throw new Error('Failed to add subscriber.');
  return mapRowToSubscriber(rows[0]);
}

/* -------------------------------------------------------------
   GET by ID (unchanged)
-------------------------------------------------------------- */
export async function getSubscriberById(
  id: string
): Promise<Subscriber | null> {
  const { rows } = await query(
    'SELECT * FROM subscribers WHERE id = $1 AND deleted_at IS NULL',
    [id]
  );
  return rows.length ? mapRowToSubscriber(rows[0]) : null;
}

/* -------------------------------------------------------------
   UPDATE (unchanged)
-------------------------------------------------------------- */
export async function updateSubscriber(
  id: string,
  updates: Partial<SubscriberData>
): Promise<Subscriber> {
  if (Object.keys(updates).length === 0) {
    throw new Error('No fields provided for update.');
  }

  const map: Partial<Record<keyof SubscriberData, string>> = {
    subscriber_type: 'subscriber_type',
    full_name: 'full_name',
    company_name: 'company_name',
    birthday: 'birthday',
    established_date: 'established_date',
    address: 'address',
    point_of_reference: 'point_of_reference',
    email: 'email',
    phone_number: 'phone_number',
    mobile_number: 'mobile_number',
    tax_id: 'tax_id',
    business_number: 'business_number',
    id_number: 'id_number',
    signup_date: 'signup_date',
    status: 'status',
  };

  const sets: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(updates) as [
    keyof SubscriberData,
    any
  ][]) {
    if (val === undefined) continue;
    const column = map[key];
    if (!column) continue;
    sets.push(`${column} = $${idx}`);
    values.push(val instanceof Date ? val.toISOString().split('T')[0] : val);
    idx++;
  }

  sets.push('updated_at = NOW()');
  values.push(id);

  const { rows } = await query(
    `UPDATE subscribers SET ${sets.join(', ')}
     WHERE id = $${idx} AND deleted_at IS NULL
     RETURNING *`,
    values
  );
  if (rows.length === 0) throw new Error('Subscriber not found.');
  return mapRowToSubscriber(rows[0]);
}

/* -------------------------------------------------------------
   DELETE (unchanged)
-------------------------------------------------------------- */
export async function deleteSubscriber(
  id: string
): Promise<Subscriber | null> {
  const { rows } = await query(
    'DELETE FROM subscribers WHERE id = $1 RETURNING *',
    [id]
  );
  return rows.length ? mapRowToSubscriber(rows[0]) : null;
}

/* -------------------------------------------------------------
   STATS (enhanced with more metrics)
-------------------------------------------------------------- */
export interface SubscriberStats {
  newSubscribers: number;
  activeSubscribers: number;
  suspendedSubscribers: number;
  totalSubscribers: number;
  inactiveSubscribers: number;
  plannedSubscribers: number;
  canceledSubscribers: number;
  residentialCount: number;
  commercialCount: number;
}

export async function getSubscriberStats(): Promise<SubscriberStats> {
  const { rows } = await query(`
    SELECT
      COUNT(*) FILTER (WHERE signup_date >= date_trunc('month', CURRENT_DATE)) AS new_subscribers,
      COUNT(*) FILTER (WHERE status = 'Active') AS active_subscribers,
      COUNT(*) FILTER (WHERE status = 'Suspended') AS suspended_subscribers,
      COUNT(*) FILTER (WHERE status = 'Inactive') AS inactive_subscribers,
      COUNT(*) FILTER (WHERE status = 'Planned') AS planned_subscribers,
      COUNT(*) FILTER (WHERE status = 'Canceled') AS canceled_subscribers,
      COUNT(*) FILTER (WHERE subscriber_type = 'Residential') AS residential_count,
      COUNT(*) FILTER (WHERE subscriber_type = 'Commercial') AS commercial_count,
      COUNT(*) AS total_subscribers
    FROM subscribers
    WHERE deleted_at IS NULL;
  `);

  const r = rows[0] || {};
  return {
    newSubscribers: Number(r.new_subscribers ?? 0),
    activeSubscribers: Number(r.active_subscribers ?? 0),
    suspendedSubscribers: Number(r.suspended_subscribers ?? 0),
    inactiveSubscribers: Number(r.inactive_subscribers ?? 0),
    plannedSubscribers: Number(r.planned_subscribers ?? 0),
    canceledSubscribers: Number(r.canceled_subscribers ?? 0),
    residentialCount: Number(r.residential_count ?? 0),
    commercialCount: Number(r.commercial_count ?? 0),
    totalSubscribers: Number(r.total_subscribers ?? 0),
  };
}