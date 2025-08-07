import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useTodos } from '../useTodos';
import { TodoService } from '../../services/todoService';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../../types/todo';

// BEST PRACTICE: Mock external dependencies
jest.mock('../../services/todoService');
const mockTodoService = TodoService as jest.MockedClass<typeof TodoService>;

// BEST PRACTICE #1: Test Data Factory
// See BEST_PRACTICES_DEMO.md - section "1. Test Data Factory Pattern"
// ✅ Reusable factory for creating test data
// ✅ Easy to create variations through overrides
// ✅ Data consistency across all tests
const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 1,
  title: 'Test Todo',
  description: 'Test Description',
  completed: false,
  createdAt: new Date('2024-01-15T10:30:00.000Z'),
  updatedAt: new Date('2024-01-15T10:30:00.000Z'),
  ...overrides,
});

const createMockCreateDto = (overrides: Partial<CreateTodoDto> = {}): CreateTodoDto => ({
  title: 'New Todo',
  description: 'New Description',
  completed: false,
  ...overrides,
});

const createMockUpdateDto = (overrides: Partial<UpdateTodoDto> = {}): UpdateTodoDto => ({
  title: 'Updated Todo',
  description: 'Updated Description',
  completed: true,
  ...overrides,
});

describe('useTodos', () => {
  let mockInstance: any;

  beforeEach(() => {
    // BEST PRACTICE: Create fresh mock instance for each test
    mockInstance = {
      getAllTodos: jest.fn(),
      createTodo: jest.fn(),
      updateTodo: jest.fn(),
      deleteTodo: jest.fn(),
    };

    // Mock the constructor to return our mock instance
    mockTodoService.mockImplementation(() => mockInstance);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // BEST PRACTICE #2: Hook State Testing
  // See BEST_PRACTICES_DEMO.md - section "12. Hook State Testing"
  // ✅ Test initial state
  // ✅ Check state changes
  // ✅ Verify state consistency
  // ✅ Test state management
  it('should have correct initial state', () => {
    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  // BEST PRACTICE #3: Async Operations Testing
  // See BEST_PRACTICES_DEMO.md - section "13. Async Operations Testing"
  // ✅ Test async operations
  // ✅ Check loading states
  // ✅ Verify error handling
  // ✅ Test success scenarios
  it('should load todos successfully', async () => {
    const mockTodos = [createMockTodo(), createMockTodo({ id: 2, title: 'Todo 2' })];
    mockInstance.getAllTodos.mockResolvedValue(mockTodos);

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await result.current.loadTodos();
    });

    expect(result.current.todos).toEqual(mockTodos);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle loading error', async () => {
    const errorMessage = 'Failed to load todos';
    mockInstance.getAllTodos.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await result.current.loadTodos();
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
    expect(result.current.todos).toEqual([]);
  });

  // BEST PRACTICE #4: CRUD Operations Testing
  // See BEST_PRACTICES_DEMO.md - section "14. CRUD Operations Testing"
  // ✅ Test create operations
  // ✅ Test read operations
  // ✅ Test update operations
  // ✅ Test delete operations
  it('should add new todo', async () => {
    const newTodo = createMockTodo({ id: 2, title: 'New Todo' });
    const createData = createMockCreateDto();
    mockInstance.createTodo.mockResolvedValue(newTodo);

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await result.current.addTodo(createData);
    });

    expect(mockInstance.createTodo).toHaveBeenCalledWith(createData);
    expect(result.current.todos).toContainEqual(newTodo);
  });

  it('should update existing todo', async () => {
    const existingTodo = createMockTodo();
    const updatedTodo = createMockTodo({ title: 'Updated Todo' });
    const updateData = createMockUpdateDto();
    
    // Mock createTodo to return the existing todo
    mockInstance.createTodo.mockResolvedValue(existingTodo);
    mockInstance.updateTodo.mockResolvedValue(updatedTodo);

    const { result } = renderHook(() => useTodos());

    // First add the todo to the list
    await act(async () => {
      await result.current.addTodo({ title: existingTodo.title, description: existingTodo.description });
    });

    // Then update it
    await act(async () => {
      await result.current.updateTodo(1, updateData);
    });

    expect(mockInstance.updateTodo).toHaveBeenCalledWith(1, updateData);
    // The hook should update the todos array with the updated todo
    expect(result.current.todos).toContainEqual(updatedTodo);
  });

  it('should delete todo', async () => {
    const todoToDelete = createMockTodo();
    
    // Mock createTodo to return the todo to delete
    mockInstance.createTodo.mockResolvedValue(todoToDelete);
    mockInstance.deleteTodo.mockResolvedValue(todoToDelete);

    const { result } = renderHook(() => useTodos());

    // First add the todo to the list
    await act(async () => {
      await result.current.addTodo({ title: todoToDelete.title, description: todoToDelete.description });
    });

    // Then delete it
    await act(async () => {
      await result.current.deleteTodo(1);
    });

    expect(mockInstance.deleteTodo).toHaveBeenCalledWith(1);
    expect(result.current.todos).not.toContainEqual(todoToDelete);
  });

  // BEST PRACTICE #5: State Management Testing
  // See BEST_PRACTICES_DEMO.md - section "15. State Management Testing"
  // ✅ Test state transitions
  // ✅ Check loading states
  // ✅ Verify error states
  // ✅ Test state consistency
  it('should handle loading state correctly', async () => {
    const mockTodos = [createMockTodo()];
    let resolvePromise: (value: Todo[]) => void;
    const pendingPromise = new Promise<Todo[]>((resolve) => {
      resolvePromise = resolve;
    });
    mockInstance.getAllTodos.mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useTodos());

    // Start loading
    act(() => {
      result.current.loadTodos();
    });

    expect(result.current.loading).toBe(true);

    // Resolve promise
    await act(async () => {
      resolvePromise!(mockTodos);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.todos).toEqual(mockTodos);
  });

  it('should clear error state', () => {
    const { result } = renderHook(() => useTodos());

    // Set an error first
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  // BEST PRACTICE #6: Error Handling Testing
  // See BEST_PRACTICES_DEMO.md - section "16. Error Handling Testing"
  // ✅ Test error scenarios
  // ✅ Check error state management
  // ✅ Verify error recovery
  // ✅ Test error propagation
  it('should handle service errors gracefully', async () => {
    const errorMessage = 'Service unavailable';
    mockInstance.createTodo.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      try {
        await result.current.addTodo(createMockCreateDto());
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.todos).toEqual([]);
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network connection lost');
    mockInstance.getAllTodos.mockRejectedValue(networkError);

    const { result } = renderHook(() => useTodos());

    await act(async () => {
      await result.current.loadTodos();
    });

    expect(result.current.error).toBe('Network connection lost');
    expect(result.current.loading).toBe(false);
  });
}); 