import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="auth-shell dungeon-gate">
      <section className="auth-brand">
        <div className="sigil">
          <span>DF</span>
        </div>

        <span className="eyebrow">DungeonFit</span>

        <h1>
          Entre na dungeon.
          <br />
          Evolua fora dela.
        </h1>

        <p>
          Treinos, hábitos e sessões de RPG viram XP, atributos, relíquias e
          progresso real. Seu corpo é a campanha. Sua ficha sente o impacto.
        </p>

        <div className="lore-strip">
          <span>Força</span>
          <span>Destreza</span>
          <span>Constituição</span>
          <span>Sabedoria</span>
        </div>
      </section>

      <section className="auth-card parchment-card">
        <Outlet />
      </section>
    </main>
  );
}
