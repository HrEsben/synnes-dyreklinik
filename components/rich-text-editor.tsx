'use client'

interface RichTextEditorProps {
  value: string
  onChange: (text: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = 'Enter text...' }: RichTextEditorProps) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[150px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2c2524] focus:border-transparent resize-vertical"
        style={{ 
          fontFamily: 'inherit',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap'
        }}
      />
    </div>
  )
}
