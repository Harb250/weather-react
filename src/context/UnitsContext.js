import { createContext, useContext } from 'react';

// App-wide setting (°C / °F): a good fit for context.
// Value shape: { unit: 'C' | 'F', setUnit }
export const UnitsContext = createContext(null);

export function useUnits() {
  return useContext(UnitsContext);
}

// Formats a Celsius value in whichever unit the user picked.
export function formatTemp(celsius, unit) {
  const value = unit === 'F' ? celsius * 9 / 5 + 32 : celsius;
  return `${Math.round(value)}°`;
}
