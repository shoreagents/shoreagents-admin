"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className={className}>
      <button
        onClick={() => setTheme("light")}
        className={`relative p-4 rounded-lg border-2 transition-colors ${
          theme === "light" 
            ? "border-blue-500 bg-blue-50 hover:bg-blue-100" 
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
            <Sun className="w-4 h-4 text-yellow-800" />
          </div>
          <span className="text-sm font-medium">Light</span>
        </div>
        {theme === "light" && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </button>
      
      <button
        onClick={() => setTheme("dark")}
        className={`relative p-4 rounded-lg border-2 transition-colors ${
          theme === "dark" 
            ? "border-blue-500 bg-blue-50 hover:bg-blue-100" 
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <Moon className="w-4 h-4 text-gray-300" />
          </div>
          <span className="text-sm font-medium">Dark</span>
        </div>
        {theme === "dark" && (
          <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </button>
    </div>
  )
} 