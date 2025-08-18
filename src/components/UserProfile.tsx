import { useAuth } from '../hooks/useAuth'

export function UserProfile() {
  const { user, signOut, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <p className="text-gray-900 p-2 bg-gray-50 rounded border">
            {user.email}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <p className="text-gray-900 p-2 bg-gray-50 rounded border font-mono text-sm">
            {user.id}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Created At
          </label>
          <p className="text-gray-900 p-2 bg-gray-50 rounded border">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Sign In
          </label>
          <p className="text-gray-900 p-2 bg-gray-50 rounded border">
            {user.last_sign_in_at 
              ? new Date(user.last_sign_in_at).toLocaleDateString()
              : 'Never'
            }
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
} 