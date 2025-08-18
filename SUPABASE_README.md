# Supabase Integration Guide

This guide explains how to set up and use the Supabase integration in your React application.

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or sign in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `your-project-name`
   - Database Password: `your-secure-password`
   - Region: Choose closest to your users
6. Click "Create new project"

### 2. Get Your Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **Anon (public) key** (starts with `eyJ...`)

### 3. Set Up Environment Variables

1. Create a `.env` file in your project root
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Restart your development server

### 4. Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase-setup.sql`
3. Click "Run" to execute the script

This will create:
- `items` table with proper structure
- Row Level Security (RLS) policies
- Sample data for testing

## 🔧 Configuration

### Database Schema

The `items` table has the following structure:

```sql
CREATE TABLE items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security

RLS is enabled with the following policies:
- **SELECT**: Authenticated users can view all items
- **INSERT**: Authenticated users can create items
- **UPDATE**: Authenticated users can update any item
- **DELETE**: Authenticated users can delete any item

For more security, you can modify policies to restrict users to their own items.

## 📱 Usage

### Authentication

The app provides a complete authentication system:

```tsx
import { useAuth } from '../hooks/useAuth'

function MyComponent() {
  const { user, signIn, signUp, signOut } = useAuth()
  
  // Check if user is authenticated
  if (user) {
    return <div>Welcome, {user.email}!</div>
  }
  
  return <Auth />
}
```

### Database Operations

Use the `useDatabase` hook for CRUD operations:

```tsx
import { useDatabase } from '../hooks/useDatabase'

function DataComponent() {
  const { data, loading, insert, update, remove } = useDatabase('items')
  
  // Create new item
  const handleCreate = () => {
    insert({ name: 'New Item', description: 'Description' })
  }
  
  // Update item
  const handleUpdate = (id: string) => {
    update(id, { name: 'Updated Name' })
  }
  
  // Delete item
  const handleDelete = (id: string) => {
    remove(id)
  }
}
```

### Real-time Subscriptions

The database hook automatically subscribes to real-time changes:

```tsx
const { subscribe } = useDatabase('items')

useEffect(() => {
  const unsubscribe = subscribe((payload) => {
    console.log('Real-time update:', payload)
    // Handle real-time updates
  })
  
  return unsubscribe
}, [])
```

## 🛡️ Security Features

### Row Level Security (RLS)

- All database operations are protected by RLS policies
- Users can only access data according to defined policies
- Policies are enforced at the database level

### Authentication

- Secure session management
- Automatic token refresh
- Password reset functionality
- Email verification (if enabled in Supabase)

### Environment Variables

- Sensitive credentials are stored in environment variables
- Never commit `.env` files to version control
- Use different credentials for development/staging/production

## 🧪 Testing

### Manual Testing

1. Start your development server: `pnpm dev`
2. Navigate to `/supabase` route
3. Test authentication flow:
   - Sign up with a new email
   - Sign in with existing credentials
   - Test password reset
4. Test database operations:
   - Create new items
   - Edit existing items
   - Delete items
   - Search functionality

### Automated Testing

The hooks and components are designed to be easily testable:

```tsx
// Test authentication
import { renderHook } from '@testing-library/react'
import { useAuth } from '../hooks/useAuth'

test('useAuth provides authentication methods', () => {
  const { result } = renderHook(() => useAuth())
  
  expect(result.current.signIn).toBeDefined()
  expect(result.current.signUp).toBeDefined()
  expect(result.current.signOut).toBeDefined()
})
```

## 🚨 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check that `.env` file exists and has correct values
   - Restart development server after adding environment variables

2. **"Invalid API key"**
   - Verify your anon key is correct
   - Check that the key hasn't been rotated

3. **"Table doesn't exist"**
   - Run the SQL setup script in Supabase SQL Editor
   - Check table name in your code matches the database

4. **"Permission denied"**
   - Verify RLS policies are set up correctly
   - Check that user is authenticated
   - Review policy definitions

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
VITE_SUPABASE_DEBUG=true
```

### Network Issues

- Check your internet connection
- Verify Supabase project is not paused
- Check browser console for CORS errors

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🤝 Contributing

When adding new features:

1. Follow the existing code patterns
2. Add proper TypeScript types
3. Include error handling
4. Add loading states
5. Test thoroughly
6. Update this documentation

## 📄 License

This integration is part of the React TypeScript Boilerplate project. 