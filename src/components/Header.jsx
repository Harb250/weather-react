import UnitToggle from './UnitToggle.jsx';

export default function Header() {
  return (
    <header className="site-header">
      <div>
        <p className="eyebrow"><span className="prompt">&gt;_</span> assignment 05 · react</p>
        <h1>Weather Dashboard</h1>
      </div>
      <UnitToggle />
    </header>
  );
}
