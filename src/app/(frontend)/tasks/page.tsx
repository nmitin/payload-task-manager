import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card' // shadcn компоненты
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { getPayload } from 'payload'
import config from '@payload-config'
import { User } from '@/payload-types'

const formatAssignees = (assignedTo: number | User) => {
  if (!assignedTo) return 'Не назначен'

  // Если это объект с полем name
  if (typeof assignedTo === 'object' && 'name' in assignedTo) {
    return assignedTo.name
  }

  // Запасной вариант для нестандартных случаев
  if (typeof assignedTo === 'number') {
    return `Исполнитель ${assignedTo}`
  }

  return 'Неизвестный исполнитель'
}

export default async function TasksPage() {
  const payload = await getPayload({ config })
  const tasks = await payload.find({
    collection: 'tasks',
    sort: '-createdAt', // Сортировка по дате создания (новые сверху)
    limit: 50, // Ограничение на количество задач
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Список задач</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tasks.docs.length === 0 ? (
          <p className="text-muted-foreground">Задач пока нет.</p>
        ) : (
          tasks.docs.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{task.title}</CardTitle>
                <Badge
                  variant={
                    task.status === 'completed'
                      ? 'default'
                      : task.status === 'in_progress'
                        ? 'secondary'
                        : task.status === 'cancelled'
                          ? 'destructive'
                          : 'outline'
                  }
                >
                  {task.status === 'new'
                    ? 'Новая'
                    : task.status === 'in_progress'
                      ? 'В работе'
                      : task.status === 'cancelled'
                        ? 'Отменена'
                        : 'Завершена'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  {task.dueDate && <p>Срок: {format(new Date(task.dueDate), 'd MMM yyyy')}</p>}

                  <p>Назначена: {formatAssignees(task.assignedTo)}</p>

                  <p>Создана: {format(new Date(task.createdAt), 'd MMM yyyy')}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
