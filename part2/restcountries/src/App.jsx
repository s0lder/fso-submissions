import { useState, useEffect } from 'react'

import axios from 'axios'

const SearchBox = ({ filter, onChange }) => (
  <div>
    find countries
    <input 
      value={filter} 
      onChange={onChange}
    />
  </div>
)

const DisplayCountry = ({ country, onShow, isSelected }) => (
  <li>
    {country.name.common}
    <button onClick={() => onShow(country.cca3)}>show</button>
    {isSelected && <CountryInfo country={country} />}
  </li>
)

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${api_key}`;
    axios
      .get(url)
      .then(response => setWeather(response.data))
      .catch(error => console.error(`error fetching weather data ${error}`))
  }, [country])

  return (
    <div>
      <div>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
      </div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((language, index) => <li key={index}>{language}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      {weather && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>temperature {weather.main.temp} C</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  const getCountries = () => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
      .catch(error => console.error(`error fetching countries list ${error}`))
  }
  useEffect(getCountries, [])

  const getFilteredCountries = () => {
    const normalizedFilter = filter.trim().replace(/\s+/g, ' ').toLowerCase()
    return (
      countries.filter(country => {
        const normalizedName = country.name.common.trim().replace(/\s+/g, ' ').toLowerCase()
        return normalizedName.includes(normalizedFilter)
      })
    )
  }

  const handleShow = (id) => setSelectedCountry(selectedCountry === id ? null : id)

  const filteredCountries = getFilteredCountries()

  let content;

  if (filter === '' || (filteredCountries.length <= 10 && filteredCountries.length > 1)) {
    content = (
      <ul>
        {filteredCountries.map(country =>
          <DisplayCountry
            key={country.cca3}
            country={country}
            onShow={handleShow}
            isSelected={selectedCountry === country.cca3}
          />
        )}
      </ul>
    )
  } else if (filteredCountries.length > 10) {
    content = <p>Too many matches, specify another filter</p>
  } else if (filteredCountries.length === 1) {
    content = <CountryInfo country={filteredCountries[0]} />
  }

  return (
    <div>
      <SearchBox filter={filter} onChange={(event) => setFilter(event.target.value)} />
      {content}
    </div>
  )
}

export default App