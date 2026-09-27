import { resetPasswordSchema } from '../../validators/auth.validator'

describe('Password reset request contract', () => {
  it('accepts the payload sent by the reset form and read by the controller', () => {
    expect(resetPasswordSchema.safeParse({ body: { token: 'test-reset-token', newPassword: 'Example123!' } }).success).toBe(true)
  })
  it('rejects a short password', () => {
    expect(resetPasswordSchema.safeParse({ body: { token: 'test-reset-token', newPassword: 'Ab1!' } }).success).toBe(false)
  })
  it('rejects a missing token', () => {
    expect(resetPasswordSchema.safeParse({ body: { newPassword: 'Example123!' } }).success).toBe(false)
  })
})
