import React from 'react'
import { useActions } from '../hooks/useAcions'
import styled from 'styled-components'

const StyledActionBar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  opacity: 0.25;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
`

interface ActionBarProps {
  id: string
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions()

  return (
    <StyledActionBar>
      <button
        className="button is-primary is-small"
        onClick={() => moveCell(id, 'up')}
      >
        <span className="icon">
          <i className="fas fa-arrow-up" />
        </span>
      </button>
      <button
        className="button is-primary is-small"
        onClick={() => moveCell(id, 'down')}
      >
        <span className="icon">
          <i className="fas fa-arrow-down" />
        </span>
      </button>
      <button
        className="button is-primary is-small"
        onClick={() => deleteCell(id)}
      >
        <span className="icon">
          <i className="fas fa-times" />
        </span>
      </button>
    </StyledActionBar>
  )
}
export default ActionBar
