import { prisma } from '../../lib/prisma'

describe('Prisma Client Singleton', () => {
  it('should export a prisma client instance', () => {
    expect(prisma).toBeDefined()
    expect(typeof prisma).toBe('object')
  })

  it('should have common Prisma methods', () => {
    expect(prisma.user).toBeDefined()
    expect(prisma.provider).toBeDefined()
    expect(prisma.booking).toBeDefined()
    expect(prisma.review).toBeDefined()
  })
})

