describe('API Integration Tests', () => {
  const baseUrl = Cypress.env('apiUrl') || 'http://localhost:3001/api';

  describe('Todo API Endpoints', () => {
    it('should get all todos', () => {
      cy.apiRequest('GET', '/todos').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });

    it('should create a new todo', () => {
      const newTodo = {
        title: 'API Test Todo',
        description: 'Created via API test',
      };

      cy.apiRequest('POST', '/todos', newTodo).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body.title).to.eq(newTodo.title);
        expect(response.body.description).to.eq(newTodo.description);
        expect(response.body.completed).to.eq(false);
      });
    });

    it('should update an existing todo', () => {
      // First create a todo
      const newTodo = {
        title: 'Todo to Update',
        description: 'Will be updated',
      };

      cy.apiRequest('POST', '/todos', newTodo).then((createResponse) => {
        const todoId = createResponse.body.id;
        const updateData = {
          title: 'Updated Todo',
          description: 'Successfully updated',
          completed: true,
        };

        cy.apiRequest('PATCH', `/todos/${todoId}`, updateData).then((updateResponse) => {
          expect(updateResponse.status).to.eq(200);
          expect(updateResponse.body.title).to.eq(updateData.title);
          expect(updateResponse.body.description).to.eq(updateData.description);
          expect(updateResponse.body.completed).to.eq(updateData.completed);
        });
      });
    });

    it('should delete a todo', () => {
      // First create a todo
      const newTodo = {
        title: 'Todo to Delete',
        description: 'Will be deleted',
      };

      cy.apiRequest('POST', '/todos', newTodo).then((createResponse) => {
        const todoId = createResponse.body.id;

        cy.apiRequest('DELETE', `/todos/${todoId}`).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
        });

        // Verify todo is deleted
        cy.apiRequest('GET', `/todos/${todoId}`).then((getResponse) => {
          expect(getResponse.status).to.eq(404);
        });
      });
    });

    it('should get a specific todo by ID', () => {
      // First create a todo
      const newTodo = {
        title: 'Specific Todo',
        description: 'To be retrieved by ID',
      };

      cy.apiRequest('POST', '/todos', newTodo).then((createResponse) => {
        const todoId = createResponse.body.id;

        cy.apiRequest('GET', `/todos/${todoId}`).then((getResponse) => {
          expect(getResponse.status).to.eq(200);
          expect(getResponse.body.id).to.eq(todoId);
          expect(getResponse.body.title).to.eq(newTodo.title);
          expect(getResponse.body.description).to.eq(newTodo.description);
        });
      });
    });
  });

  describe('API Error Handling', () => {
    it('should handle invalid todo creation', () => {
      const invalidTodo = {
        // Missing required title
        description: 'No title provided',
      };

      cy.apiRequest('POST', '/todos', invalidTodo).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
      });
    });

    it('should handle updating non-existent todo', () => {
      const updateData = {
        title: 'Updated Todo',
        description: 'This todo does not exist',
      };

      cy.apiRequest('PATCH', '/todos/99999', updateData).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('error');
      });
    });

    it('should handle deleting non-existent todo', () => {
      cy.apiRequest('DELETE', '/todos/99999').then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('error');
      });
    });

    it('should handle getting non-existent todo', () => {
      cy.apiRequest('GET', '/todos/99999').then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('error');
      });
    });
  });

  describe('API Performance', () => {
    it('should handle bulk todo creation', () => {
      const todos = [];
      for (let i = 0; i < 10; i++) {
        todos.push({
          title: `Bulk Todo ${i + 1}`,
          description: `Description for bulk todo ${i + 1}`,
        });
      }

      // Create todos in parallel
      const promises = todos.map(todo => 
        cy.apiRequest('POST', '/todos', todo)
      );

      cy.wrap(Promise.all(promises)).then((responses) => {
        responses.forEach(response => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
        });
      });
    });

    it('should handle large todo titles and descriptions', () => {
      const longTitle = 'A'.repeat(1000);
      const longDescription = 'B'.repeat(2000);

      const longTodo = {
        title: longTitle,
        description: longDescription,
      };

      cy.apiRequest('POST', '/todos', longTodo).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.title).to.eq(longTitle);
        expect(response.body.description).to.eq(longDescription);
      });
    });
  });

  describe('API Validation', () => {
    it('should validate todo title length', () => {
      const todoWithLongTitle = {
        title: 'A'.repeat(1001), // Exceeds max length
        description: 'Valid description',
      };

      cy.apiRequest('POST', '/todos', todoWithLongTitle).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
      });
    });

    it('should validate todo description length', () => {
      const todoWithLongDescription = {
        title: 'Valid title',
        description: 'A'.repeat(5001), // Exceeds max length
      };

      cy.apiRequest('POST', '/todos', todoWithLongDescription).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error');
      });
    });

    it('should handle special characters in todo data', () => {
      const specialTodo = {
        title: 'Todo with émojis 🎉 and symbols & < > " \'',
        description: 'Description with émojis 🚀 and symbols & < > " \'',
      };

      cy.apiRequest('POST', '/todos', specialTodo).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.title).to.eq(specialTodo.title);
        expect(response.body.description).to.eq(specialTodo.description);
      });
    });
  });

  describe('API Security', () => {
    it('should handle SQL injection attempts', () => {
      const maliciousTodo = {
        title: "'; DROP TABLE todos; --",
        description: "'; DELETE FROM todos; --",
      };

      cy.apiRequest('POST', '/todos', maliciousTodo).then((response) => {
        // Should handle gracefully without crashing
        expect(response.status).to.be.oneOf([201, 400]);
      });
    });

    it('should handle XSS attempts', () => {
      const xssTodo = {
        title: '<script>alert("XSS")</script>',
        description: '<img src="x" onerror="alert(\'XSS\')">',
      };

      cy.apiRequest('POST', '/todos', xssTodo).then((response) => {
        expect(response.status).to.be.oneOf([201, 400]);
      });
    });
  });
}); 