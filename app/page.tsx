"use client"

import { useState } from "react"
import { ParagraphForm } from "./components/ParagraphForm"
import { AnalysisTable } from "./components/AnalysisTable"
import { analyzeParagraph } from "./actions/analyzeParagraph"

const DEFAULT_PROMPT = `
Paragraphs: {content}

Tokenize and Classify the Paragraphs into Knowledge, Application, Analysis, and Evaluation (KAAE) 
According to the Edexcel A A-Level Economics Spec. 
Step 1: Recognize the paragraphs
Step 2: Sentence Separation & Tokenization
Seperate the sentences, without changing anything into Knowledge, application, analysis and evaluation sentences. The way you should separate them is consider these guidelines, and ask what does it achieve concerning the question that was asked:

Question: {question}

Each block should be classified under one of the following categories using the criteria stated in these categories:

Knowledge (K) - This is your knowledge mark. Could be an explicit definition of a concept or a just the identification of a factor/reason.e.g saying In any case it shows you understand what they are asking.

Appplication (A) - This is your application mark. It is different to knowledge because it requires outside information/data. For Section A & B you will most likely be given data (this may be in the form of an extract, diagram or table) and it is your job to clearly state how the extract/table/diagram supports your point. For section C (the 25 marker) there is likely to be limited/no data and so it is your job to read around an industry of your choice/a developing country of your choice so that you are able to bring data/knowledge to support your point.

Analysis (A) - This is your analysis mark. Edexcel are looking for "chains of analysis" here but YES you can use diagrams as well. Let me explain this with an example. Imagine you have a question regarding how Monetary policy may be used to combat inflation. One point may be the increase of interest rates. Student A will not use chains and Student B will.
Student A: "By increasing interest rates there will be a fall in inflation"
Student B: "By increasing interest rates, this will rise the cost of repayment on variable rate mortgages, leading to a fall in effective disposable income which may cause the output gap to become negative leading to a possible fall in inflation."
Now I went a bit overkill on the example but its important that you use those terms such as "which means" & "this leads to". That is chains of analysis and Edexcel LOVE it.

Evaluation (E) - This is probably the most important one. Evaluation will be expected for the 8, 10, 12, 15 and 25 marker with differing degrees of intensity. Just now with evaluation it is all about directing the examiner to your way of answering the question. This may be done through generic measures such as considering the magnitude of the proposal (e.g. whether or not the tax will be large enough to have the intended effect of reducing consumption.), Time lag and the long run vs short run. There may also be some more technical arguments which may merit a greater mark but this depends solely on the question.

Output Format & Instructions
Each paragraph must be processed in separate rows.
Each sentence within a paragraph should be categorized under Knowledge, Application, Analysis, or Evaluation.
If multiple sentences of the same exist within a paragraph separate them in category with a '###'
If a category is missing in a paragraph, explicitly mark it as "missing" in the output. 
Always return using the Output format even if you cannot split it into kaae

Respond with a JSON array where each object represents a paragraph, like this:
[
  {
    "paragraph number": "...",
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

