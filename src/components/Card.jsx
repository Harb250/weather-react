// Layout wrapper: draws the frame, the parent decides what goes inside.
export default function Card({ title, className = '', children }) {
  return (
    <article className={`card ${className}`.trim()}>
      {title && <h3 className="card__label">{title}</h3>}
      {children}
    </article>
  );
}
