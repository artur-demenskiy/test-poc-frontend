import { useAuthContext } from '../contexts/AuthContext'
import { Auth } from '../components/Auth'
import { UserProfile } from '../components/UserProfile'
import { DataManager } from '../components/DataManager'

export function SupabaseDemo() {
  const { user } = useAuthContext()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Supabase Integration Demo
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This page demonstrates the full Supabase integration including authentication, 
            real-time database operations, and user management.
          </p>
        </div>

        {!user ? (
          <div>
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
              Please sign in to continue
            </h2>
            <Auth />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-center">
                ✅ Successfully authenticated as {user.email}
              </p>
            </div>
            
            <UserProfile />
            <DataManager />
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Features Included</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• 🔐 User authentication (sign up, sign in, sign out)</li>
            <li>• 🔒 Password reset functionality</li>
            <li>• 👤 User profile management</li>
            <li>• 🗄️ Database CRUD operations</li>
            <li>• 🔍 Real-time search and filtering</li>
            <li>• 📡 Real-time subscriptions</li>
            <li>• 🛡️ Protected routes</li>
            <li>• 📱 Responsive design with Tailwind CSS</li>
            <li>• ⚡ TypeScript for type safety</li>
          </ul>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">Setup Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
            <li>Copy your project URL and anon key</li>
            <li>Create a <code className="bg-blue-100 px-1 rounded">.env</code> file with your credentials</li>
            <li>Create a table called "items" with columns: id, name, description, created_at, updated_at</li>
            <li>Enable Row Level Security (RLS) and create appropriate policies</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 