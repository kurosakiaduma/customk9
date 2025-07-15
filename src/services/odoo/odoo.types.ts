// Core Odoo Types
export interface OdooSessionInfo {
  uid: number;
  username: string;
  name?: string;
  is_admin: boolean;
  is_system: boolean;
  session_id: string;
  partner_id?: number | null;
  context: Record<string, unknown>;
  groups_id?: number[];
  expires_at?: number;
  db?: string;
  company_id?: number;
  tz?: string;
  lang?: string;
  [key: string]: unknown; // Allow additional properties
}

export interface OdooUser {
  id: number;
  uid?: number; // Add uid as an optional property
  name: string;
  email: string;
  partner_id?: [number, string] | number | null;
  is_admin: boolean;
  is_system: boolean;
  session_id: string;
  context: Record<string, unknown>;
  user_context?: Record<string, unknown>; // Add user_context property
  groups_id: number[];
  [key: string]: unknown; // Allow additional properties
}

export interface OdooError {
  code: number;
  message: string;
  data?: {
    name: string;
    debug: string;
    message: string;
    arguments: unknown[];
    context: Record<string, unknown>;
  };
}

export interface OdooResponse<T = unknown> {
  jsonrpc: string;
  id: number | string | null;
  result?: T;
  error?: OdooError;
}

export type OdooDomainItem = 
  | [string, string, unknown]  // [field, operator, value]
  | '&' | '|' | '!'  // logical operators
  | OdooDomainItem[];  // nested domains

export interface OdooSearchReadParams {
  model: string;
  domain?: OdooDomainItem[];
  fields?: string[];
  limit?: number;
  offset?: number;
  sort?: string;
  context?: Record<string, unknown>;
}

export interface OdooCreateParams {
  model: string;
  data: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface OdooUpdateParams {
  model: string;
  id: number;
  data: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface OdooDeleteParams {
  model: string;
  ids: number[];
  context?: Record<string, unknown>;
}

export interface OdooCallParams {
  model: string;
  method: string;
  args: unknown[];
  kwargs?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface OdooLoginParams {
  login: string;
  password: string;
  db: string;
}

export interface OdooVersionInfo {
  server_serie: string;
  server_version: string;
  server_version_info: number[];
  protocol_version: number;
}

export interface OdooModuleInfo {
  name: string;
  state: string;
  version: string;
  author: string;
  description: string;
  category: string;
  depends: string[];
  demo: boolean;
  installable: boolean;
  auto_install: boolean;
}

export interface OdooFieldInfo {
  type: string;
  string: string;
  help?: string;
  readonly: boolean;
  required: boolean;
  searchable: boolean;
  sortable: boolean;
  store: boolean;
  groups?: string[];
  relation?: string;
  selection?: Array<[string, string]>;
  related?: string;
  default?: unknown;
}

export interface OdooModelInfo {
  name: string;
  model: string;
  info: string;
  fields: Record<string, OdooFieldInfo>;
  field_id: number[];
  field_parent?: string;
  field_name?: string;
  field_child_ids?: string;
  field_parent_name?: string;
  field_active?: string;
  field_state?: string;
  field_sequence?: string;
  field_create_uid?: string;
  field_create_date?: string;
  field_write_uid?: string;
  field_write_date?: string;
  field_display_name?: string;
  field___last_update?: string;
}

export interface ProjectTask {
  id: number;
  name: string;
  description: string;
  date_deadline: string; // Due date
  date_assign: string;   // Assignment date
  date_end: string;      // End date
  date_last_stage_update: string;
  date_start: string;    // Start date
  display_name: string;
  display_type: string;
  effective_hours: number;
  kanban_state: 'normal' | 'done' | 'blocked';
  partner_id: [number, string]; // [id, name] of the partner/customer
  project_id: [number, string]; // [id, name] of the project
  stage_id: [number, string];   // [id, name] of the stage
  tag_ids: Array<[number, string]>; // Task tags
  user_id: [number, string];    // [id, name] of the assigned user
  [key: string]: unknown;
}

export interface CalendarEvent {
  id: number;
  name: string;
  description: string;
  start: string;      // Start datetime
  stop: string;       // End datetime
  allday: boolean;    // All-day event
  duration: number;   // Duration in hours
  location: string;   // Event location
  privacy: 'public' | 'private' | 'confidential';
  show_as: 'free' | 'busy';
  state: 'open' | 'done' | 'cancel';
  user_id: [number, string];    // [id, name] of the user
  partner_ids: number[];        // Array of partner IDs
  [key: string]: unknown;
}

// Alias for backward compatibility
export type TrainingPlan = ProjectTask;
