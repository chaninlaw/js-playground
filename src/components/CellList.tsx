import React from 'react'
import { useTypedSelected } from '../hooks/useTypedSelector'

interface Props {}

const CellList: React.FC<Props> = (props) => {
  useTypedSelected((state) => state)
  return <div>CellList</div>
}

export default CellList
