/**
 * Interface representing a todo item
 * Matches the structure from the NestJS backend
 */
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating a new todo
 */
export interface CreateTodoDto {
  title: string;
  description?: string;
  completed?: boolean;
}

/**
 * DTO for updating an existing todo
 */
export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * Statistics about todos
 */
export interface TodoStatistics {
  total: number;
  completed: number;
  pending: number;
}

/**
 * Filter options for todos
 */
export interface TodoFilters {
  completed?: boolean;
  searchTerm?: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Error response from API
 */
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
} 