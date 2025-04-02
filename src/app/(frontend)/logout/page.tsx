'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()

  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState('')

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setError('')

    try {
      // Используем функцию logout из контекста аутентификации
      const result = await logout()

      if (result.success) {
        // Успешный выход, перенаправление на главную страницу
        router.push('/')
      } else {
        setError(result.error || 'Произошла ошибка при выходе')
      }
    } catch (err) {
      setError('Произошла ошибка при выходе. Пожалуйста, попробуйте снова.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Выход из системы</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Вы уверены, что хотите выйти из системы?</p>

          {error && (
            <div className="p-3 mb-4 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <Button onClick={handleLogout} disabled={isLoggingOut} variant="destructive">
              {isLoggingOut ? 'Выполняется выход...' : 'Выйти'}
            </Button>
            <Button onClick={handleCancel} variant="outline">
              Отмена
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-muted-foreground">
            Вы всегда можете войти снова
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
