'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, isPast } from 'date-fns'
import Link from 'next/link'

type TaskStatus = 'all' | 'new' | 'in_progress' | 'completed' | 'cancelled'
type SortField = 'createdAt' | 'dueDate'

type Task = {
  id: string
  title: string
  status: 'new' | 'in_progress' | 'cancelled' | 'completed'
  dueDate?: string
  assignedTo?: any
  createdAt: string
  description?: any
}

interface TaskFiltersProps {
  currentStatus: TaskStatus
  onStatusChange: (status: TaskStatus) => void
  sortOrder: SortField
  onSortChange: (field: SortField) => void
}

// Компонент для фильтрации
const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentStatus,
  onStatusChange,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="space-x-2">
        <Badge
          className="cursor-pointer"
          variant={currentStatus === 'all' ? 'default' : 'outline'}
          onClick={() => onStatusChange('all')}
        >
          Все
        </Badge>
        <Badge
          className="cursor-pointer"
          variant={currentStatus === 'new' ? 'default' : 'outline'}
          onClick={() => onStatusChange('new')}
        >
          Новые
        </Badge>
        <Badge
          className="cursor-pointer"
          variant={currentStatus === 'in_progress' ? 'secondary' : 'outline'}
          onClick={() => onStatusChange('in_progress')}
        >
          В работе
        </Badge>
        <Badge
          className="cursor-pointer"
          variant={currentStatus === 'completed' ? 'success' : 'outline'}
          onClick={() => onStatusChange('completed')}
        >
          Завершенные
        </Badge>
        <Badge
          className="cursor-pointer"
          variant={currentStatus === 'cancelled' ? 'destructive' : 'outline'}
          onClick={() => onStatusChange('cancelled')}
        >
          Отмененные
        </Badge>
      </div>
      <div className="ml-auto space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSortChange('createdAt')}
          className={sortOrder === 'createdAt' ? 'bg-secondary/20' : ''}
        >
          По дате создания
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSortChange('dueDate')}
          className={sortOrder === 'dueDate' ? 'bg-secondary/20' : ''}
        >
          По сроку
        </Button>
      </div>
    </div>
  )
}

// Форматирование исполнителей
const formatAssignees = (assignedTo: any) => {
  if (!assignedTo) return 'Не назначен'

  if (typeof assignedTo === 'object' && 'name' in assignedTo) {
    return assignedTo.name
  }

  if (typeof assignedTo === 'number') {
    return `Исполнитель ${assignedTo}`
  }

  return 'Неизвестный исполнитель'
}

export default function TasksClientPage() {
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<TaskStatus>('all')
  const [sortBy, setSortBy] = useState<SortField>('createdAt')

  useEffect(() => {
    // Загрузка задач с API
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/client-tasks')
        const data = await response.json()
        setAllTasks(data.docs || [])
        setFilteredTasks(data.docs || [])
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Применение фильтров и сортировки
  useEffect(() => {
    let result = [...allTasks]

    // Фильтрация по статусу
    if (status !== 'all') {
      result = result.filter((task) => task.status === status)
    }

    // Сортировка
    result.sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'dueDate') {
        // Если дата не указана, считаем её "бесконечно далёкой"
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
        return dateA - dateB
      }
      return 0
    })

    setFilteredTasks(result)
  }, [allTasks, status, sortBy])

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus)
  }

  const handleSortChange = (newSortBy: SortField) => {
    setSortBy(newSortBy)
  }

  // Получение иконки статуса задачи
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline">Новая</Badge>
      case 'in_progress':
        return <Badge variant="secondary">В работе</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Отменена</Badge>
      case 'completed':
        return <Badge variant="success">Завершена</Badge>
      default:
        return <Badge variant="outline">Неизвестно</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Список задач</h1>
        <p>Загрузка данных...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Список задач</h1>
        <Button asChild>
          <Link href="/tasks/create">Создать задачу</Link>
        </Button>
      </div>

      <TaskFilters
        currentStatus={status}
        onStatusChange={handleStatusChange}
        sortOrder={sortBy}
        onSortChange={handleSortChange}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.length === 0 ? (
          <p className="text-muted-foreground col-span-full">Задач пока нет.</p>
        ) : (
          filteredTasks.map((task) => (
            <Link href={`/tasks/${task.id}`} key={task.id} className="block">
              <Card
                className={`hover:shadow-md transition-shadow h-full ${
                  task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed'
                    ? 'border-destructive border-2'
                    : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{task.title}</CardTitle>
                    {getStatusBadge(task.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    {task.description && (
                      <p className="line-clamp-2">
                        {typeof task.description === 'string'
                          ? task.description
                          : 'Подробное описание задачи...'}
                      </p>
                    )}

                    {task.dueDate && (
                      <p
                        className={`${
                          isPast(new Date(task.dueDate)) && task.status !== 'completed'
                            ? 'text-destructive font-medium'
                            : ''
                        }`}
                      >
                        Срок: {format(new Date(task.dueDate), 'd MMM yyyy')}
                        {isPast(new Date(task.dueDate)) &&
                          task.status !== 'completed' &&
                          ' (просрочено)'}
                      </p>
                    )}

                    <p>Назначена: {formatAssignees(task.assignedTo)}</p>
                    <p>Создана: {format(new Date(task.createdAt), 'd MMM yyyy')}</p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex gap-2 ml-auto">
                    {task.status === 'new' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // В будущем: логика изменения статуса
                        }}
                      >
                        В работу
                      </Button>
                    )}
                    {(task.status === 'new' || task.status === 'in_progress') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // В будущем: логика изменения статуса
                        }}
                      >
                        Завершить
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
