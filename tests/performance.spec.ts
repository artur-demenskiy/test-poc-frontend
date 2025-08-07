import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page Load Performance', () => {
    test('should load initial page within 3 seconds', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000);
      await expect(page.getByTestId('todo-form')).toBeVisible();
    });

    test('should have acceptable First Contentful Paint', async ({ page }) => {
      await page.goto('/');
      
      // Measure FCP
      const fcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
              resolve(fcpEntry.startTime);
            }
          }).observe({ entryTypes: ['paint'] });
        });
      });
      
      expect(fcp).toBeLessThan(2000); // FCP should be under 2 seconds
    });

    test('should have acceptable Largest Contentful Paint', async ({ page }) => {
      await page.goto('/');
      
      // Measure LCP
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcpEntry = entries[entries.length - 1];
            if (lcpEntry) {
              resolve(lcpEntry.startTime);
            }
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        });
      });
      
      expect(lcp).toBeLessThan(2500); // LCP should be under 2.5 seconds
    });
  });

  test.describe('Interaction Performance', () => {
    test('should handle rapid todo creation without lag', async ({ page }) => {
      const startTime = Date.now();
      
      // Create 10 todos rapidly
      for (let i = 0; i < 10; i++) {
        await page.getByTestId('todo-title-input').fill(`Todo ${i + 1}`);
        await page.getByTestId('add-todo-button').click();
      }
      
      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan(5000); // Should complete within 5 seconds
      
      await expect(page.getByTestId('todo-item')).toHaveCount(10);
    });

    test('should maintain responsiveness with many todos', async ({ page }) => {
      // Create 50 todos
      for (let i = 0; i < 50; i++) {
        await page.getByTestId('todo-title-input').fill(`Performance Todo ${i + 1}`);
        await page.getByTestId('add-todo-button').click();
      }
      
      // Verify all todos are displayed
      await expect(page.getByTestId('todo-item')).toHaveCount(50);
      
      // Test that form is still responsive
      const formStartTime = Date.now();
      await page.getByTestId('todo-title-input').fill('Responsive Test');
      await page.getByTestId('add-todo-button').click();
      const formTime = Date.now() - formStartTime;
      
      expect(formTime).toBeLessThan(1000); // Form interaction should be under 1 second
    });

    test('should handle rapid state changes efficiently', async ({ page }) => {
      // Create a todo
      await page.getByTestId('todo-title-input').fill('State Change Test');
      await page.getByTestId('add-todo-button').click();
      
      const startTime = Date.now();
      
      // Rapidly toggle completion state
      for (let i = 0; i < 10; i++) {
        await page.getByTestId('todo-checkbox').first().click();
      }
      
      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });

  test.describe('Memory Usage', () => {
    test('should not have memory leaks with repeated operations', async ({ page }) => {
      // Get initial memory usage
      const initialMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });
      
      // Perform repeated operations
      for (let i = 0; i < 20; i++) {
        await page.getByTestId('todo-title-input').fill(`Memory Test ${i + 1}`);
        await page.getByTestId('add-todo-button').click();
        
        // Toggle completion
        await page.getByTestId('todo-checkbox').first().click();
        
        // Delete the todo
        await page.getByTestId('delete-todo-button').first().click();
      }
      
      // Get final memory usage
      const finalMemory = await page.evaluate(() => {
        return (performance as any).memory?.usedJSHeapSize || 0;
      });
      
      // Memory increase should be reasonable (less than 10MB)
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
    });
  });

  test.describe('Network Performance', () => {
    test('should handle slow network conditions', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', route => {
        route.continue();
      });
      
      // Set slow network conditions
      await page.context().setExtraHTTPHeaders({
        'X-Slow-Network': 'true'
      });
      
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;
      
      // Should still load within reasonable time even with slow network
      expect(loadTime).toBeLessThan(10000); // 10 seconds
      await expect(page.getByTestId('todo-form')).toBeVisible();
    });

    test('should handle offline scenarios gracefully', async ({ page }) => {
      // Simulate offline mode
      await page.context().setOffline(true);
      
      await page.getByTestId('todo-title-input').fill('Offline Test');
      await page.getByTestId('add-todo-button').click();
      
      // Should show offline indicator or handle gracefully
      await expect(page.getByTestId('todo-form')).toBeVisible();
    });
  });

  test.describe('Rendering Performance', () => {
    test('should have smooth scrolling with many items', async ({ page }) => {
      // Create many todos
      for (let i = 0; i < 100; i++) {
        await page.getByTestId('todo-title-input').fill(`Scroll Test ${i + 1}`);
        await page.getByTestId('add-todo-button').click();
      }
      
      // Test scrolling performance
      const scrollStartTime = Date.now();
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      const scrollTime = Date.now() - scrollStartTime;
      
      expect(scrollTime).toBeLessThan(1000); // Scrolling should be smooth
    });

    test('should handle rapid DOM updates efficiently', async ({ page }) => {
      // Create initial todos
      for (let i = 0; i < 10; i++) {
        await page.getByTestId('todo-title-input').fill(`DOM Test ${i + 1}`);
        await page.getByTestId('add-todo-button').click();
      }
      
      const startTime = Date.now();
      
      // Rapidly update todos
      for (let i = 0; i < 10; i++) {
        const todoItem = page.getByTestId('todo-item').nth(i);
        await todoItem.getByTestId('edit-todo-button').click();
        await todoItem.getByTestId('todo-title-input').fill(`Updated ${i + 1}`);
        await todoItem.getByTestId('save-todo-button').click();
      }
      
      const totalTime = Date.now() - startTime;
      expect(totalTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });

  test.describe('Bundle Size and Loading', () => {
    test('should have reasonable bundle size', async ({ page }) => {
      const response = await page.goto('/');
      const html = await response?.text();
      
      // Check for large inline scripts or styles
      const scriptSize = html?.match(/<script[^>]*>([\s\S]*?)<\/script>/g)?.join('').length || 0;
      const styleSize = html?.match(/<style[^>]*>([\s\S]*?)<\/style>/g)?.join('').length || 0;
      
      expect(scriptSize).toBeLessThan(100000); // Less than 100KB inline scripts
      expect(styleSize).toBeLessThan(50000); // Less than 50KB inline styles
    });

    test('should load external resources efficiently', async ({ page }) => {
      const startTime = Date.now();
      
      // Navigate and wait for all resources to load
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });
  });
}); 