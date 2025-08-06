import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/todo';

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

describe('TodoItem', () => {
  const defaultProps = {
    todo: createMockTodo(),
    onToggle: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // BEST PRACTICE #2: Component Rendering Testing
  // See BEST_PRACTICES_DEMO.md - section "7. Visual State Testing"
  // ✅ Test that UI matches business logic
  // ✅ Test CSS classes and styles
  it('should render completed todo with strikethrough', () => {
    const completedTodo = createMockTodo({ completed: true });
    render(<TodoItem {...defaultProps} todo={completedTodo} />);

    // BEST PRACTICE: Check visual state
    const titleElement = screen.getByText('Test Todo');
    expect(titleElement).toHaveClass('line-through');
    
    // BEST PRACTICE: Check checkbox state
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  // BEST PRACTICE #3: User Interaction Testing
  // See BEST_PRACTICES_DEMO.md - section "8. User Interaction Testing"
  // ✅ Test real user actions
  // ✅ Check callback function calls
  // ✅ Ensure events are passed correctly
  // ✅ Test component interactivity
  it('should call onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem {...defaultProps} />);

    // BEST PRACTICE: Simulate user click
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    // BEST PRACTICE: Check that callback was called with correct parameters
    expect(defaultProps.onToggle).toHaveBeenCalledWith(1);
  });

  // BEST PRACTICE #4: Modal/Dialog Testing
  // See BEST_PRACTICES_DEMO.md - section "9. Modal/Dialog Testing"
  // ✅ Test complex UI interactions
  // ✅ Check modal appearance
  // ✅ Test action confirmation
  // ✅ Ensure operation safety
  it('should show confirmation dialog when delete is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoItem {...defaultProps} />);

    // BEST PRACTICE: Start deletion process
    const deleteButton = screen.getByLabelText('Delete todo');
    await user.click(deleteButton);

    // BEST PRACTICE: Check confirmation dialog appearance
    expect(screen.getByText('Are you sure you want to delete this todo?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  // BEST PRACTICE #5: Form Editing Testing
  // See BEST_PRACTICES_DEMO.md - section "10. Form Editing Testing"
  // ✅ Test transition to edit mode
  // ✅ Check form validation
  // ✅ Test saving changes
  // ✅ Ensure data quality
  it('should validate form when editing', async () => {
    const user = userEvent.setup();
    render(<TodoItem {...defaultProps} />);

    // BEST PRACTICE: Switch to edit mode
    const editButton = screen.getByLabelText('Edit todo');
    await user.click(editButton);

    // BEST PRACTICE: Check that form appeared
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();

    // BEST PRACTICE: Clear required field
    const titleInput = screen.getByDisplayValue('Test Todo');
    await user.clear(titleInput);

    // BEST PRACTICE: Try to save
    const saveButton = screen.getByText('Save');
    await user.click(saveButton);

    // BEST PRACTICE: Check that validation worked
    expect(defaultProps.onUpdate).not.toHaveBeenCalled();
    expect(screen.getByText('Title is required')).toBeInTheDocument();
  });

  // BEST PRACTICE #6: Accessibility Testing
  // See BEST_PRACTICES_DEMO.md - section "11. Accessibility Testing"
  // ✅ Test accessibility for screen readers
  // ✅ Check ARIA attributes
  // ✅ Ensure WCAG standards compliance
  // ✅ Improve experience for users with disabilities
  it('should have proper ARIA labels for accessibility', () => {
    render(<TodoItem {...defaultProps} />);

    // BEST PRACTICE: Check ARIA labels for buttons
    expect(screen.getByLabelText('Edit todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete todo')).toBeInTheDocument();

    // BEST PRACTICE: Check ARIA label for checkbox
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'Mark "Test Todo" as complete');
  });
}); 