interface AnalysisTableProps {
  analysis: {
    knowledge: string
    application: string
    analysis: string
    evaluation: string
  }[]
}

export function AnalysisTable({ analysis }: AnalysisTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Knowledge</th>
            <th className="border border-gray-300 p-2">Application</th>
            <th className="border border-gray-300 p-2">Analysis</th>
            <th className="border border-gray-300 p-2">Evaluation</th>
          </tr>
        </thead>
        <tbody>
          {analysis.map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{row.knowledge}</td>
              <td className="border border-gray-300 p-2">{row.application}</td>
              <td className="border border-gray-300 p-2">{row.analysis}</td>
              <td className="border border-gray-300 p-2">{row.evaluation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

