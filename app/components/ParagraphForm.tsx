"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ParagraphFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  initialPrompt: string
  onPromptChange: (prompt: string) => void
}

export function ParagraphForm({ onSubmit, initialPrompt, onPromptChange }: ParagraphFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [prompt, setPrompt] = useState(initialPrompt)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData(e.currentTarget)
      formData.append("prompt", prompt)
      await onSubmit(formData)
    } catch (error) {
      console.error("Error in ParagraphForm:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value
    setPrompt(newPrompt)
    onPromptChange(newPrompt)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="question">Question</Label>
        <Textarea id="question" name="question" placeholder="Enter your question here..." className="mt-1" />
      </div>
      <div>
        <Label htmlFor="paragraph">Paragraph</Label>
        <Textarea id="paragraph" name="paragraph" placeholder="Enter your paragraph here..." className="mt-1" />
      </div>
      <div>
        <Label htmlFor="image">Image of Paragraph (Optional, Must still include paragraph text)</Label>
        <Input id="image" name="image" type="file" accept="image/*" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="prompt">Custom Prompt</Label>
        <Textarea
          id="prompt"
          name="prompt"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter your custom prompt here..."
          className="mt-1"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Analyze"}
      </Button>
    </form>
  )
}

