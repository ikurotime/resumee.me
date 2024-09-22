import { Fragment, useEffect, useState } from 'react'
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

  useEffect(() => {
    setEditedValue(value) // Update editedValue when value changes
  }, [value])

  const handleSave = () => {
    if (editedValue !== value) {
      onSave(editedValue)
    }
    setIsEditing(false)
  }

  if ((!isEditable || !isEditing) && value !== '') {
    return (
      <p className={className} onClick={() => isEditable && setIsEditing(true)}>
        {value.split('\n').map((line, index) => (
          <Fragment key={index}>
            {line}
            {index < value.split('\n').length - 1 && <br />}
          </Fragment>
        ))}
      </p>
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
