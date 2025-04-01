// components/Navigation.tsx
import React from 'react'
import Link from 'next/link'
import { UserNavigation } from './UserNavigation'

export function Navigation() {
  return (
    <nav className="border-b py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold">
            Менеджер задач
          </Link>
          <div className="flex space-x-4">
            <Link href="/tasks" className="hover:text-primary transition-colors">
              Задачи
            </Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">
              Управление
            </Link>
          </div>
        </div>

        {/* Клиентский компонент для аутентификации и смены темы */}
        <UserNavigation />
      </div>
    </nav>
  )
}
