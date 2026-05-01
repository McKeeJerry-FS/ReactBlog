async function normalizeImageForUpload(imageFile) {
  if (!(imageFile instanceof File)) {
    throw new Error('Please choose an image file to upload')
  }

  if (!imageFile.type.startsWith('image/')) {
    throw new Error('Only image files can be uploaded')
  }

  if (imageFile.type === 'image/gif') {
    return imageFile
  }

  let normalizedFile = imageFile

  if (
    imageFile.type === 'image/heic' ||
    imageFile.type === 'image/heif' ||
    /\.(heic|heif)$/i.test(imageFile.name)
  ) {
    const heic2anyModule = await import('heic2any')
    const convertedBlob = await heic2anyModule.default({
      blob: imageFile,
      toType: 'image/jpeg',
      quality: 0.9,
    })

    const convertedFile = Array.isArray(convertedBlob)
      ? convertedBlob[0]
      : convertedBlob

    normalizedFile = new File(
      [convertedFile],
      imageFile.name.replace(/\.(heic|heif)$/i, '.jpg'),
      {
        type: 'image/jpeg',
        lastModified: Date.now(),
      },
    )
  }

  const imageCompressionModule = await import('browser-image-compression')
  const imageCompression = imageCompressionModule.default

  return imageCompression(normalizedFile, {
    maxSizeMB: 4.5,
    maxWidthOrHeight: 2560,
    useWebWorker: true,
    initialQuality: 0.82,
    fileType: normalizedFile.type || 'image/jpeg',
  })
}

export const uploadGalleryImage = async (token, imageFile) => {
  const normalizedFile = await normalizeImageForUpload(imageFile)
  const formData = new FormData()
  formData.append('image', normalizedFile)

  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/gallery/images`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  )

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to upload image')
  }

  return await res.json()
}

export const getGalleryImages = async (limit = 200) => {
  const search = new URLSearchParams({ limit: String(limit) })
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/gallery/images?${search}`,
  )
  if (!res.ok) {
    throw new Error('Failed to load gallery images')
  }
  return await res.json()
}
