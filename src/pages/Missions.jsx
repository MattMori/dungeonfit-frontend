import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";

export default function Missions() {
  return (
    <div>
      <PageHeader
        eyebrow="Missões"
        title="Missões"
        description="Complete atividades físicas, mentais e de RPG para ganhar XP e avançar na campanha."
      />

      <EmptyState
        title="Missões em preparação."
        description="Em breve esta tela vai listar atividades diárias, desafios físicos e recompensas de XP."
      />
    </div>
  );
}
