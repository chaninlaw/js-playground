import React from 'react'
import { useActions } from '../hooks/useAcions'
import styled from 'styled-components'

interface StyledProps {
  $visible: boolean
}

const AddButtons = styled.div<StyledProps>`
  display: flex;
  justify-content: center;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.3s ease-in 0.2s;

  &:hover {
    opacity: 1;
  }

  & button {
    margin: 0 40px;
  }
`

const Divider = styled.div`
  position: absolute;
  top: 50%;
  bottom: 50%;
  right: 2.5%;
  left: 2.5%;
  border-bottom: 1px solid grey;
  width: 95%;
  z-index: -1;
`

const StyledAddCell = styled.div<StyledProps>`
  position: relative;
  margin: 10px 0;

  & ${Divider} {
    opacity: 0.2;
    transition: opacity 0.3s ease-in 0.1s;
  }

  &:hover {
    ${Divider} {
      opacity: ${(props) => (props.$visible ? 0.2 : 0.5)};
    }
  }
`

interface Props {
  previousCellId: string | null
  visible?: boolean
}

const AddCell: React.FC<Props> = ({ previousCellId, visible = false }) => {
  const { insertCellAfter } = useActions()

  return (
    <StyledAddCell $visible={visible}>
      <AddButtons $visible={visible}>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(previousCellId, 'code')}
        >
          <span className="icon is-small">
            <i className="fas fa-plus" />
          </span>
          <span>Code</span>
        </button>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(previousCellId, 'text')}
        >
          <span className="icon is-small">
            <i className="fas fa-plus" />
          </span>
          <span>Text</span>
        </button>
      </AddButtons>
      <Divider />
    </StyledAddCell>
  )
}

export default AddCell
