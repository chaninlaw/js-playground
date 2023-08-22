import { useCallback, useRef } from 'react'
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

  const activateMonacoJSXHighlighter = async (monacoEditor, monaco) => {
    const { default: traverse } = await import('@babel/traverse')
    const { parse } = await import('@babel/parser')
    const { default: MonacoJSXHighlighter } = await import(
      'monaco-jsx-highlighter'
    )

    const babelParse = (code) =>
      parse(code, {
        sourceType: 'module',
        plugins: ['jsx'],
        errorRecovery: true,
      })

    const monacoJSXHighlighter = new MonacoJSXHighlighter(
      monaco,
      babelParse,
      traverse,
      monacoEditor()
    )

    monacoJSXHighlighter.highlightOnDidChangeModelContent()
    monacoJSXHighlighter.addJSXCommentCommand()

    return monacoJSXHighlighter
  }

  const onEditorDidMount: OnMount = useCallback(
    (monacoEditor: editor.IStandaloneCodeEditor, monaco) => {
      activateMonacoJSXHighlighter(monacoEditor, monaco)
        .then((monacoJSXHighlighterRefCurrent) => {
          editorRef.current = monacoJSXHighlighterRefCurrent
        })
        .catch((e) => {})

      editorRef.current = monacoEditor

      monacoEditor.onDidChangeModelContent(() => {
        onChange(monacoEditor.getModel()!.getValue())
      })
    },
    []
  )

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
            tabSize: 2,
          }}
        />
      </div>
    </CodeEditorContainer>
  )
}

export default CodeEditor
