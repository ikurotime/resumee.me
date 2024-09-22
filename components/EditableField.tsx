import { useState } from 'react'

export function EditableField({
  value,
  onSave,
  isEditable,
  className,
  type
}: {
  value: string
  onSave: (value: string) => void
  isEditable: boolean
  className: string
  type: 'text' | 'textarea'
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedValue, setEditedValue] = useState(value)
  const handleSave = () => {
    onSave(editedValue)
    setIsEditing(false)
  }

  if (!isEditable || !isEditing) {
    return (
      <div
        className={className}
        onClick={() => isEditable && setIsEditing(true)}
      >
        {value}
      </div>
    )
  }

  return type === 'text' ? (
    <div>
      <input
        type={type}
        value={editedValue}
        onChange={(e) => setEditedValue(e.target.value)}
        onBlur={handleSave}
        className={className}
        autoFocus
      />
    </div>
  ) : (
    <textarea
      value={editedValue}
      onChange={(e) => setEditedValue(e.target.value)}
      onBlur={handleSave}
      className={className}
    />
  )
}
