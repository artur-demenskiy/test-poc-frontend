import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the useTodos hook
jest.mock('./hooks/useTodos');
import { useTodos } from './hooks/useTodos';

const mockUseTodos = useTodos as jest.MockedFunction<typeof useTodos>;

test('renders todo app', () => {
  // Mock the hook to return loading state
  mockUseTodos.mockReturnValue({
    todos: [],
    loading: false,
    error: null,
    loadTodos: jest.fn(),
    addTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
    toggleTodo: jest.fn(),
    clearError: jest.fn(),
  });

  render(<App />);
  const headingElement = screen.getByText(/todo app/i);
  expect(headingElement).toBeInTheDocument();
});
