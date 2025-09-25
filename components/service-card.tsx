import { ReactNode } from 'react'

interface ServiceCardProps {
  title: string
  children: ReactNode
  icon?: ReactNode
  id?: string
}

export default function ServiceCard({ title, children, icon, id }: ServiceCardProps) {
  return (
    <div id={id} className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start space-x-4 mb-6">
        {icon && (
          <div className="flex-shrink-0 w-12 h-12 bg-[#f97561] bg-opacity-10 rounded-full flex items-center justify-center">
            {icon}
          </div>
        )}
        <h3 className="text-2xl lg:text-3xl font-bold text-accent-foreground leading-tight">
          {title}
        </h3>
      </div>
      <div className="prose prose-lg max-w-none text-muted-foreground">
        {children}
      </div>
    </div>
  )
}