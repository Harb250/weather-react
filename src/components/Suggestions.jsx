export default function Suggestions({ cities, onPick, disabled }) {
  return (
    <div className="suggestions">
      <span>Try:</span>
      {cities.map((city) => (
        <button key={city} type="button" disabled={disabled} onClick={() => onPick(city)}>
          {city}
        </button>
      ))}
    </div>
  );
}
