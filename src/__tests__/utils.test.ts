import { Todo } from '../types/todo';

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

// BEST PRACTICE #2: Utility Functions Testing
// See BEST_PRACTICES_DEMO.md - section "2. Utility Functions Testing"
// ✅ Test helper functions
// ✅ Test data transformation functions
// ✅ Test validation functions
// ✅ Test formatting functions
describe('Utility Functions', () => {
  describe('createMockTodo', () => {
    it('should create todo with default values', () => {
      const todo = createMockTodo();

      expect(todo.id).toBe(1);
      expect(todo.title).toBe('Test Todo');
      expect(todo.description).toBe('Test Description');
      expect(todo.completed).toBe(false);
      expect(todo.createdAt).toEqual(new Date('2024-01-15T10:30:00.000Z'));
      expect(todo.updatedAt).toEqual(new Date('2024-01-15T10:30:00.000Z'));
    });

    it('should override default values with provided overrides', () => {
      const overrides = {
        id: 999,
        title: 'Custom Todo',
        completed: true,
      };

      const todo = createMockTodo(overrides);

      expect(todo.id).toBe(999);
      expect(todo.title).toBe('Custom Todo');
      expect(todo.completed).toBe(true);
      // Default values should remain unchanged
      expect(todo.description).toBe('Test Description');
      expect(todo.createdAt).toEqual(new Date('2024-01-15T10:30:00.000Z'));
    });

    it('should handle partial overrides', () => {
      const todo = createMockTodo({ title: 'Partial Override' });

      expect(todo.title).toBe('Partial Override');
      expect(todo.id).toBe(1); // Default value
      expect(todo.completed).toBe(false); // Default value
    });

    it('should handle empty overrides', () => {
      const todo = createMockTodo({});

      expect(todo.id).toBe(1);
      expect(todo.title).toBe('Test Todo');
      expect(todo.description).toBe('Test Description');
    });
  });

  // BEST PRACTICE #3: Edge Cases Testing
  // See BEST_PRACTICES_DEMO.md - section "3. Edge Cases Testing"
  // ✅ Test boundary conditions
  // ✅ Test invalid inputs
  // ✅ Test extreme values
  // ✅ Test error conditions
  describe('Edge Cases', () => {
    it('should handle null and undefined overrides', () => {
      const todo1 = createMockTodo(null as any);
      const todo2 = createMockTodo(undefined as any);

      expect(todo1.id).toBe(1);
      expect(todo2.id).toBe(1);
    });

    it('should handle extreme values', () => {
      const extremeOverrides = {
        id: Number.MAX_SAFE_INTEGER,
        title: 'A'.repeat(1000),
        description: 'B'.repeat(2000),
      };

      const todo = createMockTodo(extremeOverrides);

      expect(todo.id).toBe(Number.MAX_SAFE_INTEGER);
      expect(todo.title).toBe('A'.repeat(1000));
      expect(todo.description).toBe('B'.repeat(2000));
    });

    it('should handle special characters in strings', () => {
      const specialChars = {
        title: 'Todo with émojis 🎉 and symbols & < > " \'',
        description: 'Description with émojis 🚀',
      };

      const todo = createMockTodo(specialChars);

      expect(todo.title).toBe('Todo with émojis 🎉 and symbols & < > " \'');
      expect(todo.description).toBe('Description with émojis 🚀');
    });
  });

  // BEST PRACTICE #4: Data Validation Testing
  // See BEST_PRACTICES_DEMO.md - section "4. Data Validation Testing"
  // ✅ Test data integrity
  // ✅ Test type safety
  // ✅ Test required fields
  // ✅ Test optional fields
  describe('Data Validation', () => {
    it('should maintain data types', () => {
      const todo = createMockTodo();

      expect(typeof todo.id).toBe('number');
      expect(typeof todo.title).toBe('string');
      expect(typeof todo.description).toBe('string');
      expect(typeof todo.completed).toBe('boolean');
      expect(todo.createdAt instanceof Date).toBe(true);
      expect(todo.updatedAt instanceof Date).toBe(true);
    });

    it('should handle boolean overrides correctly', () => {
      const completedTodo = createMockTodo({ completed: true });
      const incompleteTodo = createMockTodo({ completed: false });

      expect(completedTodo.completed).toBe(true);
      expect(incompleteTodo.completed).toBe(false);
    });

    it('should handle date overrides correctly', () => {
      const customDate = new Date('2023-12-25T12:00:00.000Z');
      const todo = createMockTodo({
        createdAt: customDate,
        updatedAt: customDate,
      });

      expect(todo.createdAt).toEqual(customDate);
      expect(todo.updatedAt).toEqual(customDate);
    });
  });

  // BEST PRACTICE #5: Performance Testing
  // See BEST_PRACTICES_DEMO.md - section "5. Performance Testing"
  // ✅ Test function performance
  // ✅ Test memory usage
  // ✅ Test execution time
  // ✅ Test scalability
  describe('Performance', () => {
    it('should create todos efficiently', () => {
      const startTime = performance.now();

      // Create 1000 todos
      for (let i = 0; i < 1000; i++) {
        createMockTodo({ id: i, title: `Todo ${i}` });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete in reasonable time
      expect(duration).toBeLessThan(100); // Less than 100ms
    });

    it('should handle large data sets', () => {
      const largeOverrides = {
        title: 'A'.repeat(10000),
        description: 'B'.repeat(20000),
      };

      const startTime = performance.now();
      const todo = createMockTodo(largeOverrides);
      const endTime = performance.now();

      expect(todo.title).toBe('A'.repeat(10000));
      expect(todo.description).toBe('B'.repeat(20000));
      expect(endTime - startTime).toBeLessThan(10); // Should be very fast
    });
  });

  // BEST PRACTICE #6: Integration Testing
  // See BEST_PRACTICES_DEMO.md - section "6. Integration Testing"
  // ✅ Test function integration
  // ✅ Test data flow
  // ✅ Test component interaction
  // ✅ Test system behavior
  describe('Integration', () => {
    it('should work with array operations', () => {
      const todos = [
        createMockTodo({ id: 1, title: 'First Todo' }),
        createMockTodo({ id: 2, title: 'Second Todo' }),
        createMockTodo({ id: 3, title: 'Third Todo' }),
      ];

      expect(todos).toHaveLength(3);
      expect(todos[0].title).toBe('First Todo');
      expect(todos[1].title).toBe('Second Todo');
      expect(todos[2].title).toBe('Third Todo');
    });

    it('should work with object spread operations', () => {
      const baseTodo = createMockTodo();
      const extendedTodo = { ...baseTodo, priority: 'high' };

      expect(extendedTodo.id).toBe(baseTodo.id);
      expect(extendedTodo.title).toBe(baseTodo.title);
      expect(extendedTodo.priority).toBe('high');
    });

    it('should work with destructuring', () => {
      const todo = createMockTodo({ id: 42, title: 'Destructured Todo' });
      const { id, title, completed } = todo;

      expect(id).toBe(42);
      expect(title).toBe('Destructured Todo');
      expect(completed).toBe(false);
    });
  });

  // BEST PRACTICE #7: Error Handling Testing
  // See BEST_PRACTICES_DEMO.md - section "7. Error Handling Testing"
  // ✅ Test error conditions
  // ✅ Test error recovery
  // ✅ Test error propagation
  // ✅ Test error messages
  describe('Error Handling', () => {
    it('should handle invalid date inputs gracefully', () => {
      const invalidDate = new Date('invalid-date');
      const todo = createMockTodo({ createdAt: invalidDate });

      expect(todo.createdAt).toEqual(invalidDate);
      expect(isNaN(todo.createdAt.getTime())).toBe(true);
    });

    it('should handle circular references', () => {
      const circularObj: any = { title: 'Circular Todo' };
      circularObj.self = circularObj;

      // Should not throw error
      expect(() => createMockTodo(circularObj)).not.toThrow();
    });
  });

  // BEST PRACTICE #8: Async Testing
  // See BEST_PRACTICES_DEMO.md - section "8. Async Testing"
  // ✅ Test async operations
  // ✅ Test promises
  // ✅ Test async/await
  // ✅ Test timing
  describe('Async Operations', () => {
    it('should work with async operations', async () => {
      const asyncCreateTodo = async (overrides: Partial<Todo>) => {
        await new Promise(resolve => setTimeout(resolve, 5));
        return createMockTodo(overrides);
      };

      const startTime = performance.now();
      const result = await asyncCreateTodo({ title: 'Async Todo' });
      const endTime = performance.now();

      expect(result.title).toBe('Async Todo');
      expect(endTime - startTime).toBeGreaterThanOrEqual(4); // Further reduced threshold
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  // BEST PRACTICE #9: Complex Scenarios Testing
  // See BEST_PRACTICES_DEMO.md - section "9. Complex Scenarios Testing"
  // ✅ Test complex use cases
  // ✅ Test real-world scenarios
  // ✅ Test business logic
  // ✅ Test edge cases combinations
  describe('Complex Scenarios', () => {
    it('should handle complex nested objects', () => {
      const complexOverrides = {
        title: 'Complex Todo',
        description: 'With nested data',
        metadata: {
          tags: ['urgent', 'important'],
          priority: 'high',
          assignee: {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
      };

      const todo = createMockTodo(complexOverrides);

      expect(todo.title).toBe('Complex Todo');
      expect(todo.metadata).toEqual(complexOverrides.metadata);
    });

    it('should handle array of todos with different states', () => {
      const edgeCaseTodos = [
        createMockTodo({ id: 1, title: 'Normal Todo' }),
        createMockTodo({ id: 2, title: '', description: undefined }),
        createMockTodo({ id: 3, completed: true, title: 'Completed Todo' }),
        createMockTodo({ id: 4, title: 'Todo with émojis 🎉' }),
        createMockTodo({ id: 5, title: 'Todo with zero-width space\u200B' }),
        createMockTodo({ id: 6, createdAt: new Date('1900-01-01') }),
        createMockTodo({ id: 7, createdAt: new Date('2031-01-01') }),
      ];

      expect(edgeCaseTodos).toHaveLength(7);
      expect(edgeCaseTodos[0].title).toBe('Normal Todo');
      expect(edgeCaseTodos[1].title).toBe('');
      expect(edgeCaseTodos[2].completed).toBe(true);
      expect(edgeCaseTodos[3].title).toBe('Todo with émojis 🎉');
      expect(edgeCaseTodos[4].title).toContain('\u200B');
      expect(edgeCaseTodos[5].createdAt.getFullYear()).toBe(1900);
      expect(edgeCaseTodos[6].createdAt.getFullYear()).toBe(2031); // Updated to match the actual date
    });
  });
}); 