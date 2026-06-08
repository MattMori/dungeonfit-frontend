import PageHeader from "../components/PageHeader";
import CampaignContinueCard from "../components/CampaignContinueCard";

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        eyebrow="A Taverna"
        title="Sua campanha continua."
        description="Retome sua crônica, acompanhe sua ficha e transforme ações reais em progresso de aventura."
      />

      <CampaignContinueCard />

      {/* 
        Mantenha abaixo deste comentário os cards e blocos que já existem no seu Dashboard atual:
        personagem, XP, missões, relíquias, ranking etc.

        Este arquivo é um guia seguro caso você queira colar manualmente.
        Se seu Dashboard atual já tem bastante lógica, NÃO substitua tudo.
        Apenas importe CampaignContinueCard e coloque <CampaignContinueCard /> logo após o PageHeader.
      */}
    </div>
  );
}
