import React from 'react'
import { Cell } from '../state'
import CodeCell from './CodeCell'
import TextEditor from './TextEditor'
import ActionBar from './ActionBar'
import styled from 'styled-components'

const StyledCellListItem = styled.div`
  position: relative;
  margin: 20px 10px;
`
const ActionBarWrapper = styled.div`
  height: 30px;
  width: 100%;
  background-color: #37414b;
  border-bottom: 1px solid #808080;
`
interface Props {
  cell: Cell
}

const CellListItem: React.FC<Props> = ({ cell }) => {
  let child: JSX.Element
  if (cell.type === 'code') {
    child = (
      <>
        <ActionBarWrapper>
          <ActionBar id={cell.id} />
        </ActionBarWrapper>
        <CodeCell cell={cell} />
      </>
    )
  } else {
    child = (
      <>
        <TextEditor cell={cell} />
        <ActionBar id={cell.id} />
      </>
    )
  }

  return <StyledCellListItem>{child}</StyledCellListItem>
}

export default CellListItem
