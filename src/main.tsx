/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './state'
import App from './App'

const el = document.getElementById('root')

createRoot(el!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
