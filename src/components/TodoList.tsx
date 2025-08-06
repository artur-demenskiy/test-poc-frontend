import React, { useState, useEffect, useMemo } from 'react';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { useTodos } from '../hooks/useTodos';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../types/todo';

type FilterType = 'all' | 'active' | 'completed';

export const TodoList: React.FC = () => {
  const {
    todos,
    loading,
    error,
    loadTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearError,
  } = useTodos();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const filteredAndSearchedTodos = useMemo(() => {
    let filtered = todos;

    // Apply status filter
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(term) ||
        (todo.description && todo.description.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [todos, filter, searchTerm]);

  const statistics = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;

    return { total, completed, pending };
  }, [todos]);

  const handleAddTodo = async (createDto: CreateTodoDto) => {
    try {
      await addTodo(createDto);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleUpdateTodo = async (id: number, updateDto: UpdateTodoDto) => {
    try {
      await updateTodo(id, updateDto);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      await toggleTodo(id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleTryAgain = () => {
    clearError();
    loadTodos();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleTryAgain}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo App</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form and Statistics */}
          <div className="lg:col-span-1 space-y-6">
            <TodoForm onSubmit={handleAddTodo} />

            {/* Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">{statistics.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold text-green-600">{statistics.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-semibold text-orange-600">{statistics.pending}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Todo List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              {/* Filters and Search */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  {/* Filter Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filter === 'all'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilter('active')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filter === 'active'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => setFilter('completed')}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        filter === 'completed'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Completed
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search todos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <svg
                      className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Todo List */}
              <div className="p-6">
                {filteredAndSearchedTodos.length === 0 ? (
                  <div className="text-center py-12">
                    {todos.length === 0 ? (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
                        <p className="text-gray-600">Add your first todo to get started!</p>
                      </>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No todos found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAndSearchedTodos.map((todo) => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onUpdate={handleUpdateTodo}
                        onDelete={handleDeleteTodo}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 