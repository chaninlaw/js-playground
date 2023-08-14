import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { RootState } from '../state'

export const useTypedSelected: TypedUseSelectorHook<RootState> = useSelector
