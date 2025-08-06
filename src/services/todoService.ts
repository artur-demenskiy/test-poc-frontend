import axios, { AxiosResponse } from 'axios';
import { Todo, CreateTodoDto, UpdateTodoDto, TodoStatistics } from '../types/todo';

/**
 * Service for managing todo items via API
 * Handles all CRUD operations and communicates with the NestJS backend
 */
export class TodoService {
  private readonly apiUrl: string;

  constructor(apiUrl: string = 'http://localhost:3000/api/todos') {
    this.apiUrl = apiUrl;
  }

  /**
   * Creates a new todo item
   * @param createTodoDto - Data for creating a new todo
   * @returns Promise<Todo> - The created todo item
   * @throws Error - If the request fails
   */
  async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    try {
      const response: AxiosResponse<Todo> = await axios.post(this.apiUrl, createTodoDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Retrieves all todo items
   * @returns Promise<Todo[]> - Array of all todo items
   * @throws Error - If the request fails
   */
  async getAllTodos(): Promise<Todo[]> {
    try {
      const response: AxiosResponse<Todo[]> = await axios.get(this.apiUrl);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Retrieves a specific todo item by ID
   * @param id - The ID of the todo item to retrieve
   * @returns Promise<Todo> - The found todo item
   * @throws Error - If the todo item is not found or request fails
   */
  async getTodoById(id: number): Promise<Todo> {
    try {
      const response: AxiosResponse<Todo> = await axios.get(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Updates a specific todo item by ID
   * @param id - The ID of the todo item to update
   * @param updateTodoDto - Data for updating the todo
   * @returns Promise<Todo> - The updated todo item
   * @throws Error - If the todo item is not found or request fails
   */
  async updateTodo(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    try {
      const response: AxiosResponse<Todo> = await axios.patch(`${this.apiUrl}/${id}`, updateTodoDto);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Deletes a specific todo item by ID
   * @param id - The ID of the todo item to delete
   * @returns Promise<Todo> - The deleted todo item
   * @throws Error - If the todo item is not found or request fails
   */
  async deleteTodo(id: number): Promise<Todo> {
    try {
      const response: AxiosResponse<Todo> = await axios.delete(`${this.apiUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Retrieves todos by completion status
   * @param completed - Filter by completion status
   * @returns Promise<Todo[]> - Array of filtered todo items
   * @throws Error - If the request fails
   */
  async getTodosByStatus(completed: boolean): Promise<Todo[]> {
    try {
      const response: AxiosResponse<Todo[]> = await axios.get(`${this.apiUrl}/status?completed=${completed}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Searches todos by title (case-insensitive)
   * @param searchTerm - Search term to match against todo titles
   * @returns Promise<Todo[]> - Array of matching todo items
   * @throws Error - If the request fails
   */
  async searchTodos(searchTerm: string): Promise<Todo[]> {
    try {
      const response: AxiosResponse<Todo[]> = await axios.get(`${this.apiUrl}/search?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Gets statistics about todos
   * @returns Promise<TodoStatistics> - Object containing todo statistics
   * @throws Error - If the request fails
   */
  async getStatistics(): Promise<TodoStatistics> {
    try {
      const response: AxiosResponse<TodoStatistics> = await axios.get(`${this.apiUrl}/statistics`);
      return response.data;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Handles axios errors and throws appropriate error messages
   * @param error - The axios error object
   * @throws Error - With appropriate error message
   */
  private handleError(error: any): never {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
} 