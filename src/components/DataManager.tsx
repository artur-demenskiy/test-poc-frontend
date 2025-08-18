import React, { useState, useEffect } from 'react'

import { useDatabase } from '../hooks/useDatabase'
import { Item } from '../types/supabase'

// Using the Item type from Supabase types
type DataItem = Item

export function DataManager() {
  const [tableName, setTableName] = useState('items')
  const [newItem, setNewItem] = useState({ name: '', description: '' })
  const [editingItem, setEditingItem] = useState<DataItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data, loading, error, fetchData, insert, update, remove, subscribe } = useDatabase('items')

  useEffect(() => {
    fetchData()
    
    // Subscribe to real-time changes
    const unsubscribe = subscribe((payload) => {
      // eslint-disable-next-line no-console
      console.log('Real-time update:', payload)
      fetchData()
    })

    return unsubscribe
  }, [tableName, fetchData, subscribe])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.name.trim()) return
    
    await insert({
      name: newItem.name.trim(),
      description: newItem.description.trim() || null
    })
    
    setNewItem({ name: '', description: '' })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem || !editingItem.name.trim()) return
    
    await update(editingItem.id, {
      name: editingItem.name.trim(),
      description: editingItem.description?.trim() || null
    })
    
    setEditingItem(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await remove(id)
    }
  }

  const startEdit = (item: DataItem) => {
    setEditingItem({ ...item })
  }

  const cancelEdit = () => {
    setEditingItem(null)
  }

  const handleSearch = () => {
    fetchData(searchQuery)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Data Manager</h2>

      {/* Table Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Table Name
        </label>
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter table name"
        />
      </div>

      {/* Search */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search items..."
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>

      {/* Create Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Create New Item</h3>
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Item name"
            required
          />
          <input
            type="text"
            value={newItem.description}
            onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description (optional)"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Create
          </button>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error.message}
        </div>
      )}

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border-b text-left">Name</th>
              <th className="px-4 py-2 border-b text-left">Description</th>
              <th className="px-4 py-2 border-b text-left">Created</th>
              <th className="px-4 py-2 border-b text-left">Updated</th>
              <th className="px-4 py-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item: DataItem) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">
                  {editingItem?.id === item.id ? (
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="px-4 py-2 border-b">
                  {editingItem?.id === item.id ? (
                    <input
                      type="text"
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    item.description || '-'
                  )}
                </td>
                <td className="px-4 py-2 border-b text-sm text-gray-600">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b text-sm text-gray-600">
                  {new Date(item.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b">
                  {editingItem?.id === item.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={handleUpdate}
                        className="px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-2 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(item)}
                        className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(!data || data.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No data found. Create some items to get started!
        </div>
      )}
    </div>
  )
} 