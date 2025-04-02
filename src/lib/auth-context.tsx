'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@/payload-types'

// Создаем интерфейс контекста
interface AuthContextType {
  user: User | null
  loading: boolean
  refresh: () => Promise<void>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<{ success: boolean; error?: string }>
}

// Создаем контекст с начальными значениями
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refresh: async () => {},
  login: async () => ({ success: false }),
  logout: async () => ({ success: false }),
})

// Хук для использования контекста аутентификации
export const useAuth = () => useContext(AuthContext)

// Провайдер контекста аутентификации
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Функция для получения текущего пользователя
  const refresh = async () => {
    try {
      const response = await fetch('/api/users/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Функция для входа пользователя
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        await refresh() // Обновить состояние пользователя
        return { success: true }
      } else {
        return {
          success: false,
          error: data.errors?.[0]?.message || 'Неверный email или пароль',
        }
      }
    } catch (err) {
      return {
        success: false,
        error: 'Произошла ошибка при входе. Пожалуйста, попробуйте снова.',
      }
    }
  }

  // Функция для выхода пользователя
  const logout = async () => {
    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setUser(null) // Очистить состояние пользователя
        return { success: true }
      } else {
        return {
          success: false,
          error: 'Произошла ошибка при выходе',
        }
      }
    } catch (err) {
      return {
        success: false,
        error: 'Произошла ошибка при выходе. Пожалуйста, попробуйте снова.',
      }
    }
  }

  // Получить текущего пользователя при первой загрузке компонента
  useEffect(() => {
    refresh()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refresh, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
