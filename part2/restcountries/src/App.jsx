import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const SearchBox = ({ filter, onChange }) => (
  <div className="search-wrapper">
    <span className="search-icon">🔍</span>
    <input
      className="search-input"
      placeholder="Cauta o tara..."
      value={filter}
      onChange={onChange}
    />
  </div>
)

const DisplayCountry = ({ country, onShow, isSelected }) => (
  <li className={`country-item ${isSelected ? 'country-item--open' : ''}`}>
    <div className="country-row" onClick={() => onShow(country.cca3)}>
      <img
        className="country-flag-thumb"
        src={country.flags.png}
        alt={country.flags.alt || `Steagul ${country.name.common}`}
      />
      <span className="country-name">{country.name.common}</span>
      <span className="country-capital">{country.capital?.[0] ?? '—'}</span>
      <button className="show-btn" onClick={(e) => { e.stopPropagation(); onShow(country.cca3) }}>
        {isSelected ? 'Ascunde ▲' : 'Arata ▼'}
      </button>
    </div>
    {isSelected && <CountryInfo country={country} />}
  </li>
)

const WeatherIcon = ({ icon, description }) => (
  <img
    className="weather-icon"
    src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
    alt={description}
  />
)

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${api_key}`
    axios
      .get(url)
      .then(response => { setWeather(response.data); setLoading(false) })
      .catch(error => { console.error(error); setLoading(false) })
  }, [country])

  const languages = country.languages ? Object.values(country.languages) : []

  return (
    <div className="country-detail">
      <div className="detail-hero">
        <img
          className="detail-flag"
          src={country.flags.png}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
        />
        <div className="detail-headline">
          <h2 className="detail-name">{country.name.common}</h2>
          {country.name.official !== country.name.common && (
            <p className="detail-official">{country.name.official}</p>
          )}
          <div className="detail-badges">
            {country.region && <span className="badge badge--blue">{country.region}</span>}
            {country.subregion && <span className="badge badge--gray">{country.subregion}</span>}
          </div>
        </div>
      </div>

      <div className="detail-stats">
        <div className="stat-card">
          <span className="stat-label">Capitala</span>
          <span className="stat-value">{country.capital?.[0] ?? '-'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Suprafata</span>
          <span className="stat-value">{country.area?.toLocaleString()} km²</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Populatie</span>
          <span className="stat-value">{country.population?.toLocaleString()}</span>
        </div>
      </div>

      {languages.length > 0 && (
        <div className="detail-section">
          <h3 className="section-title">Limbi oficiale</h3>
          <div className="lang-list">
            {languages.map((lang, i) => (
              <span key={i} className="lang-tag">{lang}</span>
            ))}
          </div>
        </div>
      )}

      <div className="detail-section">
        <h3 className="section-title">Vremea in {country.capital?.[0]}</h3>
        {loading && <p className="weather-loading">Fetching weather…</p>}
        {!loading && weather && (
          <div className="weather-card">
            <WeatherIcon icon={weather.weather[0].icon} description={weather.weather[0].description} />
            <div className="weather-info">
              <span className="weather-temp">{Math.round(weather.main.temp)}°C</span>
              <span className="weather-desc">{weather.weather[0].description}</span>
              <span className="weather-meta">
                Se simte ca {Math.round(weather.main.feels_like)}°C &nbsp;·&nbsp; Vant {weather.wind.speed} m/s &nbsp;·&nbsp; Umiditate {weather.main.humidity}%
              </span>
            </div>
          </div>
        )}
        {!loading && !weather && (
          <p className="weather-error">Datele despre vreme nu sunt disponibile.</p>
        )}
      </div>
    </div>
  )
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
      .catch(error => console.error(error))
  }, [])

  const getFilteredCountries = () => {
    const norm = filter.trim().replace(/\s+/g, ' ').toLowerCase()
    return countries.filter(c =>
      c.name.common.trim().replace(/\s+/g, ' ').toLowerCase().includes(norm)
    )
  }

  const handleShow = (id) => setSelectedCountry(selectedCountry === id ? null : id)

  const filteredCountries = getFilteredCountries()

  let content
  if (filter === '' || (filteredCountries.length <= 10 && filteredCountries.length > 1)) {
    content = (
      <ul className="country-list">
        {filteredCountries.map(country => (
          <DisplayCountry
            key={country.cca3}
            country={country}
            onShow={handleShow}
            isSelected={selectedCountry === country.cca3}
          />
        ))}
      </ul>
    )
  } else if (filteredCountries.length > 10) {
    content = (
      <div className="message message--info">
        Prea multe rezultate, fii mai specific!
      </div>
    )
  } else if (filteredCountries.length === 1) {
    content = (
      <div className="single-result">
        <CountryInfo country={filteredCountries[0]} />
      </div>
    )
  } else {
    content = (
      <div className="message message--warn">
        Nu exista tari care se potrivesc cautarii tale.
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="header-globe">🌍</span>
            <div>
              <h1 className="header-title">Tarile lumii</h1>
              <p className="header-sub">
                {countries.length > 0 ? `${countries.length} countries` : 'Se incarca...'}
              </p>
            </div>
          </div>
          <SearchBox filter={filter} onChange={e => setFilter(e.target.value)} />
        </div>
      </header>

      <main className="app-main">
        {content}
      </main>
    </div>
  )
}

export default App
