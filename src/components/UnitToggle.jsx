import { useUnits } from '../context/UnitsContext.js';

// Reads and changes the unit straight from context; Header never touches it.
export default function UnitToggle() {
  const { unit, setUnit } = useUnits();

  return (
    <div className="units" role="group" aria-label="Temperature unit">
      {['C', 'F'].map((u) => (
        <button
          key={u}
          type="button"
          className={unit === u ? 'units__btn is-active' : 'units__btn'}
          aria-pressed={unit === u}
          onClick={() => setUnit(u)}
        >
          °{u}
        </button>
      ))}
    </div>
  );
}
