"use server"

import OpenAI from "openai"
import { processImage } from "../utils/imageProcessing"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function analyzeParagraph(formData: FormData) {
  const question = formData.get("question") as string || "No Question Given"
  const paragraph = formData.get("paragraph") as string
  const imageFile = formData.get("image") as File | null
  const customPrompt = formData.get("prompt") as string 

  if (!paragraph) {
    throw new Error("Paragraph is required")
  }

  let content = paragraph

  if (imageFile && imageFile.size > 0) {
    try {
      const base64Image = await processImage(imageFile)
      content += `\n\nImage content: [Base64 encoded image: ${base64Image.slice(0, 50)}...]`
    } catch (error) {
      console.error("Error processing image:", error)
      throw new Error("Failed to process image")
    }
  }

  const finalPrompt = `${customPrompt
    .replace("{content}", content)
    .replace("{question}", question)}`

  try {
    const response = await openai.chat.completions.create({
      model: "o1-preview",
      messages: [
        { role: "user", content: finalPrompt },
      ],
      temperature: 1,
    })

    const result = response.choices[0].message.content || ""

    const jsonMatch = result.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsedResponse)) {
      throw new Error("Unexpected response format");
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing paragraph:", error)
    throw new Error("Failed to analyze paragraph")
  }
}