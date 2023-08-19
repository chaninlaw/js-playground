import React from 'react'
import { useTypedSelected } from '../hooks/useTypedSelector'
import AddCell from './AddCell'
import CellListItem from './CellListItem'

const CellList: React.FC = () => {
  const cells = useTypedSelected(({ cells: { order, data } }) =>
    order.map((id) => data[id])
  )

  const renderedCells = cells.map((cell) => (
    <React.Fragment key={cell.id}>
      <AddCell nextCellId={cell.id} />
      <CellListItem key={cell.id} cell={cell} />
    </React.Fragment>
  ))

  return (
    <>
      {renderedCells}
      <AddCell visible={true} nextCellId={null} />
    </>
  )
}

export default CellList
