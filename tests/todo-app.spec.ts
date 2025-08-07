import { test, expect } from '@playwright/test';

test.describe('Todo Application - Cross Browser Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Todo Management', () => {
    test('should create a new todo', async ({ page }) => {
      const todoTitle = 'Test Todo';
      const todoDescription = 'Test Description';

      await expect(page.getByTestId('todo-form')).toBeVisible();
      await page.getByTestId('todo-title-input').fill(todoTitle);
      await page.getByTestId('todo-description-input').fill(todoDescription);
      await page.getByTestId('add-todo-button').click();

      await expect(page.getByTestId('todo-list')).toContainText(todoTitle);
      await expect(page.getByTestId('todo-list')).toContainText(todoDescription);
    });

    test('should mark todo as completed', async ({ page }) => {
      // First create a todo
      await page.getByTestId('todo-title-input').fill('Complete this todo');
      await page.getByTestId('add-todo-button').click();

      // Mark it as completed
      const todoItem = page.getByTestId('todo-item').first();
      await todoItem.getByTestId('todo-checkbox').click();

      // Verify it's marked as completed
      await expect(todoItem).toHaveClass(/completed/);
    });

    test('should delete a todo', async ({ page }) => {
      // First create a todo
      await page.getByTestId('todo-title-input').fill('Delete this todo');
      await page.getByTestId('add-todo-button').click();

      // Delete the todo
      const todoItem = page.getByTestId('todo-item').first();
      await todoItem.getByTestId('delete-todo-button').click();

      // Verify it's deleted
      await expect(page.getByTestId('todo-list')).not.toContainText('Delete this todo');
    });

    test('should edit a todo', async ({ page }) => {
      // First create a todo
      await page.getByTestId('todo-title-input').fill('Original title');
      await page.getByTestId('add-todo-button').click();

      // Edit the todo
      const todoItem = page.getByTestId('todo-item').first();
      await todoItem.getByTestId('edit-todo-button').click();
      await todoItem.getByTestId('todo-title-input').fill('Updated title');
      await todoItem.getByTestId('save-todo-button').click();

      // Verify it's updated
      await expect(page.getByTestId('todo-list')).toContainText('Updated title');
      await expect(page.getByTestId('todo-list')).not.toContainText('Original title');
    });
  });

  test.describe('Todo Filtering', () => {
    test.beforeEach(async ({ page }) => {
      // Create multiple todos with different states
      await page.getByTestId('todo-title-input').fill('Active todo 1');
      await page.getByTestId('add-todo-button').click();
      
      await page.getByTestId('todo-title-input').fill('Active todo 2');
      await page.getByTestId('add-todo-button').click();
      
      // Mark one as completed
      const firstTodo = page.getByTestId('todo-item').first();
      await firstTodo.getByTestId('todo-checkbox').click();
    });

    test('should filter by all todos', async ({ page }) => {
      await page.getByTestId('filter-all').click();
      await expect(page.getByTestId('todo-item')).toHaveCount(2);
    });

    test('should filter by active todos', async ({ page }) => {
      await page.getByTestId('filter-active').click();
      await expect(page.getByTestId('todo-item')).toHaveCount(1);
      await expect(page.getByTestId('todo-list')).toContainText('Active todo 2');
    });

    test('should filter by completed todos', async ({ page }) => {
      await page.getByTestId('filter-completed').click();
      await expect(page.getByTestId('todo-item')).toHaveCount(1);
      await expect(page.getByTestId('todo-list')).toContainText('Active todo 1');
    });
  });

  test.describe('Todo Search', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('todo-title-input').fill('React todo');
      await page.getByTestId('add-todo-button').click();
      
      await page.getByTestId('todo-title-input').fill('Vue todo');
      await page.getByTestId('add-todo-button').click();
      
      await page.getByTestId('todo-title-input').fill('Angular todo');
      await page.getByTestId('add-todo-button').click();
    });

    test('should search todos by title', async ({ page }) => {
      await page.getByTestId('search-input').fill('React');
      await expect(page.getByTestId('todo-item')).toHaveCount(1);
      await expect(page.getByTestId('todo-list')).toContainText('React todo');
    });

    test('should clear search results', async ({ page }) => {
      await page.getByTestId('search-input').fill('React');
      await expect(page.getByTestId('todo-item')).toHaveCount(1);
      
      await page.getByTestId('search-input').clear();
      await expect(page.getByTestId('todo-item')).toHaveCount(3);
    });
  });

  test.describe('Performance Tests', () => {
    test('should load the page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;
      
      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
      await expect(page.getByTestId('todo-form')).toBeVisible();
    });

    test('should handle large number of todos efficiently', async ({ page }) => {
      // Create multiple todos to test performance
      for (let i = 0; i < 10; i++) {
        await page.getByTestId('todo-title-input').fill(`Todo ${i + 1}`);
        await page.getByTestId('add-todo-button').click();
      }

      await expect(page.getByTestId('todo-item')).toHaveCount(10);
      
      // Verify that the page is still responsive
      await expect(page.getByTestId('todo-form')).toBeVisible();
      await expect(page.getByTestId('add-todo-button')).toBeEnabled();
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper heading structure', async ({ page }) => {
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('h2')).toHaveCount(2);
    });

    test('should be keyboard navigable', async ({ page }) => {
      // Test tab navigation
      await page.keyboard.press('Tab');
      await expect(page.getByTestId('todo-title-input')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByTestId('todo-description-input')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.getByTestId('add-todo-button')).toBeFocused();
    });

    test('should have proper ARIA labels', async ({ page }) => {
      await expect(page.getByTestId('todo-title-input')).toHaveAttribute('aria-label');
      await expect(page.getByTestId('todo-description-input')).toHaveAttribute('aria-label');
      await expect(page.getByTestId('add-todo-button')).toHaveAttribute('aria-label');
    });

    test('should support screen readers', async ({ page }) => {
      // Check form structure
      await expect(page.locator('form')).toBeVisible();
      
      // Check for proper labels
      await expect(page.getByTestId('todo-title-input')).toHaveAttribute('id');
      await expect(page.locator(`label[for="${await page.getByTestId('todo-title-input').getAttribute('id')}"]`)).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Intercept API calls and simulate network error
      await page.route('**/api/todos', route => route.abort());
      
      await page.getByTestId('todo-title-input').fill('Should fail');
      await page.getByTestId('add-todo-button').click();
      
      // Verify error message is displayed
      await expect(page.getByTestId('error-message')).toBeVisible();
      await expect(page.getByTestId('error-message')).toContainText('Failed to create todo');
    });

    test('should validate form inputs', async ({ page }) => {
      // Try to submit empty form
      await page.getByTestId('add-todo-button').click();
      
      // Verify validation message
      await expect(page.getByTestId('validation-error')).toBeVisible();
      await expect(page.getByTestId('validation-error')).toContainText('Title is required');
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Verify form is still accessible
      await expect(page.getByTestId('todo-form')).toBeVisible();
      await expect(page.getByTestId('todo-title-input')).toBeVisible();
      await expect(page.getByTestId('add-todo-button')).toBeVisible();
      
      // Test touch interactions
      await page.getByTestId('todo-title-input').fill('Mobile todo');
      await page.getByTestId('add-todo-button').click();
      
      await expect(page.getByTestId('todo-list')).toContainText('Mobile todo');
    });
  });

  test.describe('Data Persistence', () => {
    test('should persist todos after page reload', async ({ page }) => {
      // Add a new todo
      await page.getByTestId('todo-title-input').fill('Persistent Todo');
      await page.getByTestId('add-todo-button').click();
      
      // Reload page
      await page.reload();
      
      // Verify todo still exists
      await expect(page.getByTestId('todo-list')).toContainText('Persistent Todo');
    });

    test('should maintain filter state after page reload', async ({ page }) => {
      // Create some todos first
      await page.getByTestId('todo-title-input').fill('Todo 1');
      await page.getByTestId('add-todo-button').click();
      
      await page.getByTestId('todo-title-input').fill('Todo 2');
      await page.getByTestId('add-todo-button').click();
      
      // Set filter to active
      await page.getByTestId('filter-active').click();
      
      // Reload page
      await page.reload();
      
      // Verify filter state is maintained
      await expect(page.getByTestId('filter-active')).toHaveClass(/active/);
    });
  });
}); 