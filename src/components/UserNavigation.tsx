'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { User } from '@/payload-types'

// type User = {
//   id: string
//   email: string
//   [key: string]: any
// }

export function UserNavigation() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        // Получаем текущего пользователя через существующий API
        const response = await fetch('/api/users/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Ошибка при получении пользователя:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

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
          <Link href="/api/logout">
            <Button variant="ghost" size="sm">
              Выйти
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Войти
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Регистрация</Button>
          </Link>
        </div>
      )}
      <ThemeToggle />
    </div>
  )
}
