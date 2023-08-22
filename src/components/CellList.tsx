import React from 'react'
import { useTypedSelector } from '../hooks/useTypedSelector'
import AddCell from './AddCell'
import CellListItem from './CellListItem'
import styled from 'styled-components'

const StyledCellList = styled.div`
  margin: 0 25px 10vh 0;

  .react-draggable-transparent-selection & {
    margin-bottom: 100vh;
  }
`

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  )

  const renderedCells = cells.map((cell) => (
    <React.Fragment key={cell.id}>
      <CellListItem key={cell.id} cell={cell} />
      <AddCell previousCellId={cell.id} />
    </React.Fragment>
  ))

  return (
    <StyledCellList>
      <AddCell visible={true} previousCellId={null} />
      {renderedCells}
    </StyledCellList>
  )
}

export default CellList
