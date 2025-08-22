interface DividerProps {
  className?: string;
}

export default function Divider({ className = '' }: DividerProps) {
  return (
    <div 
      className={`divider mx-auto px-4 md:px-6 ${className}`}
      style={{
        backgroundColor: '#e0dbdb',
        width: '100%',
        minHeight: '1px'
      }}
    />
  );
}
