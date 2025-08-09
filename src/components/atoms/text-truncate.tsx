"use client"

interface TextTruncateProps {
  text: string
  maxLength: number
  className?: string
  title?: boolean
}

export function TextTruncate({ text, maxLength, className = "", title = true }: TextTruncateProps) {
  const truncated = text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  
  return (
    <span 
      className={`truncate ${className}`}
      title={title ? text : undefined}
    >
      {truncated}
    </span>
  )
}