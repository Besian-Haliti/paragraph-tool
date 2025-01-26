"use client"

import { useState } from "react"
import { ParagraphForm } from "./components/ParagraphForm"
import { AnalysisTable } from "./components/AnalysisTable"
import { analyzeParagraph } from "./actions/analyzeParagraph"

const DEFAULT_PROMPT = `
Paragraphs: {content}

Tokenize and Classify the Paragraphs into Knowledge, Application, Analysis, and Evaluation (KAAE) 
According to the Edexcel A A-Level Economics Spec. 
Step 1: Paragraph Separation & Tokenization
Each paragraph should be treated as a separate entity.
Split each paragraph into self-contained blocks where each block represents a single idea or sentence.

Step 2: Classification Rules (KAAE Framework)
Each block should be classified under one of the following categories:

Knowledge (K): Definitions, explanations, or introductions. Look for words like: “This means, Defined as, This refers to…”

Application (A): Applying knowledge to examples, case studies, or real-world scenarios. Look for words like: “For example, With reference to the figure, The graph shows, Here we can see…”

Analysis (A): Explaining relationships between variables, breaking down causes/effects. Look for words like: “This results in, This leads to…”

Evaluation (E): Making judgments, counterarguments, or assessing significance. This includes: 
Judgments: “It depends on..., The effectiveness of this depends...”
Counterarguments: “However..., Although this is true..., An alternative is...”
Magnitude or Significance: “The most important factor is..., The long-term impact is more significant than the short-term...”

Output Format & Instructions
Each paragraph must be processed separately.
Each block within a paragraph should be categorized under Knowledge, Application, Analysis, or Evaluation.
If a category is missing in a paragraph, explicitly mark it as "missing" in the output. 
Always return using the Output format even if you cannot split it into kaae

Respond with a JSON array where each object represents a paragraph, like this:
[
  {
    "knowledge": "...",
    "application": "...",
    "analysis": "...",
    "evaluation": "..."
  },
  ...
]
`

export default function Home() {
  const [analysis, setAnalysis] = useState<any[] | null>(null)
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT)

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await analyzeParagraph(formData)
      if (Array.isArray(result)) {
        setAnalysis(result)
      } else {
        console.error("Unexpected result format:", result)
        alert("An error occurred while analyzing the paragraph.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred while analyzing the paragraph.")
    }
  }

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Paragraph Analyzer</h1>
      <ParagraphForm onSubmit={handleSubmit} initialPrompt={prompt} onPromptChange={handlePromptChange} />
      {analysis && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
          <AnalysisTable analysis={analysis} />
        </div>
      )}
    </main>
  )
}

