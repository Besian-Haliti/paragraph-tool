interface AnalysisTableProps {
  analysis: {
    sentence: string
    label: string
    reason: string
  }[]
}

export function AnalysisTable({ analysis }: AnalysisTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Sentence</th>
            <th className="border border-gray-300 p-2">Label</th>
            <th className="border border-gray-300 p-2">Reason</th>
          </tr>
        </thead>
        <tbody>
          {analysis.map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{row.sentence}</td>
              <td className="border border-gray-300 p-2">{row.label}</td>
              <td className="border border-gray-300 p-2">{row.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

