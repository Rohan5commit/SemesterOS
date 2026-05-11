"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fallbackPlan, profile, tasks } from "@/data/demo";

type Plan = typeof fallbackPlan & { source?: string };

const tabs = ["Overview", "Timeline", "Planner", "Focus", "Milestones"] as const;

export function SemesterOSApp() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Overview");
  const [plan, setPlan] = useState<Plan>(fallbackPlan);
  const [loading, setLoading] = useState(false);

  const weeklyLoad = useMemo(() => [8, 6, 9, 7, 5, 4, 3], []);

  async function generatePlan() {
    setLoading(true);
    const res = await fetch("/api/ai-plan", { method: "POST", body: JSON.stringify({ tasks }) });
    const data = await res.json();
    setPlan(data);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
      <section className="glass rounded-3xl p-8 shadow-glow">
        <p className="text-sm uppercase tracking-[0.22em] text-aurora">SemesterOS</p>
        <h1 className="mt-2 text-4xl font-semibold">{profile.name}&apos;s Student Operating System</h1>
        <p className="mt-3 max-w-2xl text-white/70">Design-forward command center for coursework, clubs, goals, and deep focus.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActive(tab)} className={`rounded-full px-4 py-2 text-sm ${active === tab ? "bg-white text-ink" : "bg-white/10 text-white"}`}>
              {tab}
            </button>
          ))}
          <button onClick={generatePlan} className="rounded-full bg-gradient-to-r from-aurora to-lilac px-5 py-2 text-sm font-medium text-ink">
            {loading ? "Generating…" : "AI Study Plan"}
          </button>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <Card title="Workload Heatmap">
          <div className="grid grid-cols-7 gap-2">
            {weeklyLoad.map((h, i) => <div key={i} className="h-16 rounded-xl" style={{ background: `rgba(116,240,196,${0.15 + h / 12})` }} />)}
          </div>
        </Card>
        <Card title="Priority Queue">
          <ul className="space-y-2 text-sm text-white/80">{tasks.sort((a,b)=>b.hours-a.hours).slice(0,4).map(t=><li key={t.id}>{t.title} · {t.priority}</li>)}</ul>
        </Card>
        <Card title="Milestone Pulse">
          <p className="text-4xl font-semibold text-mint">72%</p>
          <p className="text-sm text-white/65">Semester momentum index</p>
        </Card>
      </section>

      <motion.section initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} className="mt-6 glass rounded-2xl p-6">
        {active === "Timeline" && <Timeline />}
        {active === "Overview" && <Overview plan={plan} />}
        {active === "Planner" && <Planner plan={plan} />}
        {active === "Focus" && <Focus />}
        {active === "Milestones" && <Milestones />}
      </motion.section>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="glass rounded-2xl p-5"><h3 className="mb-3 text-sm uppercase tracking-wider text-white/70">{title}</h3>{children}</article>;
}

function Overview({ plan }: { plan: Plan }) {
  return <div><h2 className="text-2xl font-medium">AI Workload Brief {plan.source ? `· ${plan.source}` : ""}</h2><p className="mt-3 text-white/75">{plan.summary}</p><ul className="mt-4 space-y-2 text-white/80">{plan.priorities.map((p,i)=><li key={i}>• {p}</li>)}</ul></div>;
}
function Timeline() { return <div className="space-y-3">{tasks.map(t=><div className="rounded-xl bg-white/5 p-4" key={t.id}><div className="flex justify-between"><p>{t.title}</p><p className="text-white/60">{t.due}</p></div><p className="text-sm text-white/60">{t.course} · {t.type}</p></div>)}</div>; }
function Planner({ plan }: { plan: Plan }) { return <div><h2 className="text-2xl">Weekly Action Plan</h2><ul className="mt-4 space-y-2">{plan.weekly.map((w,i)=><li key={i} className="rounded-xl bg-white/5 p-3 text-white/80">{w}</li>)}</ul></div>; }
function Focus() { return <div className="text-center"><p className="text-sm uppercase tracking-[0.2em] text-aurora">Focus Mode</p><p className="mt-4 text-6xl font-semibold">25:00</p><p className="mt-2 text-white/60">Deep work block · Algorithms</p></div>; }
function Milestones() { return <div className="grid gap-3 md:grid-cols-3">{["Syllabus setup","First exam","Project MVP"].map((m,i)=><div key={i} className="rounded-xl bg-white/5 p-4"><p>{m}</p><p className="text-sm text-mint">On track</p></div>)}</div>; }
