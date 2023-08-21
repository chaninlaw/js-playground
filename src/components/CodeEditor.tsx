import { useRef } from 'react'
import MonacoEditor, { OnMount } from '@monaco-editor/react'
import prettier from 'prettier'
import parser from 'prettier/parser-babel'
import styled from 'styled-components'
import { editor } from 'monaco-editor'

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

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor>()

  const onEditorDidMount: OnMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor

    editor.onDidChangeModelContent(() => {
      onChange(editor.getModel()!.getValue())
    })

    editor.updateOptions({ tabSize: 2 })
  }

  const onFormatClick = () => {
    // get current value from editor
    const unformatted: string = editorRef.current!.getModel()!.getValue()

    // format that value
    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/, '')

    // set the formatted value back in the editor
    editorRef.current?.setValue(formatted)
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          onMount={onEditorDidMount}
          value={initialValue}
          theme="vs-dark"
          language="javascript"
          height="100%"
          options={{
            wordWrap: 'on',
            minimap: { enabled: false },
            showUnused: false,
            folding: false,
            lineNumbersMinChars: 3,
            fontSize: 16,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </CodeEditorContainer>
  )
}

export default CodeEditor
