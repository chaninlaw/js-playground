/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './state'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

const el = document.getElementById('root')

createRoot(el!).render(
  <Provider store={store}>
    <BrowserRouter basename={import.meta.env.DEV !== 'production' ? '/' : '/js-playground/'}>
    <App />
    </BrowserRouter>
  </Provider>
)
