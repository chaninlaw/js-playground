import 'bulmaswatch/superhero/bulmaswatch.min.css'
import { useState, useEffect } from 'react'
import CodeEditor from './CodeEditor'
import Preview from './Preview'
import bundle from '../bundler'
import Resizable from './Resizable'

const CodeCell: React.FC = () => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [input, setInput] = useState('')

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(input)
      setCode(output.code)
      setError(output.error)
    }, 500)

    return () => clearTimeout(timer)
  }, [input])

  return (
    <Resizable direction="vertical">
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="const a = 1;"
            onChange={(value) => setInput(value)}
          />
        </Resizable>
        <Preview code={code} bundlingStatus={error} />
      </div>
    </Resizable>
  )
}

export default CodeCell
