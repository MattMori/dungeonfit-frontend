import { Skull } from "lucide-react";

import "../../styles/combat.css";

export default function EnemyCard({ enemy, selected, onSelect }) {
  const percent = Math.max(0, Math.round((enemy.hp_current / enemy.hp_max) * 100));

  return (
    <button
      className={`combat-enemy-card ${selected ? "selected" : ""} ${enemy.defeated ? "defeated" : ""}`}
      type="button"
      disabled={enemy.defeated}
      onClick={() => onSelect(enemy.instance_id)}
    >
      <div className="combat-enemy-icon">
        <Skull size={22} />
      </div>

      <div>
        <strong>{enemy.name}</strong>
        <span>CA {enemy.armor_class} · {enemy.damage_dice}</span>

        <div className="combat-hp-track">
          <div style={{ width: `${percent}%` }} />
        </div>

        <small>
          {enemy.hp_current}/{enemy.hp_max} HP
        </small>
      </div>
    </button>
  );
}
