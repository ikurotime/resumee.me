import { useState } from 'react'

export function EditableField({
  value,
  onSave,
  isEditable,
  className
}: {
  value: string
  onSave: (value: string) => void
  isEditable: boolean
  className: string
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

  return (
    <input
      type='text'
      defaultValue={value}
      value={editedValue}
      onChange={(e) => setEditedValue(e.target.value)}
      onBlur={handleSave}
      className={className}
      autoFocus
    />
  )
}
