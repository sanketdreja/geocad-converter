import { AlertTriangle } from "lucide-react";
import type { ConversionError } from "@/models/ErrorTypes";

export function ErrorExplainer({ error }: { error: ConversionError }) {
  return (
    <div className="error-explainer">
      <div className="error-icon">
        <AlertTriangle size={18} />
      </div>
      <div>
        <h3>{error.title}</h3>
        <p>{error.userMessage}</p>
        <div className="suggestion-list">
          {error.suggestions.map((suggestion) => (
            <span key={suggestion}>{suggestion}</span>
          ))}
        </div>
        {error.technicalMessage ? (
          <details>
            <summary>View technical log</summary>
            <code>{error.technicalMessage}</code>
          </details>
        ) : null}
      </div>
    </div>
  );
}
