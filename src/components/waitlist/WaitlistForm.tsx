"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";

type Interest = "DWG" | "GPKG" | "KMZ";

const storageKey = "geocad-waitlist-interest";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [useCase, setUseCase] = useState("");
  const [interest, setInterest] = useState<Interest>("DWG");
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = { email, useCase, interest, createdAt: new Date().toISOString() };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    setSubmitted(true);
  }

  return (
    <form className="waitlist-form" onSubmit={submit}>
      <label className="field-label">
        Beta format
        <select value={interest} onChange={(event) => setInterest(event.target.value as Interest)}>
          <option value="DWG">DWG</option>
          <option value="GPKG">GPKG</option>
          <option value="KMZ">KMZ</option>
        </select>
      </label>
      <label className="field-label">
        Email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" />
      </label>
      <label className="field-label">
        Use case
        <textarea value={useCase} onChange={(event) => setUseCase(event.target.value)} rows={4} placeholder="Tell us what you need to convert." />
      </label>
      <Button type="submit">Join beta waitlist</Button>
      <p className="muted">
        This launch build stores your entry in this browser only unless a waitlist provider is configured later.
      </p>
      {submitted ? <strong className="form-success">Saved locally. Thanks for the beta signal.</strong> : null}
    </form>
  );
}
