import { useState } from 'react';

const MAX_LENGTH = 80;

function validate(text) {
  if (!text) return 'Type a city name first, for example "Beirut".';
  if (text.length > MAX_LENGTH) return `Keep it under ${MAX_LENGTH} characters.`;
  if (!/\p{L}/u.test(text)) return 'A city name needs at least one letter.';
  return '';
}

// Controlled input: the text lives in App (query), this component only edits it.
export default function SearchBar({ query, onQueryChange, onSearch, disabled }) {
  const [error, setError] = useState('');

  function handleChange(e) {
    onQueryChange(e.target.value);
    if (error) setError(''); // clear the message once the user starts fixing it
  }

  function handleSubmit(e) {
    e.preventDefault();
    const city = query.trim().replace(/\s+/g, ' ');
    const found = validate(city);
    setError(found);
    if (found) return;
    onSearch(city);
  }

  return (
    <form className="search" role="search" onSubmit={handleSubmit} noValidate>
      <div className="search__row">
        <label htmlFor="city-input" className="visually-hidden">City name</label>
        <input
          id="city-input"
          className="search__input"
          type="search"
          placeholder="Enter a city, e.g. Beirut"
          autoComplete="off"
          spellCheck="false"
          value={query}
          onChange={handleChange}
          readOnly={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? 'city-error' : undefined}
        />
        <button className="btn btn--primary" type="submit" disabled={disabled}>
          {disabled && <span className="btn__spinner" aria-hidden="true" />}
          <span>Search</span>
        </button>
      </div>
      {error && <p id="city-error" className="field-error">{error}</p>}
    </form>
  );
}
