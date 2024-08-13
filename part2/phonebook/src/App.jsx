import { useState, useEffect } from 'react'

import personService from './services/personService'

const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>

const Form = ({ newName, newNumber, onSubmit, onChangeName, onChangeNumber }) => (
  <form onSubmit={onSubmit}>
    <div>
      name: 
      <input 
        value={newName}
        onChange={onChangeName}
      />
    </div>
    <div>
      number:
      <input 
        value={newNumber} 
        onChange={onChangeNumber}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Filter = ({ filter, onChange }) => (
  <div>
    filter shown with
    <input 
      value={filter} 
      onChange={onChange}
    />
  </div>
)

const Person = ({ person, onDelete }) => {
  const { id, name, number } = person

  return (
    <tr>
      <td>{name}</td>
      <td>{number}</td>
      <td>
        {<Button text={'delete'} onClick={() => onDelete(id)} />}
      </td>
    </tr>
  )
}

const DisplayNumbers = ({ persons, onDelete }) => (
  <table>
    <tbody>
      {persons.map(person =>
        <Person key={person.id} person={person} onDelete={onDelete} />
      )}
    </tbody>
  </table>
)

const Notification = ({ message, isError }) => {
  if (message === null)
    return null

  const label = isError
    ? 'error'
    : 'notification'

  return (
    <div className={label}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 

  // retrieve persons list from server
  const hook = () => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }
  useEffect(hook, [])

  const [personsToShow, setPersonsToShow] = useState(persons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const addPerson = (event) => {
    event.preventDefault()

    const exists = persons.find(person => person.name === newName)

    if (exists) {
      const { id, name } = exists

      const msg = `${name} is already added to the phonebook, replace the old number with a new one?`
      if (window.confirm(msg)) {
        const personObject = {
          ...exists,
          number: newNumber
        }

        personService
          .update(id, personObject)
          .then(changedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : changedPerson))
            setNotification(`Changed ${name}'s number`)
            setTimeout(() => setNotification(null), 5000)
          })
          .catch(error => {
            setErrorMessage(`Information of ${name} has already been removed from the server`)
            setPersons(persons.filter(person => person.id !== id))
          })
      }
      return
    }
    
    const personObject = {
      name: newName,
      number: newNumber
    }
    
    personService
      .create(personObject)
      .then(response => {
        setNotification(`Added ${newName}`)
        setTimeout(() => setNotification(null), 5000)
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  useEffect(() => {
    const normalizedFilter = filter.trim().replace(/\s+/g, ' ').toLowerCase()
    setPersonsToShow(
      persons.filter(person => {
        const normalizedName = person.name.trim().replace(/\s+/g, ' ').toLowerCase()
        return normalizedName.includes(normalizedFilter)
      })
    )
  }, [ filter, persons ])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} isError={false} />
      <Notification message={errorMessage} isError={true} />
      <Filter filter={filter} onChange={(event) => setFilter(event.target.value)} />
      
      <h3>Add new</h3>
      <Form
        onSubmit={addPerson}
        onChangeName={(event) => setNewName(event.target.value)}
        onChangeNumber={(event) => setNewNumber(event.target.value)}
        newName={newName}
        newNumber={newNumber}
      />

      <h3>Numbers</h3>
      <DisplayNumbers persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App