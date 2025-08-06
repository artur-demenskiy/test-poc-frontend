import React, { useState } from 'react';
import { CreateTodoDto } from '../types/todo';

interface TodoFormProps {
  onSubmit: (todo: CreateTodoDto) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError('Title is required');
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim() || undefined,
      completed: false,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setTitleError('');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Clear error when user starts typing
    if (titleError && newTitle.trim()) {
      setTitleError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isSubmitDisabled = !title.trim();

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200" role="form">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Todo</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            onKeyPress={handleKeyPress}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              titleError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter todo title"
            aria-describedby={titleError ? 'title-error' : undefined}
          />
          {titleError && (
            <p id="title-error" className="text-red-500 text-sm mt-1">
              {titleError}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter todo description"
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isSubmitDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Add Todo
        </button>
      </div>
    </form>
  );
}; 