export interface FaqItem { question: string; answer: string }

export function Faq({ items, id = "faq" }: { items: FaqItem[]; id?: string }) {
  return (
    <section className="content-section faq-section" aria-labelledby={`${id}-heading`}>
      <div className="content-heading">
        <span className="eyebrow">COMMON QUESTIONS</span>
        <h2 id={`${id}-heading`}>Frequently asked questions</h2>
      </div>
      <div className="faq-list">
        {items.map((item) => (
          <details key={item.question} className="faq-item">
            <summary>{item.question}<span aria-hidden="true">＋</span></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
