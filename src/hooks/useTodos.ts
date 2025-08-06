import { useState, useCallback } from 'react';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../types/todo';
import { TodoService } from '../services/todoService';

/**
 * Custom hook for managing todos state and operations
 * Provides CRUD operations and state management for todos
 */
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const todoService = new TodoService();

  /**
   * Loads all todos from the API
   */
  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedTodos = await todoService.getAllTodos();
      setTodos(fetchedTodos);
    } catch (err: any) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [todoService]);

  /**
   * Adds a new todo
   * @param createDto - Data for creating the todo
   */
  const addTodo = useCallback(async (createDto: CreateTodoDto) => {
    setError(null);
    
    try {
      const newTodo = await todoService.createTodo(createDto);
      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (err: any) {
      setError(err.message || 'Failed to create todo');
      throw err;
    }
  }, [todoService]);

  /**
   * Updates an existing todo
   * @param id - ID of the todo to update
   * @param updateDto - Data for updating the todo
   */
  const updateTodo = useCallback(async (id: number, updateDto: UpdateTodoDto) => {
    setError(null);
    
    try {
      const updatedTodo = await todoService.updateTodo(id, updateDto);
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update todo');
      throw err;
    }
  }, [todoService]);

  /**
   * Deletes a todo
   * @param id - ID of the todo to delete
   */
  const deleteTodo = useCallback(async (id: number) => {
    setError(null);
    
    try {
      await todoService.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete todo');
      throw err;
    }
  }, [todoService]);

  /**
   * Toggles the completion status of a todo
   * @param id - ID of the todo to toggle
   */
  const toggleTodo = useCallback(async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      await updateTodo(id, { completed: !todo.completed });
    } catch (err) {
      // Error is already handled in updateTodo
    }
  }, [todos, updateTodo]);

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    todos,
    loading,
    error,
    loadTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearError,
  };
}; 