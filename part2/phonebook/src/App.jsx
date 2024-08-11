import { useState, useEffect } from 'react'

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

const Person = ({ person }) => {
  const { name, number } = person
  return (
    <tr>
      <td>{name}</td>
      <td>{number}</td>
    </tr>
  )
}

const DisplayNumbers = ({ persons }) => (
  <table>
    <tbody>
      {persons.map(person =>
        <Person key={person.id} person={person} />
      )}
    </tbody>
  </table>
)

const App = () => {
  const [persons, setPersons] = useState([
    { id: 1, name: 'Arto Hellas', number: '0123-456-789' }
  ]) 

  const [personsToShow, setPersonsToShow] = useState(persons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    const exists = persons.some(person => person.name === newName)

    if (exists) {
      alert(`${newName} is already added to the phonebook`)
      return
    }
    
    const personObject = {
        id: persons.length + 1,
        name: newName,
        number: newNumber
    }
    
    setPersons(persons.concat(personObject))
  
    setNewName('')
    setNewNumber('')
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
      <DisplayNumbers persons={personsToShow} />
    </div>
  )
}

export default App