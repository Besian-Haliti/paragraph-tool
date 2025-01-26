export async function processImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const base64String = reader.result as string
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Content = base64String.split(",")[1]
      resolve(base64Content)
    }

    reader.onerror = () => {
      reject(new Error("Failed to read image file"))
    }

    reader.readAsDataURL(file)
  })
}

