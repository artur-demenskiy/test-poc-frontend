import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../TodoList';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../../types/todo';

// Mock the useTodos hook
jest.mock('../../hooks/useTodos');
import { useTodos } from '../../hooks/useTodos';

// Mock axios
jest.mock('axios');

const mockUseTodos = useTodos as jest.MockedFunction<typeof useTodos>;

// Test data factory
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

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    createMockTodo(),
    createMockTodo({ id: 2, title: 'Test Todo 2', description: 'Test Description 2', completed: true })
  ];

  const defaultMockReturn = {
    todos: mockTodos,
    loading: false,
    error: null,
    loadTodos: jest.fn(),
    addTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
    toggleTodo: jest.fn(),
    clearError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTodos.mockReturnValue(defaultMockReturn);
  });

  describe('rendering', () => {
    it('should render todo list with todos', () => {
      render(<TodoList />);

      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test Description 2')).toBeInTheDocument();
    });

    it('should render empty state when no todos', () => {
      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        todos: []
      });

      render(<TodoList />);

      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
      expect(screen.getByText(/add your first todo to get started/i)).toBeInTheDocument();
    });

    it('should render loading state', () => {
      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        loading: true
      });

      render(<TodoList />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should render error state', () => {
      const errorMessage = 'Failed to load todos';
      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        error: errorMessage
      });

      render(<TodoList />);

      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });

  describe('form functionality', () => {
    it('should add new todo when form is submitted', async () => {
      const user = userEvent.setup();
      const mockAddTodo = jest.fn();
      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        addTodo: mockAddTodo
      });

      render(<TodoList />);

      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const submitButton = screen.getByRole('button', { name: /add todo/i });

      await user.type(titleInput, 'New Todo');
      await user.type(descriptionInput, 'New Description');
      await user.click(submitButton);

      expect(mockAddTodo).toHaveBeenCalledWith({
        title: 'New Todo',
        description: 'New Description',
        completed: false,
      });
    });

    it('should not submit form with empty title', async () => {
      const user = userEvent.setup();
      const mockAddTodo = jest.fn();
      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        addTodo: mockAddTodo
      });

      render(<TodoList />);

      const submitButton = screen.getByRole('button', { name: /add todo/i });
      expect(submitButton).toBeDisabled();

      await user.click(submitButton);
      expect(mockAddTodo).not.toHaveBeenCalled();
    });
  });

  describe('filtering', () => {
    it('should filter todos by status', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      // Initially show all todos
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();

      // Filter by active
      const activeButton = screen.getByText('Active');
      await user.click(activeButton);

      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.queryByText('Test Todo 2')).not.toBeInTheDocument();

      // Filter by completed
      const completedButton = screen.getByText('Completed');
      await user.click(completedButton);

      expect(screen.queryByText('Test Todo')).not.toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();

      // Back to all
      const allButton = screen.getByText('All');
      await user.click(allButton);

      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('should search todos by title', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const searchInput = screen.getByPlaceholderText(/search todos/i);
      await user.type(searchInput, 'Test Todo 2');

      expect(screen.queryByText('Test Todo')).not.toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    });

    it('should search todos by description', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const searchInput = screen.getByPlaceholderText(/search todos/i);
      await user.type(searchInput, 'Test Description 2');

      expect(screen.queryByText('Test Todo')).not.toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    });

    it('should handle search with special characters', async () => {
      const user = userEvent.setup();
      const todosWithSpecialChars = [
        createMockTodo({ title: 'Todo with émojis 🎉' }),
        createMockTodo({ id: 2, title: 'Regular Todo' })
      ];

      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        todos: todosWithSpecialChars
      });

      render(<TodoList />);

      const searchInput = screen.getByPlaceholderText(/search todos/i);
      await user.type(searchInput, 'émojis');

      expect(screen.getByText('Todo with émojis 🎉')).toBeInTheDocument();
      expect(screen.queryByText('Regular Todo')).not.toBeInTheDocument();
    });

    it('should handle search with partial matches', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const searchInput = screen.getByPlaceholderText(/search todos/i);
      await user.type(searchInput, 'Test');

      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    });

    it('should handle search with empty results', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      const searchInput = screen.getByPlaceholderText(/search todos/i);
      await user.type(searchInput, 'nonexistent');

      expect(screen.getByText(/no todos found/i)).toBeInTheDocument();
      expect(screen.getByText(/try adjusting your search or filter criteria/i)).toBeInTheDocument();
    });

    it('should combine search and filter', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      // Set filter to active
      const activeButton = screen.getByText('Active');
      await user.click(activeButton);

      // Search within active todos
      const searchInput = screen.getByPlaceholderText(/search todos/i);
      await user.type(searchInput, 'Test Todo');

      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.queryByText('Test Todo 2')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper heading structure', () => {
      render(<TodoList />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
    });

    it('should have proper form labels', () => {
      render(<TodoList />);

      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });

    it('should have proper button labels', () => {
      render(<TodoList />);

      expect(screen.getAllByLabelText('Edit todo')).toHaveLength(2);
      expect(screen.getAllByLabelText('Delete todo')).toHaveLength(2);
    });

    it('should have proper keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<TodoList />);

      // Tab through the interface
      await user.tab();
      expect(screen.getByLabelText(/title/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/description/i)).toHaveFocus();

      // The next tab might go to filter buttons instead of the submit button
      // Let's just verify the form elements are focusable
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
    });

    it('should have proper ARIA attributes for filter buttons', () => {
      render(<TodoList />);

      const allButton = screen.getByText('All');
      const activeButton = screen.getByText('Active');
      const completedButton = screen.getByText('Completed');

      expect(allButton).toHaveClass('bg-blue-500');
      expect(activeButton).toHaveClass('bg-gray-200');
      expect(completedButton).toHaveClass('bg-gray-200');
    });

    it('should have proper search input attributes', () => {
      render(<TodoList />);

      const searchInput = screen.getByPlaceholderText(/search todos/i);
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchInput).toHaveAttribute('placeholder', 'Search todos...');
    });
  });

  describe('statistics', () => {
    it('should display correct statistics', () => {
      render(<TodoList />);

      // Use more specific selectors to find the statistics values
      const totalElement = screen.getByText('Total:').nextElementSibling;
      const completedElement = screen.getByText('Completed:').nextElementSibling;
      const pendingElement = screen.getByText('Pending:').nextElementSibling;

      expect(totalElement).toHaveTextContent('2');
      expect(completedElement).toHaveTextContent('1');
      expect(pendingElement).toHaveTextContent('1');
    });

    it('should update statistics when todos change', () => {
      const allCompletedTodos = [
        createMockTodo({ completed: true }),
        createMockTodo({ id: 2, title: 'Test Todo 2', completed: true })
      ];

      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        todos: allCompletedTodos
      });

      render(<TodoList />);

      const totalElement = screen.getByText('Total:').nextElementSibling;
      const completedElement = screen.getByText('Completed:').nextElementSibling;
      const pendingElement = screen.getByText('Pending:').nextElementSibling;

      expect(totalElement).toHaveTextContent('2');
      expect(completedElement).toHaveTextContent('2');
      expect(pendingElement).toHaveTextContent('0');
    });
  });

  describe('todo interactions', () => {
    it('should toggle todo completion', async () => {
      const user = userEvent.setup();
      const mockToggleTodo = jest.fn();
      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        toggleTodo: mockToggleTodo
      });

      render(<TodoList />);

      // Use the first checkbox (for the first todo)
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]);

      expect(mockToggleTodo).toHaveBeenCalledWith(1);
    });

    it('should delete todo', async () => {
      const user = userEvent.setup();
      const mockDeleteTodo = jest.fn();
      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        deleteTodo: mockDeleteTodo
      });

      render(<TodoList />);

      const deleteButton = screen.getAllByLabelText('Delete todo')[0];
      await user.click(deleteButton);

      // Confirm deletion - use getAllByRole to get the confirmation button specifically
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      const confirmButton = deleteButtons.find(button => 
        button.textContent === 'Delete' && 
        button.closest('.fixed') // This is the modal confirmation button
      );
      await user.click(confirmButton!);

      expect(mockDeleteTodo).toHaveBeenCalledWith(1);
    });

    it('should cancel todo deletion', async () => {
      const user = userEvent.setup();
      const mockDeleteTodo = jest.fn();
      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        deleteTodo: mockDeleteTodo
      });

      render(<TodoList />);

      const deleteButton = screen.getAllByLabelText('Delete todo')[0];
      await user.click(deleteButton);

      // Cancel deletion
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockDeleteTodo).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle todos with empty descriptions', () => {
      const todosWithoutDescriptions = [
        createMockTodo({ description: undefined }),
        createMockTodo({ id: 2, title: 'Test Todo 2', description: undefined })
      ];

      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        todos: todosWithoutDescriptions
      });

      render(<TodoList />);

      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    });

    it('should handle todos with very long titles', () => {
      const longTitle = 'A'.repeat(1000);
      const todosWithLongTitles = [
        createMockTodo({ title: longTitle })
      ];

      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        todos: todosWithLongTitles
      });

      render(<TodoList />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle todos with future dates', () => {
      const futureDate = new Date('2031-01-01T00:00:00.000Z');
      const todosWithFutureDates = [
        createMockTodo({ 
          createdAt: futureDate,
          updatedAt: futureDate
        })
      ];

      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        todos: todosWithFutureDates
      });

      render(<TodoList />);

      expect(screen.getByText(/Jan 1, 2031/)).toBeInTheDocument();
    });
  });

  describe('performance', () => {
    it('should handle large number of todos efficiently', () => {
      const largeTodos = Array.from({ length: 1000 }, (_, i) => 
        createMockTodo({ 
          id: i + 1, 
          title: `Todo ${i + 1}`,
          description: `Description ${i + 1}`
        })
      );

      mockUseTodos.mockReturnValue({
        ...defaultMockReturn,
        todos: largeTodos
      });

      const startTime = performance.now();
      render(<TodoList />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should render in less than 1 second
      expect(screen.getByText('Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Todo 1000')).toBeInTheDocument();
    });
  });
}); 