import axios from 'axios';
import { TodoService } from '../todoService';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../../types/todo';

// BEST PRACTICE: Mock external dependencies
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

describe('TodoService', () => {
  let todoService: TodoService;
  const baseURL = 'http://localhost:3000/api/todos';

  beforeEach(() => {
    // BEST PRACTICE: Create fresh instance for each test
    todoService = new TodoService(baseURL);
    jest.clearAllMocks();
  });

  describe('createTodo', () => {
    it('should create todo successfully', async () => {
      const createData = createMockCreateDto();
      const newTodo = createMockTodo();

      // BEST PRACTICE: Mock successful response
      mockedAxios.post.mockResolvedValue({ data: newTodo });

      const result = await todoService.createTodo(createData);

      // BEST PRACTICE: Check that request was made correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(`${baseURL}`, createData);
      expect(result).toEqual(newTodo);
    });

    it('should handle creation error', async () => {
      const createData = createMockCreateDto();
      const errorMessage = 'Failed to create todo';

      // BEST PRACTICE: Mock error response
      mockedAxios.post.mockRejectedValue(new Error(errorMessage));

      await expect(todoService.createTodo(createData)).rejects.toThrow(errorMessage);
    });
  });

  describe('getAllTodos', () => {
    it('should fetch all todos successfully', async () => {
      const todos = [createMockTodo(), createMockTodo({ id: 2, title: 'Todo 2' })];

      // BEST PRACTICE: Mock successful response
      mockedAxios.get.mockResolvedValue({ data: todos });

      const result = await todoService.getAllTodos();

      expect(mockedAxios.get).toHaveBeenCalledWith(`${baseURL}`);
      expect(result).toEqual(todos);
    });

    it('should handle fetch error', async () => {
      const errorMessage = 'Failed to fetch todos';

      // BEST PRACTICE: Mock error response
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      await expect(todoService.getAllTodos()).rejects.toThrow(errorMessage);
    });
  });

  describe('updateTodo', () => {
    it('should update todo successfully', async () => {
      const updateData = createMockUpdateDto();
      const updatedTodo = createMockTodo({ ...updateData });

      // BEST PRACTICE: Mock successful response
      mockedAxios.patch.mockResolvedValue({ data: updatedTodo });

      const result = await todoService.updateTodo(1, updateData);

      expect(mockedAxios.patch).toHaveBeenCalledWith(`${baseURL}/1`, updateData);
      expect(result).toEqual(updatedTodo);
    });

    it('should handle update error', async () => {
      const updateData = createMockUpdateDto();
      const errorMessage = 'Failed to update todo';

      // BEST PRACTICE: Mock error response
      mockedAxios.patch.mockRejectedValue(new Error(errorMessage));

      await expect(todoService.updateTodo(1, updateData)).rejects.toThrow(errorMessage);
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo successfully', async () => {
      const deletedTodo = createMockTodo();

      // BEST PRACTICE: Mock successful response
      mockedAxios.delete.mockResolvedValue({ data: deletedTodo });

      const result = await todoService.deleteTodo(1);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`${baseURL}/1`);
      expect(result).toEqual(deletedTodo);
    });

    it('should handle deletion error', async () => {
      const errorMessage = 'Failed to delete todo';

      // BEST PRACTICE: Mock error response
      mockedAxios.delete.mockRejectedValue(new Error(errorMessage));

      await expect(todoService.deleteTodo(1)).rejects.toThrow(errorMessage);
    });
  });

  describe('service integration', () => {
    it('should handle multiple operations correctly', async () => {
      const todo = createMockTodo();

      // BEST PRACTICE: Set up mocks for different operations
      mockedAxios.get.mockResolvedValue({ data: [todo] });
      mockedAxios.patch.mockResolvedValue({ data: todo });
      mockedAxios.delete.mockResolvedValue({ data: todo });

      // BEST PRACTICE: Perform various operations
      await todoService.getAllTodos();
      await todoService.updateTodo(1, { title: 'Updated' });
      await todoService.deleteTodo(1);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${baseURL}`);
      expect(mockedAxios.patch).toHaveBeenCalledWith(`${baseURL}/1`, { title: 'Updated' });
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${baseURL}/1`);
    });
  });
}); 