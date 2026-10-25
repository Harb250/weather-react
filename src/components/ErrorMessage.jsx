// Turns an ApiError into plain language, and says whether retrying could help.
function friendly(error, city) {
  switch (error?.kind) {
    case 'not-found':
      return [`We couldn't find a city called "${city}". Check the spelling and try again.`, false];
    case 'network':
      return ["Couldn't reach the weather service. Check your internet connection.", true];
    case 'timeout':
      return ['The weather service is taking too long to answer.', true];
    case 'rate-limit':
      return ['Too many requests right now. Wait a minute, then try again.', true];
    case 'server':
      return [`The weather service is having problems (HTTP ${error.status}). Try again shortly.`, true];
    default:
      return ['Something went wrong while loading the weather.', true];
  }
}

export default function ErrorMessage({ error, city, onRetry }) {
  const [message, canRetry] = friendly(error, city);

  return (
    <div className="status" data-state="error" role="alert">
      <span className="status__icon" aria-hidden="true" />
      <p className="status__text">{message}</p>
      {canRetry && (
        <button className="btn btn--ghost" type="button" onClick={onRetry}>Retry</button>
      )}
    </div>
  );
}
