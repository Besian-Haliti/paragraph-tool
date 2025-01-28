"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { processImage } from "../utils/imageProcessing"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function analyzeParagraph(formData: FormData) {
  const question = formData.get("question") as string
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

  // Ensure AI returns JSON only
  const prompt = `${customPrompt.replace("{content}", content)}${customPrompt.replace("{question}", question)}

  Please return the response strictly in JSON format. No explanations, only a valid JSON array.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log("AI Raw Response:", text)  // Debugging log to inspect response

    // Extract JSON if there are unexpected characters
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response");
    }

    const parsedResponse = JSON.parse(jsonMatch[0]); // Parse JSON

    if (!Array.isArray(parsedResponse)) {
      throw new Error("Unexpected response format");
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing paragraph:", error);
    throw new Error("Failed to analyze paragraph");
  }
}
