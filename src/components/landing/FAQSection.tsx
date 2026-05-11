import { homepageFaqs } from "@/data/faqs";

export function FAQSection() {
  return (
    <section className="content-section faq-section">
      <div className="section-heading">
        <span className="section-kicker">FAQ</span>
        <h2>Practical answers for launch users</h2>
      </div>
      <div className="faq-list">
        {homepageFaqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
