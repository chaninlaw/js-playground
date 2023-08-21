import React from 'react'
import { useTypedSelector } from '../hooks/useTypedSelector'
import AddCell from './AddCell'
import CellListItem from './CellListItem'

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
    <>
      <AddCell visible={true} previousCellId={null} />
      {renderedCells}
    </>
  )
}

export default CellList
