export interface UserDetails {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  user_type: 'Student' | 'Professor' | 'User';
  student_code?: string;
  professor_code?: string;
}

export interface ProfessorSummary {
  professor_id: number;
  professor_code: string;
  professor_name: string;
  email: string;
  is_active: boolean;
  total_subjects: number;
  total_degrees: number;
  degree_names?: string;
}

export interface StudentSummary {
  student_id: number;
  student_code: string;
  student_name: string;
  email: string;
  is_active: boolean;
  total_subjects: number;
  total_degrees: number;
  degree_names?: string;
}

export interface UserRoleDetails {
  user_role_id: number;
  user_id: number;
  user_name: string;
  email: string;
  role_id: number;
  role_name: string;
  role_description?: string;
  degree_name?: string;
  subject_name?: string;
  assigned_at: Date;
  is_active: boolean;
}

export interface RolePermissionsSummary {
  role_id: number;
  role_name: string;
  total_permissions: number;
  resources?: string;
  actions?: string;
  permission_list?: string;
}

export interface SubjectDetails {
  subject_id: number;
  subject_name: string;
  subject_code: string;
  is_active: boolean;
  degree_id: number;
  degree_name: string;
  degree_code: string;
  total_professors: number;
  total_students: number;
}

export interface DegreeStatistics {
  degree_id: number;
  degree_name: string;
  degree_code: string;
  is_active: boolean;
  total_subjects: number;
  total_students: number;
  total_professors: number;
}