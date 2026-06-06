import { Check, Lock, Sparkles } from "lucide-react";
export default function RewardCard({ reward, unlocked = false, onUse }) {
  const id = reward?._id || reward?.id;
  return <article className={`reward-card ${unlocked ? "unlocked" : ""}`}><div className="reward-icon">{unlocked ? <Check size={22} /> : <Lock size={22} />}</div><div><span className="tag">{reward?.type || "recompensa"}</span><h3>{reward?.name || reward?.title || "Recompensa"}</h3>{reward?.description && <p>{reward.description}</p>}{reward?.requires_master_approval && <small>Uso sujeito à aprovação do Mestre.</small>}{unlocked && onUse && <button className="ghost-button small" onClick={() => onUse(id)}><Sparkles size={16} />Usar</button>}</div></article>;
}
