import { useState } from 'react'

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const DisplayStats = ({ good, neutral, bad }) => {
    if ((good + neutral + bad) === 0) {
      return (
        <div>No feedback given</div>
      )
    }

    const total = good + neutral + bad
    const average = (good - bad) / total
    const positive = `${good / total * 100}%`

    return (
      <table>
        <StatisticLine text={'good'} value={good} />
        <StatisticLine text={'neutral'} value={neutral} />
        <StatisticLine text={'bad'} value={bad} />
        <StatisticLine text={'all'} value={total} />
        <StatisticLine text={'average'} value={average} />
        <StatisticLine text={'positive'} value={positive} />
      </table>
    )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text={'good'} onClick={() => setGood(good + 1)} />
      <Button text={'neutral'} onClick={() => setNeutral(neutral + 1)} />
      <Button text={'bad'} onClick={() => setBad(bad + 1)} />

      <h1>statistics</h1>
      <DisplayStats good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App