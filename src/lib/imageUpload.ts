const MAX_EDGE = 1400
const JPEG_QUALITY = 0.82
const MAX_INPUT_BYTES = 15 * 1024 * 1024

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

/**
 * Reads a picked photo and returns a downscaled JPEG data URL, so product
 * photos can be stored with the product record and survive redeploys.
 */
export async function fileToImageDataUrl(file: File): Promise<string> {
  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new Error('Use a JPG, PNG or WebP image.')
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error('Each photo must be smaller than 15 MB.')
  }

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('This browser cannot process images.')
  }

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, width, height)
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY)
}
