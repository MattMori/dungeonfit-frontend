import { Link } from "react-router-dom";
import { Skull } from "lucide-react";

import BossProgressBar from "./BossProgressBar";

import "../../styles/retention.css";

export default function WeeklyBossCard({ data }) {
  if (!data?.boss) {
    return (
      <section className="weekly-boss-card">
        <div>
          <span className="eyebrow">Boss semanal</span>
          <h2>Nenhum boss ativo</h2>
          <p>O próximo desafio semanal ainda não foi invocado.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="weekly-boss-card">
      <div>
        <span className="eyebrow">Boss semanal</span>
        <h2>{data.boss.title}</h2>
        <p>{data.boss.description}</p>

        <BossProgressBar
          percent={data.damage_percent}
          label={`${data.progress?.damage_dealt || 0}/${data.boss.hp} dano`}
        />

        <Link className="primary-button" to="/boss-semanal">
          Enfrentar ciclo
        </Link>
      </div>

      <Skull size={48} />
    </section>
  );
}
