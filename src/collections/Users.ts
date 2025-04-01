import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Developer', value: 'developer' },
        { label: 'User', value: 'user' },
      ],
      defaultValue: 'user',
      admin: {
        position: 'sidebar',
      },
      access: { update: ({ req: { user } }) => user?.role === 'admin' },
    },
  ],
}
