// src/types/teacher.ts
export interface RegisterStudentsRequest {
  teacher: string;
  students: string[];
}

export interface SuspendStudentRequest {
  student: string;
}

export interface NotificationRequest {
  teacher: string;
  notification: string;
}

export interface CommonStudentsResponse {
  students: string[];
}

export interface NotificationResponse {
  recipients: string[];
}
