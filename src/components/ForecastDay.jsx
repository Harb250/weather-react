import { useUnits, formatTemp } from '../context/UnitsContext.js';
import WeatherIcon from './WeatherIcon.jsx';

const dayFmt = new Intl.DateTimeFormat('en', { weekday: 'short', timeZone: 'UTC' });

export default function ForecastDay({ day, isToday }) {
  const { unit } = useUnits();
  const name = isToday ? 'Today' : dayFmt.format(new Date(`${day.date}T12:00Z`));

  return (
    <li className="day">
      <span className="day__name">{name}</span>
      <WeatherIcon className="day__icon" code={day.icon} alt={day.description} size={56} />
      <span className="day__temps">
        <strong>{formatTemp(day.max, unit)}</strong>
        <span>{formatTemp(day.min, unit)}</span>
      </span>
    </li>
  );
}
