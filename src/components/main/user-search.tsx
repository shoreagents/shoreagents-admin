'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export interface User {
  id: number
  email: string
  user_type: string
  created_at?: string
  first_name?: string
  last_name?: string
  nickname?: string
  gender?: string
  member_id?: number
  company?: string
  badge_color?: string
  employee_id?: string
}

interface UserSearchProps {
  selectedUser: User | null
  onUserSelect: (user: User | null) => void
  placeholder?: string
  label?: string
  autoFocus?: boolean
  disabled?: boolean
}

export function UserSearch({
  selectedUser,
  onUserSelect,
  placeholder = "Search users...",
  label = "User",
  autoFocus = false,
  disabled = false,
}: UserSearchProps) {
  const [users, setUsers] = React.useState<User[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  // Search users from API
  const searchUsers = React.useCallback(async (search: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Only search if there's a search term
      if (!search.trim()) {
        setUsers([])
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/users?search=${encodeURIComponent(search)}&limit=4&fields=minimal`)
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

  // Handle search with debouncing
  const debouncedSearch = React.useCallback(
    debounce((search: string) => {
      searchUsers(search)
    }, 300),
    [searchUsers]
  )

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    debouncedSearch(value)
  }

  // Handle user selection
  const handleUserSelect = (user: User) => {
    onUserSelect(user)
    setOpen(false)
    setSearchValue("")
    setUsers([])
    setError(null)
  }

  // Handle clear selection
  const handleClear = () => {
    onUserSelect(null)
  }

  // Handle dropdown close
  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setSearchValue("")
      setUsers([])
      setError(null)
    }
  }

  // Get display name for a user
  const getDisplayName = (user: User): string => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    if (user.first_name) {
      return user.first_name
    }
    if (user.nickname) {
      return user.nickname
    }
    return user.email
  }

  return (
    <div className="grid gap-2">
      <label htmlFor="user-search" className="text-sm font-medium leading-none">
        {label}
      </label>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className="w-full justify-between text-left font-normal"
          >
            <span className={selectedUser ? "text-foreground" : "text-muted-foreground"}>
              {selectedUser ? getDisplayName(selectedUser) : placeholder}
            </span>
            <div className="flex items-center gap-2">
              {selectedUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                  className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" side="right" align="start">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchValue}
                onChange={(e) => handleInputChange(e)}
                className="pl-8"
                autoFocus
              />
            </div>
          </div>
          
          {/* Results without scrolling */}
          <div>
            {isLoading && (
              <div className="p-3 text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin"></div>
                  Searching...
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 text-center text-sm text-destructive">
                {error}
              </div>
            )}

            {!isLoading && !error && users.length === 0 && searchValue.trim() && (
              <div className="p-3 text-center text-sm text-muted-foreground">
                No users found.
              </div>
            )}

            {!isLoading && users.length > 0 && (
              <div className="p-1">
                {users.map((user) => (
                  <Button
                    key={user.id}
                    variant="ghost"
                    onClick={() => handleUserSelect(user)}
                    className="w-full h-auto p-2 text-left justify-start flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm">
                      👤
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-1">
                        {/* First row: Name and Employee ID */}
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {getDisplayName(user)}
                          </span>
                          {user.employee_id && (
                            <span className="px-2 py-1 text-xs font-mono rounded border bg-muted/50 text-muted-foreground">
                              ID: {user.employee_id}
                            </span>
                          )}
                        </div>
                        {/* Second row: Company/User Type Badge */}
                        <div className="flex items-center">
                          {user.user_type === 'Agent' && user.company && user.badge_color ? (
                            <span 
                              className="px-2 py-1 text-xs font-medium rounded-full text-white shadow-sm"
                              style={{ backgroundColor: user.badge_color }}
                            >
                              {user.company}
                            </span>
                          ) : (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                              user.user_type === 'Agent' ? 'badge-agent' :
                              user.user_type === 'Internal' ? 'badge-internal' :
                              user.user_type === 'Client' ? 'badge-client' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {user.user_type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedUser?.id === user.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
} 