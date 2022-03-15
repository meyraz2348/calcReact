import { useReducer } from 'react'
import NumberButton from './NumberButton'
import OperationButton from './operationButton'
import './App.css'
import styles from './styles.css'
export const ACTIONS = {
  ADD_NUMBER: 'addition',
  DEL_NUMBER: 'substraction',
  CLEAR: 'clearConsole',
  OPERATION: 'operation',
  EVALUATE: 'equalsto',
}
const evaluate = ({ currentOperand, previousOperand, operation }) => {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ''
  let result = ''
  switch (operation) {
    case '+':
      result = prev + current
      break
    case '-':
      result = prev - current
      break
    case '*':
      result = prev * current
      break
    case '/':
      result = prev / current
      break
  }
  return result.toString()
}
const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_NUMBER:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === '0' && state.currentOperand === '0') return state
      if (payload.digit === '.' && state.currentOperand.includes('.'))
        return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      }
    case ACTIONS.OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DEL_NUMBER:
      if (state.overwrite)
        return {
          ...state,
          currentOperand: null,
        }
      if (state.currentOperand == null) {
        return state
      }
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      )
        return state
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }
  }
}
const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
})
const formatOperand = (operand) => {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  )
  const allClear = () => dispatch({ type: ACTIONS.CLEAR })
  return (
    <div>
      <div className='calculator-grid'>
        <div className='output'>
          <div className='inputDisplayBlock'>
            <div className='previous-operand'>
              {formatOperand(previousOperand)} {operation}
            </div>
            <div className='current-operand'>
              {formatOperand(currentOperand)}
            </div>
          </div>
        </div>
        <button className='span-two' onClick={allClear}>
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DEL_NUMBER })}>
          DEL
        </button>
        <OperationButton operation='/' dispatch={dispatch} />
        <NumberButton digit='1' dispatch={dispatch} />
        <NumberButton digit='2' dispatch={dispatch} />
        <NumberButton digit='3' dispatch={dispatch} />
        <OperationButton operation='*' dispatch={dispatch} />
        <NumberButton digit='4' dispatch={dispatch} />
        <NumberButton digit='5' dispatch={dispatch} />
        <NumberButton digit='6' dispatch={dispatch} />
        <OperationButton operation='+' dispatch={dispatch} />
        <NumberButton digit='7' dispatch={dispatch} />
        <NumberButton digit='8' dispatch={dispatch} />
        <NumberButton digit='9' dispatch={dispatch} />
        <OperationButton operation='-' dispatch={dispatch} />
        <NumberButton digit='.' dispatch={dispatch} />
        <NumberButton digit='0' dispatch={dispatch} />
        <button
          className='span-two'
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  )
}
export default App
