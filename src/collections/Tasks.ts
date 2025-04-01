import { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { Code } from '@/blocks/Code/config'

const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'createdAt'],
    description: 'Управление задачами для команды',
    group: 'Проекты',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название задачи',
      admin: {
        description: 'Краткое название задачи',
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [Code] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
            OrderedListFeature(),
            UnorderedListFeature(),
          ]
        },
      }),
      label: false,
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'В работе', value: 'in_progress' },
        { label: 'Отменена', value: 'cancelled' },
        { label: 'Завершена', value: 'completed' },
      ],
      defaultValue: 'new',
      required: true,
      admin: {
        isClearable: false,
        isSortable: true,
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      label: 'Назначена',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      label: 'Срок выполнения',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyyy',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'attachments',
      type: 'upload',
      label: 'Вложения',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Дополнительные файлы к задаче',
      },
    },
  ],
  timestamps: true,
}

export default Tasks
