import { legacy_createStore as createStore, applyMiddleware } from 'redux'

import thunk from 'redux-thunk'
import reducers from './reducers'
import { ActionType } from './actionTypes'

export const store = createStore(reducers, {}, applyMiddleware(thunk))
