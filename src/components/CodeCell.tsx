import { useState, useEffect } from 'react'
import CodeEditor from './CodeEditor'
import Preview from './Preview'
import bundle from '../bundler'
import Resizable from './Resizable'
import type { Cell } from '../state'
import { useActions } from '../hooks/useAcions'
import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`
interface CodeCellProps {
  cell: Cell
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const { updateCell } = useActions()

  useEffect(() => {
    const timer = setTimeout(async () => {
      const output = await bundle(cell.content)
      setCode(output.code)
      setError(output.error)
    }, 500)

    return () => clearTimeout(timer)
  }, [cell.content])

  return (
    <Resizable direction="vertical">
      <Row>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <Preview code={code} bundlingStatus={error} />
      </Row>
    </Resizable>
  )
}

export default CodeCell
