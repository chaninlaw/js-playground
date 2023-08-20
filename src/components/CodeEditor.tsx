import { useRef } from 'react'
import MonacoEditor, { OnMount } from '@monaco-editor/react'
import prettier from 'prettier'
import parser from 'prettier/parser-babel'
import { editor } from 'monaco-editor'
import styled from 'styled-components'

const CodeEditorContainer = styled.div`
  width: calc(100% - 10px);

  .editor-wrapper {
    position: relative;
    height: 100%;
  }

  .editor-wrapper .button-format {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 20;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .editor-wrapper:hover .button-format {
    opacity: 1;
  }
`

interface CodeEditorProps {
  initialValue: string
  onChange: (value: string) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
    // editor.onDidChangeModelContent(() => {
    //   onChange(editor.getValue())
    // })
  }

  const onFormatClick = () => {
    const text = editorRef.current?.getModel()?.getValue()

    if (text) {
      const formatted = prettier
        .format(text, {
          parser: 'babel',
          plugins: [parser],
          useTabs: false,
          semi: true,
          singleQuote: true,
        })
        .replace(/\n$/, '')

      editorRef.current?.setValue(formatted)
    }
  }

  return (
    <CodeEditorContainer>
      <div className="editor-wrapper">
        <button
          className="button button-format is-primary is-small"
          onClick={onFormatClick}
        >
          Format
        </button>
        <MonacoEditor
          onMount={handleEditorDidMount}
          value={initialValue}
          onChange={(value) => onChange(value ?? '')}
          height="100%"
          language="javascript"
          theme="vs-dark"
          options={{
            wordWrap: 'on',
            minimap: { enabled: false },
            showUnused: false,
            folding: false,
            lineNumbersMinChars: 3,
            fontSize: 16,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </div>
    </CodeEditorContainer>
  )
}

export default CodeEditor
