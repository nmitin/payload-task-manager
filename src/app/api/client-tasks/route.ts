import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async () => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const tasks = await payload.find({
      collection: 'tasks',
      sort: '-createdAt', // Сортировка по дате создания (новые сверху)
      limit: 50, // Ограничение на количество задач
    })

    return Response.json(tasks)
  } catch (error) {
    console.error('Ошибка при получении задач:', error)
    return Response.json({ error: 'Не удалось получить задачи' }, { status: 500 })
  }
}
