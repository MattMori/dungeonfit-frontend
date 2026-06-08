import { Sparkles } from "lucide-react";

import "../../styles/progression.css";

export default function UnlockedFeatureList({ features = [], emptyText = "Nenhuma característica nova neste nível." }) {
  return (
    <section className="unlocked-feature-list">
      {features.length ? (
        features.map((feature) => (
          <article key={feature}>
            <Sparkles size={18} />
            <span>{feature}</span>
          </article>
        ))
      ) : (
        <p>{emptyText}</p>
      )}
    </section>
  );
}
