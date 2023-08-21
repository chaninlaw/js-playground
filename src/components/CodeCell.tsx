import { useState, useEffect } from 'react'
import CodeEditor from './CodeEditor'
import Preview from './Preview'
import Resizable from './Resizable'
import type { Cell } from '../state'
import { useActions } from '../hooks/useAcions'
import { useTypedSelector } from '../hooks/useTypedSelector'
import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`

const ProgessWrapper = styled.div`
  height: 100%;
  flex-grow: 1;
  background-color: #fff;
`

const ProgessCover = styled.div`
  height: 100%;
  flex-grow: 1;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 10% 0 10%;
  animation: fadeIn 0.5s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`
interface CodeCellProps {
  cell: Cell
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions()
  const bundle = useTypedSelector((state) => state.bundles[cell.id])
  const cumulativeCode = useTypedSelector((state) => {
    const { data, order } = state.cells
    const orderedCells = order.map((id) => data[id])

    const cumulativeCode = [
      `
        const show = (value) => {
          document.querySelector('#root').innerHTML = value;
        };
      `,
    ]

    for (const c of orderedCells) {
      if (c.type === 'code') {
        cumulativeCode.push(c.content)
      }
      if (c.id === cell.id) {
        break
      }
    }
    return cumulativeCode
  })

  useEffect(() => {
    if (!bundle) createBundle(cell.id, cumulativeCode.join('\n'))

    const timer = setTimeout(() => {
      createBundle(cell.id, cumulativeCode.join('\n'))
    }, 750)

    return () => clearTimeout(timer)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode.join('\n'), cell.id, createBundle])

  return (
    <Resizable direction="vertical">
      <Row>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <ProgessWrapper>
          {!bundle || bundle.loading ? (
            <ProgessCover>
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </ProgessCover>
          ) : (
            <Preview code={bundle.code} bundlingStatus={bundle.err} />
          )}
        </ProgessWrapper>
      </Row>
    </Resizable>
  )
}

export default CodeCell
