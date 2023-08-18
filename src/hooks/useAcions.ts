import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actionsCreators } from '../state'

export const useActions = () => {
  const dispatch = useDispatch()

  return bindActionCreators(actionsCreators, dispatch)
}
