import { subtle } from 'node:crypto'
import { Buffer } from 'node:buffer'
import { $fetch } from '@nuxt/test-utils'
import { encoder, hmacAlgorithm } from '../../src/runtime/server/lib/helpers'

const body = 'testBody'
const secretKey = 'testHerokuSecretKey'

export const simulateHerokuEvent = async () => {
  const signature = await subtle.importKey('raw', encoder.encode(secretKey), hmacAlgorithm, false, ['sign'])
  const hmac = await subtle.sign(hmacAlgorithm.name, signature, encoder.encode(body))
  const computedBase64 = Buffer.from(hmac).toString('base64')
  const validSignature = computedBase64

  const headers = { 'Heroku-Webhook-Hmac-SHA256': validSignature }

  return $fetch<{ isValidWebhook: boolean }>('/api/webhooks/heroku', {
    method: 'POST',
    headers,
    body,
  })
}
