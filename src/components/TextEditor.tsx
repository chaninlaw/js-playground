import React, { useState, useEffect, useRef } from 'react'
import MDEditor from '@uiw/react-md-editor'
import styled from 'styled-components'
import type { Cell } from '../state'
import { useActions } from '../hooks/useAcions'

const StyledMDEditor = styled(MDEditor)`
  &.w-md-editor .title {
    line-height: unset !important;
    font-size: unset !important;
    font-weight: unset !important;
    color: #d4d4d4 !important;
  }

  &.w-md-editor ul {
    line-height: 1;
  }

  &.w-md-editor .w-md-editor-bar svg {
    display: none;
  }
  &.w-md-editor .w-md-editor-bar {
    position: relative;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
    height: 11px;
    cursor: row-resize;
    background-color: #37414b;
    background-repeat: no-repeat;
    background-position: 50%;
    width: 100%;
  }

  &.w-md-editor em {
    font-style: italic;
  }

  &.w-md-editor .wmde-markdown hr {
    border-top: 1px solid #dee5ed;
  }

  &.w-md-editor .wmde-markdown ol {
    list-style: decimal;
  }

  &.w-md-editor .w-md-editor-show-live {
    /* Hide menu bar buttons to prevent accidental delete */
    z-index: 20;
  }

  &.w-md-editor .w-md-editor-toolbar {
    background-color: #37414b;
    border-bottom: 1px solid gray;
  }

  &.w-md-editor .w-md-editor-toolbar li button {
    color: #d4d4d4;
  }

  &.w-md-editor .w-md-editor-content {
    background-color: #202123;
  }

  &.w-md-editor,
  &.w-md-editor .w-md-editor-text-pre {
    color: #d4d4d4;
  }

  &.w-md-editor .w-md-editor-text-pre .bold {
    color: unset;
  }

  &.w-md-editor .token.list.punctuation {
    background-color: unset;
  }
`

interface TextEditorProps {
  cell: Cell
}

const defaultContent = '# #Click to edit'

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const mdRef = useRef<HTMLDivElement | null>(null)
  const [editing, setEditing] = useState(false)
  const { updateCell } = useActions()

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        mdRef.current &&
        event.target &&
        mdRef.current.contains(event.target as Node)
      ) {
        return
      }
      setEditing(false)
    }
    document.addEventListener('click', listener, { capture: true })

    return () =>
      document.removeEventListener('click', listener, { capture: true })
  }, [])

  if (editing) {
    return (
      <div ref={mdRef}>
        <StyledMDEditor
          value={cell.content}
          onChange={(v) => updateCell(cell.id, v || '')}
        />
      </div>
    )
  }

  return (
    <div className="card" onClick={() => setEditing(true)}>
      <MDEditor.Markdown
        className="card-content"
        source={cell.content || defaultContent}
      />
    </div>
  )
}

export default TextEditor
