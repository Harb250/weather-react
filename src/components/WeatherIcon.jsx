export default function WeatherIcon({ code, alt, size, className }) {
  return (
    <img
      className={className}
      src={`https://openweathermap.org/img/wn/${code}@2x.png`}
      alt={alt}
      width={size}
      height={size}
    />
  );
}
