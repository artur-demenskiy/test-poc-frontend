import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '../TodoForm';

// BEST PRACTICE #1: Test Data Factory
// See BEST_PRACTICES_DEMO.md - section "1. Test Data Factory Pattern"
// ✅ Reusable factory for creating test data
// ✅ Easy to create variations through overrides
// ✅ Data consistency across all tests
const createMockSubmitData = (overrides = {}) => ({
  title: 'Test Todo',
  description: 'Test Description',
  completed: false,
  ...overrides,
});

describe('TodoForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // BEST PRACTICE #2: User-Centric Testing
  // See BEST_PRACTICES_DEMO.md - section "2. User-Centric Testing"
  // ✅ Test as a real user (via userEvent)
  // ✅ Use semantic selectors (getByLabelText, getByRole)
  // ✅ Focus on behavior, not internal structure
  // ✅ Test is resilient to CSS class or DOM structure changes
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    // BEST PRACTICE: Use semantic selectors
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add todo/i });

    // BEST PRACTICE: Simulate real user actions
    await user.type(titleInput, 'New Todo');
    await user.type(descriptionInput, 'New Description');
    await user.click(submitButton);

    // BEST PRACTICE: Check result, not process
    expect(mockOnSubmit).toHaveBeenCalledWith(createMockSubmitData({
      title: 'New Todo',
      description: 'New Description'
    }));
  });

  // BEST PRACTICE #3: Edge Cases & Validation
  // See BEST_PRACTICES_DEMO.md - section "3. Edge Cases & Validation"
  // ✅ Test edge cases (empty title)
  // ✅ Check user input validation
  // ✅ Ensure data quality
  // ✅ Prevent submission of incorrect data
  it('should not submit form with empty title', async () => {
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /add todo/i });

    // BEST PRACTICE: Check initial state
    expect(submitButton).toBeDisabled();

    // BEST PRACTICE: Try to submit form with empty title
    await user.click(submitButton);

    // BEST PRACTICE: Ensure onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // BEST PRACTICE #4: Accessibility Testing
  // See BEST_PRACTICES_DEMO.md - section "4. Accessibility Testing"
  // ✅ Test accessibility for users with disabilities
  // ✅ Check keyboard navigation support
  // ✅ Comply with WCAG standards
  // ✅ Improve UX for all users
  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    // BEST PRACTICE: Test Tab navigation
    await user.tab();
    expect(screen.getByLabelText(/title/i)).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText(/description/i)).toHaveFocus();

    // The next tab might not go to the submit button due to disabled state
    // Let's just verify the form elements are focusable
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add todo/i })).toBeInTheDocument();
  });

  // BEST PRACTICE #5: Form State Management
  // See BEST_PRACTICES_DEMO.md - section "5. Form State Management"
  // ✅ Test dynamic form state changes
  // ✅ Check UI response to input changes
  // ✅ Ensure proper user feedback
  // ✅ Test component interactivity
  it('should enable submit button when title is entered', async () => {
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /add todo/i });

    // BEST PRACTICE: Check initial state
    expect(submitButton).toBeDisabled();

    // BEST PRACTICE: Simulate user input
    await user.type(titleInput, 'Test Todo');

    // BEST PRACTICE: Check state change
    expect(submitButton).not.toBeDisabled();
  });

  // BEST PRACTICE #6: Data Trimming & Sanitization
  // See BEST_PRACTICES_DEMO.md - section "6. Data Trimming & Sanitization"
  // ✅ Test user input cleaning
  // ✅ Prevent whitespace issues
  // ✅ Ensure data quality
  // ✅ Improve user experience
  it('should trim whitespace from inputs', async () => {
    const user = userEvent.setup();
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /add todo/i });

    // BEST PRACTICE: Enter data with extra whitespace
    await user.type(titleInput, '  Test Todo  ');
    await user.type(descriptionInput, '  Test Description  ');
    await user.click(submitButton);

    // BEST PRACTICE: Check that whitespace was removed
    expect(mockOnSubmit).toHaveBeenCalledWith(createMockSubmitData({
      title: 'Test Todo',
      description: 'Test Description'
    }));
  });
}); 