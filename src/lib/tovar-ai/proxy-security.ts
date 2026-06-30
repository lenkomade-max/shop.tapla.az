// ============================================================================
// HMAC-SHA256 signing for Kei Proxy requests
// ============================================================================

import crypto from 'crypto'

const PROXY_SECRET = process.env.PROXY_SECRET || ''

/**
 * Creates HMAC-SHA256 signed headers for proxy requests.
 * Each request gets unique signature (timestamp + nonce + body).
 * Replay protection: timestamp expires in 5 min, nonce is one-time.
 */
export function createSignedHeaders(
  path: string,
  method: string,
  body?: string,
): Record<string, string> {
  if (!PROXY_SECRET) {
    throw new Error('PROXY_SECRET not configured')
  }

  const timestamp = Date.now().toString()
  const nonce = crypto.randomBytes(16).toString('hex')
  const bodyString = body || ''

  const message = `${method}\n${path}\n${timestamp}\n${nonce}\n${bodyString}`
  const signature = crypto
    .createHmac('sha256', PROXY_SECRET)
    .update(message)
    .digest('hex')

  return {
    'Content-Type': 'application/json',
    'X-Signature': `sha256=${signature}`,
    'X-Timestamp': timestamp,
    'X-Nonce': nonce,
  }
}

/**
 * Creates a polling token for a taskId.
 * Token = HMAC-SHA256(PROXY_SECRET, taskId)
 * Kei-proxy verifies this token when polling /api/public/status.
 */
export function createPollingToken(taskId: string): string {
  if (!PROXY_SECRET) {
    throw new Error('PROXY_SECRET not configured')
  }

  return crypto
    .createHmac('sha256', PROXY_SECRET)
    .update(taskId)
    .digest('hex')
}
