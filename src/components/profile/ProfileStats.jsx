import { BookOpen, Flame, ScrollText, Swords } from "lucide-react";

import "../../styles/profile.css";

export default function ProfileStats({ stats }) {
  const items = [
    {
      label: "Sequência atual",
      value: stats?.streak?.current_streak || 0,
      icon: <Flame size={24} />,
    },
    {
      label: "Campanhas concluídas",
      value: stats?.campaigns?.completed || 0,
      icon: <BookOpen size={24} />,
    },
    {
      label: "Combates vencidos",
      value: stats?.combats?.won || 0,
      icon: <Swords size={24} />,
    },
    {
      label: "Crônicas",
      value: stats?.chronicles?.total || 0,
      icon: <ScrollText size={24} />,
    },
  ];

  return (
    <section className="profile-stats-grid">
      {items.map((item) => (
        <article key={item.label}>
          <div>{item.icon}</div>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  );
}
