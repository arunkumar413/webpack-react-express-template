import React from "react";
import { Header } from "../components/Header";

export function Contact() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <section className="max-w-2xl rounded-2xl border border-slate-200 bg-surface p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Contact</h1>
          <p className="mt-4 leading-7 text-slate-500">Get in touch with your organization administrator for account and workspace support.</p>
        </section>
      </main>
    </div>
  );
}
