import { useTypedSelector } from './useTypedSelector'

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells
    const orderedCells = order.map((id) => data[id])

    const showFunc = `
    import _React from 'react';
    import {createRoot as _createRoot} from 'react-dom/client';

    var show = (value) => {
      const root = document.querySelector('#root');
      if (typeof value === 'object') {
        if (value.$$typeof && value.props) {
          _createRoot(root).render(value);
        }
        root.innerHTML = JSON.stringify(value);
      } else {
        root.innerHTML = value;
      }
    };
  `
    const showFuncNoOp = 'var show = () => {}'
    const cumulativeCode = []

    for (const c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === cellId) cumulativeCode.push(showFunc)
        else cumulativeCode.push(showFuncNoOp)

        cumulativeCode.push(c.content)
      }
      if (c.id === cellId) break
    }
    return cumulativeCode
  }).join('\n')
}
