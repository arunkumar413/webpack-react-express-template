import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Header } from "../components/Header";

const features = [
  ["01", "Your organization, connected", "Bring departments, people, and reporting lines together in one clear view."],
  ["02", "Access that makes sense", "Manage roles and resource permissions so everyone has the access they need."],
  ["03", "A smoother welcome", "Invite teammates from a CSV and help them get started with a personal invite code."],
  ["04", "An account you control", "Keep your profile current, change your password, and see your signed-in devices."],
];

const templateFeatures = [
  "React and React Router frontend",
  "Webpack development and production builds",
  "Express API with MongoDB and Mongoose",
  "Session-based authentication and protected routes",
  "Organizations, departments, employees, roles, and permissions",
  "CSV team invites and password recovery",
];

export function Home() {
  const signedIn = useSelector((state) => state.auth.isLoggedin);
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        <section className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">A little more organized</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">A shared space for<br />your people and teams.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-500">Less administration, more clarity. Keep your organization connected with thoughtful tools for people, permissions, and everyday work.</p>
          <Link className="mt-8 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-hover" to={signedIn ? "/profile" : "/register"}>
            {signedIn ? "Open your workspace" : "Create your workspace"}<span aria-hidden="true" className="ml-3">→</span>
          </Link>
        </section>
        <section aria-label="Workspace features" className="mt-14 grid gap-5 sm:grid-cols-2">
          {features.map(([number, title, description]) => (
            <article key={number} className="rounded-2xl border border-slate-200 bg-surface p-7 shadow-sm">
              <span className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-semibold text-primary">{number}</span>
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{description}</p>
            </article>
          ))}
        </section>
        <section aria-labelledby="template-features-title" className="mt-5 rounded-2xl border border-slate-200 bg-surface p-7 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Built for a fast start</p>
              <h2 id="template-features-title" className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Everything this template includes</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-500">A practical foundation for building an internal team workspace.</p>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {templateFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                <span aria-hidden="true" className="mt-0.5 text-primary">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
