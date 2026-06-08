import { Footprints, Shield, Swords } from "lucide-react";

import "../../styles/combat.css";

export default function CombatActionBar({ disabled, onAction }) {
  return (
    <section className="combat-action-bar">
      <button className="primary-button" type="button" disabled={disabled} onClick={() => onAction("attack")}>
        <Swords size={18} />
        Atacar
      </button>

      <button className="ghost-button" type="button" disabled={disabled} onClick={() => onAction("defend")}>
        <Shield size={18} />
        Defender
      </button>

      <button className="ghost-button danger" type="button" disabled={disabled} onClick={() => onAction("escape")}>
        <Footprints size={18} />
        Fugir
      </button>
    </section>
  );
}
