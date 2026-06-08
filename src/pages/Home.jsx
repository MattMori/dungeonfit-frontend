import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Dumbbell,
  ScrollText,
  Shield,
  Sparkles,
  Sword,
} from "lucide-react";

import { BRAND } from "../config/brand";

import "../styles/home-campaign.css";

const howItWorks = [
  {
    number: "01",
    title: "Crie sua ficha",
    description:
      "Monte seu personagem, escolha sua identidade e entre no Cronarium com uma ficha viva.",
  },
  {
    number: "02",
    title: "Escolha uma campanha",
    description:
      "Jogue capítulos solo com decisões, testes e consequências baseadas na sua ficha.",
  },
  {
    number: "03",
    title: "Complete missões reais",
    description:
      "Treinos em casa, foco, estudo e pequenas ações do mundo real movem sua jornada.",
  },
  {
    number: "04",
    title: "Desbloqueie o próximo capítulo",
    description:
      "Ganhe XP, relíquias e memória da campanha enquanto sua crônica continua.",
  },
];

const missionCards = [
  {
    icon: Dumbbell,
    title: "Ritual de Vigor",
    description: "Treino em casa",
    reward: "+80 XP",
  },
  {
    icon: BookOpen,
    title: "Leitura do Tomo",
    description: "Estudo ou leitura",
    reward: "+90 XP",
  },
  {
    icon: Sparkles,
    title: "Pausa Consciente",
    description: "Foco mental",
    reward: "+70 XP",
  },
];

export default function Home() {
  return (
    <main className="home-campaign-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="eyebrow">{BRAND.name}</span>

          <h1>Viva uma campanha mesmo sem mesa.</h1>

          <p>
            Crie sua ficha, tome decisões e avance capítulos com missões reais,
            treinos em casa e escolhas que moldam sua história.
          </p>

          <div className="home-actions">
            <Link className="primary-button" to="/campanhas">
              Começar campanha
              <ArrowRight size={18} />
            </Link>

            <Link className="ghost-button" to="/personagem">
              Criar minha ficha
            </Link>
          </div>

          <div className="home-mini-tags">
            <span>Campanhas solo</span>
            <span>Ficha viva</span>
            <span>Missões reais</span>
          </div>
        </div>

        <aside className="campaign-preview-card">
          <div className="campaign-preview-card-inner">
            <span className="card-kicker">Campanha em andamento</span>

            <h2>O Sino dos Esquecidos</h2>

            <p>
              Uma fantasia sombria sobre memória, perseverança e escolhas que
              ecoam além da mesa.
            </p>

            <div className="campaign-preview-progress">
              <div />
            </div>

            <div className="campaign-preview-stats">
              <article>
                <strong>5</strong>
                <span>Capítulos</span>
              </article>
              <article>
                <strong>Solo</strong>
                <span>Experiência</span>
              </article>
              <article>
                <strong>XP</strong>
                <span>Progressão real</span>
              </article>
            </div>

            <div className="campaign-preview-mission">
              <Dumbbell size={18} />
              <div>
                <strong>Missão real</strong>
                <span>Ritual de Vigor · 15 min</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="home-section home-split">
        <div>
          <span className="eyebrow">A proposta</span>
          <h2>RPG solo. Evolução real.</h2>
          <p>
            Cronarium transforma sua rotina em progresso de campanha. Você joga
            capítulos, encara escolhas e usa ações reais para fortalecer seu
            personagem.
          </p>

          <ul className="home-check-list">
            <li>
              <Shield size={16} />
              Ficha viva com progressão persistente
            </li>
            <li>
              <ScrollText size={16} />
              Campanhas solo para jogar sem depender de mesa
            </li>
            <li>
              <Sword size={16} />
              Escolhas, testes, relíquias e consequências
            </li>
          </ul>
        </div>

        <div className="lore-card">
          <span className="card-kicker">Cronarium</span>
          <h3>A mesa não apareceu. A campanha continua.</h3>
          <p>
            Entre na Taverna, retome sua crônica e transforme pequenas vitórias
            reais em avanço narrativo.
          </p>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <span className="eyebrow">Como funciona</span>
          <h2>Um loop simples que dá vontade de continuar.</h2>
          <p>
            Não é só registrar tarefas. É sentir que sua história está andando.
          </p>
        </div>

        <div className="how-flow-grid">
          {howItWorks.map((step) => (
            <article className="how-flow-card" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-split reverse">
        <div>
          <span className="eyebrow">Missões reais</span>
          <h2>Seu personagem evolui quando você age fora da tela.</h2>
          <p>
            Treinar em casa é parte da proposta, mas não a única. Estudo,
            organização, foco mental, escrita e ações sociais também podem
            mover a campanha.
          </p>
        </div>

        <div className="mission-preview-grid">
          {missionCards.map(({ icon: Icon, title, description, reward }) => (
            <article className="mission-preview-card" key={title}>
              <div className="mission-preview-icon">
                <Icon size={20} />
              </div>

              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>

              <strong>{reward}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="home-final-cta">
        <div>
          <span className="eyebrow">{BRAND.name}</span>
          <h2>A mesa não apareceu. A campanha continua.</h2>
          <p>
            Crie sua ficha, escolha uma campanha e transforme ação real em
            aventura.
          </p>
        </div>

        <Link className="primary-button" to="/campanhas">
          Entrar na Taverna
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
