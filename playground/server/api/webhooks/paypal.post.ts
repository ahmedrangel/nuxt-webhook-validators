export default defineEventHandler(async (event) => {
  const isValidWebhook = await isValidPaypalWebhook(event)

  if (!isValidWebhook) throw createError({ statusCode: 401, statusMessage: 'Unauthorized: webhook is not valid' })

  return { isValidWebhook }
})
