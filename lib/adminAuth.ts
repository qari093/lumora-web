export function assertAdmin(req: Request) {
  const hdr = req.headers.get('x-admin-token') || ''
  const expected = process.env.ADMIN_TOKEN || 'dev-admin-token'
  if (hdr !== expected) {
    const err: any = new Error('unauthorized')
    err.status = 401
    throw err
  }
}
