import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found">
      <span className="error-code">404</span>
      <div className="motif-ring small" aria-hidden="true"><span>?</span></div>
      <h1>This Pokémon got away.</h1>
      <p>The page you were looking for is not in this Pokédex.</p>
      <Link href="/" className="generate-button">Back to the generator</Link>
    </section>
  );
}
