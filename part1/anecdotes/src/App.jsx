import { useState } from 'react'

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>

const DisplayAnecdote = ({ list, index }) => <div>{list[index]}</div>

const DisplayVotes = ({ votes, index }) => <div>has {votes[index]} votes</div>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))

  const getRandomAnecdote = () => {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * anecdotes.length)
    } while (newIndex === selected)
    
    return newIndex
  }

  const getMostVoted = () => {
    let mostVoted = 0
    let max = 0
    for (let i = 0; i < votes.length; i++) {
      if (votes[i] > max) {
        max = votes[i]
        mostVoted = i
      }
    }

    return mostVoted
  }

  const handleVote = () => {
    let newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <DisplayAnecdote list={anecdotes} index={selected} />
      <DisplayVotes votes={votes} index={selected} />
      <Button text={'next anecdote'} onClick={() => setSelected(getRandomAnecdote())} />
      <Button text={'vote'} onClick={handleVote} />

      <h1>Anecdote with most votes</h1>
      <DisplayAnecdote list={anecdotes} index={getMostVoted()} />
      <DisplayVotes votes={votes} index={getMostVoted()} />
    </div>
  )
}

export default App