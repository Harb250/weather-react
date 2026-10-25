import Card from './Card.jsx';
import ForecastDay from './ForecastDay.jsx';

export default function Forecast({ days }) {
  if (days.length === 0) return null;

  return (
    <Card title={`${days.length}-day forecast`}>
      <ol className="forecast">
        {days.map((day, i) => (
          <ForecastDay key={day.date} day={day} isToday={i === 0} />
        ))}
      </ol>
    </Card>
  );
}
