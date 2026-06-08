import { Flame } from "lucide-react";

import "../../styles/retention.css";

export default function StreakCard({ streak }) {
  return (
    <section className="streak-card">
      <div>
        <span className="eyebrow">Sequência</span>
        <h2>{streak?.current_streak || 0} dias</h2>
        <p>Maior sequência: {streak?.longest_streak || 0} dias.</p>
      </div>

      <Flame size={42} />
    </section>
  );
}
