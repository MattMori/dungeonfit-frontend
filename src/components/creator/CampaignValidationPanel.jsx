import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

import "../../styles/creator-pro.css";

export default function CampaignValidationPanel({ validation, onValidate, validating }) {
  if (!validation) {
    return (
      <section className="validation-panel">
        <div className="validation-heading">
          <ShieldAlert size={24} />
          <div>
            <span className="eyebrow">Validação</span>
            <h2>Valide a campanha antes de publicar.</h2>
          </div>
        </div>

        <p>
          O Cronarium verifica capítulos, escolhas, testes, missões reais e
          recompensas para evitar campanhas quebradas.
        </p>

        <button className="primary-button" type="button" onClick={onValidate} disabled={validating}>
          {validating ? "Validando..." : "Validar campanha"}
        </button>
      </section>
    );
  }

  const isValid = validation.valid;

  return (
    <section className={`validation-panel ${isValid ? "valid" : "invalid"}`}>
      <div className="validation-heading">
        {isValid ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}

        <div>
          <span className="eyebrow">{isValid ? "Pronta para publicar" : "Campanha incompleta"}</span>
          <h2>{validation.completion || 0}% de completude</h2>
        </div>
      </div>

      <div className="validation-summary-grid">
        <span>
          <strong>{validation.summary?.chapters_count || 0}</strong>
          Capítulos
        </span>
        <span>
          <strong>{validation.summary?.choices_count || 0}</strong>
          Escolhas
        </span>
        <span>
          <strong>{validation.summary?.errors || 0}</strong>
          Erros
        </span>
        <span>
          <strong>{validation.summary?.warnings || 0}</strong>
          Alertas
        </span>
      </div>

      {validation.issues?.length > 0 && (
        <div className="validation-issues">
          {validation.issues.map((issue, index) => (
            <article key={`${issue.code}-${index}`} className={issue.level}>
              <strong>{issue.level === "error" ? "Erro" : "Alerta"}</strong>
              <span>{issue.message}</span>
            </article>
          ))}
        </div>
      )}

      <button className="ghost-button" type="button" onClick={onValidate} disabled={validating}>
        {validating ? "Validando..." : "Validar novamente"}
      </button>
    </section>
  );
}
