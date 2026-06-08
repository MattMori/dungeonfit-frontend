import { Check, Flag, X } from "lucide-react";

import "../../styles/admin.css";

export default function ModerationActions({ disabled, onApprove, onReject, onFlag }) {
  return (
    <div className="moderation-actions">
      <button className="ghost-button" type="button" disabled={disabled} onClick={onApprove}>
        <Check size={16} />
        Aprovar
      </button>

      <button className="ghost-button danger" type="button" disabled={disabled} onClick={onReject}>
        <X size={16} />
        Rejeitar
      </button>

      <button className="ghost-button warning" type="button" disabled={disabled} onClick={onFlag}>
        <Flag size={16} />
        Sinalizar
      </button>
    </div>
  );
}
