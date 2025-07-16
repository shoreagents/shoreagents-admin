'use client'

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Search, User, X } from "lucide-react"

export interface User {
  id: number
  email: string
  user_type: string
  created_at?: string
}

interface UserSearchProps {
  selectedUser: User | null
  onUserSelect: (user: User | null) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  autoFocus?: boolean
}

export function UserSearch({
  selectedUser,
  onUserSelect,
  placeholder = "Search users...",
  label = "User",
  disabled = false,
  autoFocus = false
}: UserSearchProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [users, setUsers] = React.useState<User[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Debounced search
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>()

  // Search users from API
  const searchUsers = React.useCallback(async (search: string) => {
    if (!search.trim()) {
      setUsers([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users?search=${encodeURIComponent(search)}&limit=10`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.users)
      } else {
        setError(data.error || 'Failed to fetch users')
        setUsers([])
      }
    } catch (error) {
      setError('Network error occurred')
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle search input change with debouncing
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setIsOpen(true)

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(value)
    }, 300)
  }

  // Handle user selection
  const handleUserSelect = (user: User) => {
    onUserSelect(user)
    setSearchTerm(user.email || '')
    setIsOpen(false)
    setUsers([])
  }

  // Handle clearing selection
  const handleClear = () => {
    onUserSelect(null)
    setSearchTerm('')
    setUsers([])
    setIsOpen(false)
  }

  // Update search term when selected user changes
  React.useEffect(() => {
    if (selectedUser) {
      setSearchTerm(selectedUser.email || '')
    } else {
      setSearchTerm('')
    }
  }, [selectedUser])

  // Close dropdown when clicking outside
  const containerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="grid gap-2">
        <Label htmlFor="user-search">{label}</Label>
        <div className="relative">
          <div className="relative">
            <Input
              id="user-search"
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setIsOpen(true)}
              disabled={disabled}
              autoFocus={autoFocus}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {selectedUser && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (searchTerm || users.length > 0) && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white border shadow-lg">
          {isLoading && (
            <div className="p-3 text-center text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                Searching...
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 text-center text-red-500 text-sm">
              {error}
            </div>
          )}

          {!isLoading && !error && users.length === 0 && searchTerm && (
            <div className="p-3 text-center text-gray-500 text-sm">
              No users found for &quot;{searchTerm}&quot;
            </div>
          )}

          {!isLoading && users.length > 0 && (
            <div className="py-1">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {user.email}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {user.user_type}
                      </div>
                      <div className="text-xs text-gray-400">
                        ID: {user.id}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Selected user info */}
      {selectedUser && (
        <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
          <div className="text-sm">
            <div className="font-medium text-blue-900">
              Selected: {selectedUser.email}
            </div>
            <div className="text-blue-700">{selectedUser.user_type}</div>
            <div className="text-blue-600">ID: {selectedUser.id}</div>
          </div>
        </div>
      )}
    </div>
  )
} 