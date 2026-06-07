import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Crown,
  Dumbbell,
  Flame,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";

import "../styles/home.css";

const steps = [
  {
    icon: <ScrollText size={24} />,
    title: "Crie sua ficha",
    description:
      "Monte um personagem inspirado em D&D 5e 2014, com raça, classe, antecedente e atributos.",
  },
  {
    icon: <Dumbbell size={24} />,
    title: "Complete missões",
    description:
      "Treinos físicos, hábitos e desafios diários viram missões dentro da sua jornada.",
  },
  {
    icon: <Sparkles size={24} />,
    title: "Ganhe XP",
    description:
      "Cada missão concluída gera progresso, experiência e recompensas para seu personagem.",
  },
  {
    icon: <Crown size={24} />,
    title: "Evolua",
    description:
      "Suba de nível, desbloqueie relíquias e veja seu esforço real virar evolução épica.",
  },
];

const missions = [
  {
    title: "Ritual de Força",
    type: "Membros superiores",
    reward: "+50 XP",
    icon: <Swords size={22} />,
  },
  {
    title: "Caminho do Peregrino",
    type: "Cardio leve",
    reward: "+35 XP",
    icon: <Flame size={22} />,
  },
  {
    title: "Meditação Arcana",
    type: "Foco mental",
    reward: "+25 XP",
    icon: <BookOpen size={22} />,
  },
];

const differences = [
  {
    title: "Não é só treino",
    description:
      "Cada atividade alimenta uma progressão narrativa, com XP, missões e recompensas.",
  },
  {
    title: "Não é só RPG",
    description:
      "Seu personagem evolui com ações reais, não apenas com números imaginários.",
  },
  {
    title: "Não é só gamificação",
    description:
      "A ficha cria identidade, continuidade e vontade de voltar para a próxima missão.",
  },
];

export default function Home() {
  return (
    <main className="home-page">
      <header className="home-navbar">
        <Link className="home-brand" to="/">
          <span className="home-brand-mark">☠</span>

          <div>
            <strong>DungeonFit</strong>
            <small>Treino, RPG e evolução real</small>
          </div>
        </Link>

        <nav className="home-nav">
          <a href="#como-funciona">Como funciona</a>
          <a href="#ficha">Ficha</a>
          <a href="#missoes">Missões</a>
        </nav>

        <div className="home-actions">
          <Link className="home-login-link" to="/login">
            Entrar
          </Link>

          <Link className="home-primary-small" to="/cadastro">
            Criar conta
          </Link>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-eyebrow">A campanha começa no mundo real</span>

          <h1>
            Entre na dungeon.
            <br />
            Evolua fora dela.
          </h1>

          <p>
            DungeonFit transforma treinos, hábitos e sessões de RPG em XP,
            atributos, relíquias e evolução real. Crie sua ficha, complete
            missões físicas e veja seu personagem crescer junto com você.
          </p>

          <div className="home-hero-buttons">
            <Link className="home-primary-button" to="/cadastro">
              Começar minha ficha
              <ArrowRight size={19} />
            </Link>

            <a className="home-secondary-button" href="#como-funciona">
              Ver como funciona
            </a>
          </div>

          <div className="home-hero-proof">
            <div>
              <strong>Ficha 5e</strong>
              <span>Base fiel à 2014</span>
            </div>

            <div>
              <strong>XP real</strong>
              <span>Por missões</span>
            </div>

            <div>
              <strong>Solo ou mesa</strong>
              <span>Jogue no seu ritmo</span>
            </div>
          </div>
        </div>

        <aside className="home-character-preview">
          <div className="home-character-glow" />

          <div className="home-character-header">
            <div className="home-character-token">
              <Shield size={34} />
            </div>

            <div>
              <span>Ficha selada</span>
              <h2>Erehiel</h2>
              <p>Tiefling · Bruxo · Nível 1</p>
            </div>
          </div>

          <div className="home-stat-row">
            <article>
              <span>CA</span>
              <strong>10</strong>
            </article>

            <article>
              <span>HP</span>
              <strong>10</strong>
            </article>

            <article>
              <span>XP</span>
              <strong>120</strong>
            </article>
          </div>

          <div className="home-attributes-preview">
            <div>
              <span>FOR</span>
              <strong>08</strong>
              <small>-1</small>
            </div>

            <div>
              <span>DES</span>
              <strong>10</strong>
              <small>+0</small>
            </div>

            <div>
              <span>CON</span>
              <strong>14</strong>
              <small>+2</small>
            </div>

            <div>
              <span>INT</span>
              <strong>13</strong>
              <small>+1</small>
            </div>

            <div>
              <span>SAB</span>
              <strong>14</strong>
              <small>+2</small>
            </div>

            <div>
              <span>CAR</span>
              <strong>16</strong>
              <small>+3</small>
            </div>
          </div>

          <div className="home-active-mission">
            <div>
              <span>Missão ativa</span>
              <strong>Ritual de Força</strong>
              <p>Complete o treino e receba +50 XP.</p>
            </div>

            <Trophy size={26} />
          </div>
        </aside>
      </section>

      <section className="home-section" id="como-funciona">
        <div className="home-section-header">
          <span className="home-eyebrow">Como funciona</span>
          <h2>Seu treino vira progressão.</h2>
          <p>
            A lógica é simples: você age no mundo real, o personagem evolui no
            DungeonFit.
          </p>
        </div>

        <div className="home-steps-grid">
          {steps.map((step, index) => (
            <article className="home-step-card" key={step.title}>
              <div className="home-step-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="home-step-icon">{step.icon}</div>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-sheet-section" id="ficha">
        <div className="home-sheet-copy">
          <span className="home-eyebrow">Ficha do herói</span>

          <h2>Sua evolução, em forma de ficha.</h2>

          <p>
            A ficha do DungeonFit não é enfeite. Ela registra sua origem,
            atributos, XP, recompensas, missões e progresso. A base é selada; a
            evolução acontece com suas ações.
          </p>

          <ul>
            <li>
              <CheckCircle2 size={18} />
              Criação fiel à D&D 5e 2014
            </li>

            <li>
              <CheckCircle2 size={18} />
              Atributos base e finais separados
            </li>

            <li>
              <CheckCircle2 size={18} />
              XP, CA, HP, perícias e salvaguardas calculados
            </li>
          </ul>
        </div>

        <div className="home-sheet-card">
          <div className="home-sheet-card-top">
            <span>DungeonFit Sheet</span>
            <strong>D&D 5e 2014</strong>
          </div>

          <div className="home-sheet-name">
            <h3>Erehiel</h3>
            <p>Tiefling · Bruxo · Charlatão</p>
          </div>

          <div className="home-sheet-bars">
            <div>
              <span>Experiência</span>
              <strong>120 / 300</strong>
            </div>

            <div className="home-progress-bar">
              <span style={{ width: "40%" }} />
            </div>
          </div>

          <div className="home-sheet-list">
            <div>
              <span>Proficiências</span>
              <strong>Arcanismo, Intimidação, Enganação</strong>
            </div>

            <div>
              <span>Habilidades</span>
              <strong>Patrono Sobrenatural, Magia de Pacto</strong>
            </div>

            <div>
              <span>Equipamento inicial</span>
              <strong>Kit de Disfarce, cartas falsas</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" id="missoes">
        <div className="home-section-header">
          <span className="home-eyebrow">Missões físicas</span>

          <h2>Você não conclui um treino. Você vence uma cena.</h2>

          <p>
            Cada missão tem uma proposta física ou mental, recompensa em XP e
            impacto direto na progressão.
          </p>
        </div>

        <div className="home-missions-grid">
          {missions.map((mission) => (
            <article className="home-mission-card" key={mission.title}>
              <div className="home-mission-icon">{mission.icon}</div>

              <div>
                <h3>{mission.title}</h3>
                <p>{mission.type}</p>
              </div>

              <strong>{mission.reward}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="home-difference-section">
        <div className="home-section-header">
          <span className="home-eyebrow">Por que é diferente</span>

          <h2>Fitness com alma de campanha.</h2>

          <p>
            DungeonFit não tenta ser só mais um contador de hábitos. Ele dá
            identidade para o esforço.
          </p>
        </div>

        <div className="home-difference-grid">
          {differences.map((item) => (
            <article className="home-difference-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-future-section">
        <span className="home-eyebrow">Visão futura</span>

        <h2>Para quem ama RPG, mesmo sem mesa fixa.</h2>

        <p>
          Use sua ficha em sessões reais ou evolua sozinho com missões diárias.
          No futuro, campanhas solo e histórias jogáveis poderão transformar sua
          rotina em uma aventura completa.
        </p>
      </section>

      <section className="home-final-cta">
        <div>
          <span className="home-eyebrow">Sua próxima missão começa agora</span>

          <h2>Crie sua ficha. Escolha sua classe. Comece a evoluir.</h2>
        </div>

        <Link className="home-primary-button" to="/cadastro">
          Criar conta grátis
          <ArrowRight size={19} />
        </Link>
      </section>
    </main>
  );
}
