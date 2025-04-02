'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/lib/auth-context'

export function UserNavigation() {
  const { user, loading } = useAuth()

  return (
    <div className="flex items-center space-x-4">
      {loading ? (
        <div className="h-9 w-9 rounded-md bg-secondary/20 animate-pulse" />
      ) : user ? (
        <div className="flex items-center space-x-3">
          <Link href="/profile">
            <Button variant="outline" size="sm">
              {user.name}
            </Button>
          </Link>
          <Link href="/logout">
            <Button variant="ghost" size="sm">
              Выйти
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Link href="/login?redirect=/tasks">
            <Button variant="outline" size="sm">
              Войти
            </Button>
          </Link>
          {/* <Link href="/register">
            <Button size="sm">Регистрация</Button>
          </Link> */}
        </div>
      )}
      <ThemeToggle />
    </div>
  )
}
