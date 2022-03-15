import { ACTIONS } from './App'
const NumberButton = ({ dispatch, digit }) => {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_NUMBER, payload: { digit } })}
    >
      {digit}
    </button>
  )
}
export default NumberButton
