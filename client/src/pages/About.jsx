import React from "react";
import { Header } from "../components/Header";

export function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <section className="max-w-2xl rounded-2xl border border-slate-200 bg-surface p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">About</h1>
          <p className="mt-4 leading-7 text-slate-500">A shared workspace to keep your people, teams, and access connected.</p>
        </section>
      </main>
    </div>
  );
}
