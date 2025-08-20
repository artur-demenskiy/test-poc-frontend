# Supabase Integration Usage Examples

This file contains practical examples of how to use the Supabase integration in your React application.

## 🔐 Authentication Examples

### Basic Authentication Flow

```tsx
import { useAuth } from '../hooks/useAuth'

function LoginPage() {
  const { signIn, loading, error } = useAuth()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    
    const result = await signIn(
      formData.get('email') as string,
      formData.get('password') as string
    )
    
    if (result.error) {
      console.error('Login failed:', result.error.message)
    } else {
      console.log('Login successful!')
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </form>
  )
}
```

### User Registration with Validation

```tsx
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { validatePassword, isValidEmail } from '../utils/supabase-utils'

function SignUpForm() {
  const { signUp, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<string[]>([])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    
    // Validation
    if (!isValidEmail(formData.email)) {
      setErrors(['Please enter a valid email address'])
      return
    }
    
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      setErrors(passwordValidation.errors)
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setErrors(['Passwords do not match'])
      return
    }
    
    // Sign up
    const result = await signUp(formData.email, formData.password)
    if (result.error) {
      setErrors([result.error.message])
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        placeholder="Password"
        required
      />
      <input
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
        placeholder="Confirm Password"
        required
      />
      
      {errors.length > 0 && (
        <ul className="error-list">
          {errors.map((error, index) => (
            <li key={index} className="error">{error}</li>
          ))}
        </ul>
      )}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  )
}
```

### Protected Route Component

```tsx
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Dashboard } from './Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}
```

## 🗄️ Database Operations Examples

### Basic CRUD Operations

```tsx
import { useDatabase } from '../hooks/useDatabase'
import { Item } from '../types/supabase'

function ItemsManager() {
  const { 
    data: items, 
    loading, 
    error, 
    insert, 
    update, 
    remove,
    fetchData 
  } = useDatabase('items')
  
  const handleCreate = async () => {
    const newItem: Partial<Item> = {
      name: 'New Item',
      description: 'Item description'
    }
    
    const result = await insert(newItem)
    if (result.error) {
      console.error('Failed to create item:', result.error.message)
    } else {
      console.log('Item created successfully!')
    }
  }
  
  const handleUpdate = async (id: string, updates: Partial<Item>) => {
    const result = await update(id, updates)
    if (result.error) {
      console.error('Failed to update item:', result.error.message)
    } else {
      console.log('Item updated successfully!')
    }
  }
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const result = await remove(id)
      if (result.error) {
        console.error('Failed to delete item:', result.error.message)
      } else {
        console.log('Item deleted successfully!')
      }
    }
  }
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      <button onClick={handleCreate}>Create New Item</button>
      
      {items?.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <button onClick={() => handleUpdate(item.id, { name: 'Updated Name' })}>
            Update
          </button>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}
```

### Real-time Subscriptions

```tsx
import { useEffect } from 'react'
import { useDatabase } from '../hooks/useDatabase'

function RealTimeItems() {
  const { data: items, subscribe, fetchData } = useDatabase('items')
  
  useEffect(() => {
    // Subscribe to real-time changes
    const unsubscribe = subscribe((payload) => {
      console.log('Real-time update:', payload)
      
      // Handle different types of changes
      switch (payload.eventType) {
        case 'INSERT':
          console.log('New item inserted:', payload.new)
          break
        case 'UPDATE':
          console.log('Item updated:', payload.new)
          break
        case 'DELETE':
          console.log('Item deleted:', payload.old)
          break
      }
      
      // Refresh data to get the latest state
      fetchData()
    })
    
    return unsubscribe
  }, [subscribe, fetchData])
  
  return (
    <div>
      <h2>Real-time Items</h2>
      <p>This list updates in real-time!</p>
      
      {items?.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  )
}
```

### Search and Filtering

```tsx
import { useState, useCallback } from 'react'
import { useDatabase } from '../hooks/useDatabase'
import { debounce } from '../utils/supabase-utils'

function SearchableItems() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: items, loading, fetchData } = useDatabase('items')
  
  // Debounced search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchData(query)
    }, 300),
    [fetchData]
  )
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }
  
  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search items..."
        className="search-input"
      />
      
      {loading && <div>Searching...</div>}
      
      <div className="results">
        {items?.map(item => (
          <div key={item.id} className="item">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 👤 User Profile Management

### Profile Component with Update

```tsx
import { useState, useEffect } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { getUserProfile, updateUserProfile } from '../utils/supabase-utils'

function ProfileEditor() {
  const { user } = useAuthContext()
  const [profile, setProfile] = useState({
    full_name: '',
    avatar_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])
  
  const loadProfile = async () => {
    if (!user) return
    
    const { data, error } = await getUserProfile(user.id)
    if (error) {
      setMessage('Failed to load profile')
    } else if (data) {
      setProfile({
        full_name: data.full_name || '',
        avatar_url: data.avatar_url || ''
      })
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    setMessage('')
    
    const { error } = await updateUserProfile(user.id, profile)
    
    if (error) {
      setMessage('Failed to update profile')
    } else {
      setMessage('Profile updated successfully!')
    }
    
    setLoading(false)
  }
  
  if (!user) return <div>Please sign in to edit your profile</div>
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      
      <div>
        <label>Full Name:</label>
        <input
          type="text"
          value={profile.full_name}
          onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
        />
      </div>
      
      <div>
        <label>Avatar URL:</label>
        <input
          type="url"
          value={profile.avatar_url}
          onChange={(e) => setProfile(prev => ({ ...prev, avatar_url: e.target.value }))}
        />
      </div>
      
      {message && <p className={message.includes('Failed') ? 'error' : 'success'}>{message}</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  )
}
```

## 📁 File Upload Example

### File Upload Component

```tsx
import { useState } from 'react'
import { uploadFile, getFileUrl } from '../utils/supabase-utils'
import { SUPABASE_CONFIG } from '../constants/supabase'

function FileUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploading(true)
    
    try {
      for (const file of Array.from(files)) {
        // Validate file size
        if (file.size > SUPABASE_CONFIG.STORAGE.MAX_FILE_SIZE) {
          alert(`File ${file.name} is too large`)
          continue
        }
        
        // Validate file type
        if (!SUPABASE_CONFIG.STORAGE.ALLOWED_FILE_TYPES.includes(file.type)) {
          alert(`File type ${file.type} is not allowed`)
          continue
        }
        
        // Generate unique path
        const path = `uploads/${Date.now()}_${file.name}`
        
        // Upload file
        const { error } = await uploadFile('files', path, file)
        
        if (error) {
          console.error('Upload failed:', error)
          alert(`Failed to upload ${file.name}`)
        } else {
          // Get public URL
          const url = getFileUrl('files', path)
          setUploadedFiles(prev => [...prev, url])
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }
  
  return (
    <div>
      <h2>File Upload</h2>
      
      <input
        type="file"
        multiple
        onChange={handleFileUpload}
        disabled={uploading}
        accept={SUPABASE_CONFIG.STORAGE.ALLOWED_FILE_TYPES.join(',')}
      />
      
      {uploading && <p>Uploading...</p>}
      
      {uploadedFiles.length > 0 && (
        <div>
          <h3>Uploaded Files:</h3>
          <ul>
            {uploadedFiles.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  File {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

## 🔒 Role-Based Access Control

### Role-Based Component Rendering

```tsx
import { useState, useEffect } from 'react'
import { checkUserRole } from '../utils/supabase-utils'

function RoleBasedContent() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    checkUserRoles()
  }, [])
  
  const checkUserRoles = async () => {
    const isAdmin = await checkUserRole('admin')
    const isModerator = await checkUserRole('moderator')
    
    if (isAdmin) {
      setUserRole('admin')
    } else if (isModerator) {
      setUserRole('moderator')
    } else {
      setUserRole('user')
    }
    
    setLoading(false)
  }
  
  if (loading) return <div>Checking permissions...</div>
  
  return (
    <div>
      <h2>Role-Based Content</h2>
      
      {/* Content for all users */}
      <div className="public-content">
        <h3>Public Information</h3>
        <p>This content is visible to everyone.</p>
      </div>
      
      {/* Content for authenticated users */}
      {userRole && (
        <div className="user-content">
          <h3>User Dashboard</h3>
          <p>Welcome, {userRole}!</p>
        </div>
      )}
      
      {/* Content for moderators and admins */}
      {userRole === 'moderator' || userRole === 'admin' ? (
        <div className="moderator-content">
          <h3>Moderation Tools</h3>
          <p>You have access to moderation features.</p>
        </div>
      ) : null}
      
      {/* Content for admins only */}
      {userRole === 'admin' && (
        <div className="admin-content">
          <h3>Admin Panel</h3>
          <p>You have full administrative access.</p>
          <button>Delete All Data</button>
        </div>
      )}
    </div>
  )
}
```

## 🧪 Testing Examples

### Testing Hooks with React Testing Library

```tsx
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../hooks/useAuth'

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      }))
    }
  }
}))

describe('useAuth Hook', () => {
  it('should handle sign in successfully', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ data: { user: { id: '123' } }, error: null })
    
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      const response = await result.current.signIn('test@example.com', 'password')
      expect(response.error).toBeUndefined()
    })
  })
  
  it('should handle sign in failure', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ 
      data: null, 
      error: { message: 'Invalid credentials' } 
    })
    
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      const response = await result.current.signIn('test@example.com', 'wrong-password')
      expect(response.error?.message).toBe('Invalid credentials')
    })
  })
})
```

### Testing Components with Mocked Context

```tsx
import { render, screen } from '@testing-library/react'
import { AuthProvider } from '../contexts/AuthContext'
import { UserProfile } from '../components/UserProfile'

// Mock the useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}))

const mockUseAuth = vi.mocked(require('../hooks/useAuth').useAuth)

describe('UserProfile Component', () => {
  it('renders user information when authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: '123',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z'
      },
      signOut: vi.fn(),
      loading: false
    })
    
    render(
      <AuthProvider>
        <UserProfile />
      </AuthProvider>
    )
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Sign Out')).toBeInTheDocument()
  })
})
```

## 🚀 Performance Optimization

### Optimized Data Fetching

```tsx
import { useCallback, useMemo } from 'react'
import { useDatabase } from '../hooks/useDatabase'

function OptimizedItemsList() {
  const { data: items, loading, error, fetchData } = useDatabase('items')
  
  // Memoize expensive computations
  const processedItems = useMemo(() => {
    if (!items) return []
    
    return items
      .filter(item => item.name.length > 0)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(item => ({
        ...item,
        displayName: item.name.toUpperCase(),
        isRecent: new Date(item.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      }))
  }, [items])
  
  // Memoize callback functions
  const handleRefresh = useCallback(() => {
    fetchData()
  }, [fetchData])
  
  const handleSearch = useCallback((query: string) => {
    fetchData(query)
  }, [fetchData])
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
      <input 
        type="text" 
        placeholder="Search..." 
        onChange={(e) => handleSearch(e.target.value)} 
      />
      
      <div className="items-list">
        {processedItems.map(item => (
          <div key={item.id} className={`item ${item.isRecent ? 'recent' : ''}`}>
            <h3>{item.displayName}</h3>
            <p>{item.description}</p>
            <span className="date">{new Date(item.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

These examples demonstrate the full range of possibilities with the Supabase integration. You can combine and extend these patterns to build complex, real-time applications with robust authentication and data management. 