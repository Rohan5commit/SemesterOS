"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { demoProfiles, fallbackPlan, StudentProfile, Task } from "@/data/demo";

type Plan = typeof fallbackPlan & { source?: string };
const tabs = ["Overview", "Timeline", "Planner", "Focus", "Milestones"] as const;

export function SemesterOSApp() {
  const [profile, setProfile] = useState<StudentProfile>(demoProfiles[0]);
  const [onboarded, setOnboarded] = useState(false);
  const [active, setActive] = useState<(typeof tabs)[number]>("Overview");
  const [plan, setPlan] = useState<Plan>(fallbackPlan);
  const [loading, setLoading] = useState(false);

  const sortedTasks = useMemo(() => [...profile.tasks].sort((a, b) => +new Date(a.due) - +new Date(b.due)), [profile.tasks]);
  const workload = useMemo(() => profile.availability.map((d, i) => Math.max(2, Math.min(10, d.hours + Math.round((profile.tasks[i % profile.tasks.length]?.hours ?? 3) / 2)))), [profile]);

  async function generatePlan() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tasks: profile.tasks, availability: profile.availability, goals: profile.goals }) });
      setPlan(await res.json());
    } finally {
      setLoading(false);
    }
  }

  if (!onboarded) return <Onboarding onStart={(p) => { setProfile(p); setOnboarded(true); }} />;

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-6 md:px-8">
      <section className="glass rounded-3xl p-7 shadow-glow md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-aurora">SemesterOS · {profile.semester}</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">{profile.name}&apos;s Student OS</h1>
            <p className="mt-2 text-white/70">{profile.major} · CELL mode ready for deep work</p>
          </div>
          <div className="flex gap-2">
            <select className="rounded-xl bg-white/10 p-2 text-sm" onChange={(e) => setProfile(demoProfiles.find((p) => p.id === e.target.value) ?? demoProfiles[0])} value={profile.id}>
              {demoProfiles.map((p) => <option key={p.id} value={p.id}>{p.name} Demo</option>)}
            </select>
            <button className="rounded-xl bg-white/10 px-3 text-sm" onClick={() => setOnboarded(false)}>Reset</button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`rounded-full px-4 py-2 text-sm ${active === tab ? "bg-white text-ink" : "bg-white/10 hover:bg-white/20"}`}>{tab}</button>)}
          <button onClick={generatePlan} className="rounded-full bg-gradient-to-r from-aurora to-lilac px-5 py-2 text-sm font-medium text-ink">{loading ? "Generating plan…" : "Generate AI Plan"}</button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Workload Heatmap"><Heatmap load={workload} days={profile.availability.map((x) => x.day)} /></Card>
        <Card title="Priority Queue"><Priority tasks={profile.tasks} /></Card>
        <Card title="Milestone Pulse"><p className="text-4xl font-semibold text-mint">{68 + profile.tasks.length}%</p><p className="text-sm text-white/65">Momentum index · live</p></Card>
      </section>

      <motion.section key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 md:p-8">
        {loading ? <LoadingState /> : null}
        {!loading && active === "Overview" && <Overview plan={plan} goals={profile.goals} />}
        {!loading && active === "Timeline" && <Timeline tasks={sortedTasks} />}
        {!loading && active === "Planner" && <Planner plan={plan} />}
        {!loading && active === "Focus" && <Focus />}
        {!loading && active === "Milestones" && <Milestones tasks={profile.tasks} />}
      </motion.section>
    </main>
  );
}

function Onboarding({ onStart }: { onStart: (profile: StudentProfile) => void }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(demoProfiles[0].id);
  const profile = demoProfiles.find((p) => p.id === selected) ?? demoProfiles[0];
  const steps = ["Select Student", "Review Courses", "Launch OS"];
  return <main className="mx-auto max-w-5xl px-6 py-12"><section className="glass rounded-3xl p-8 md:p-12"><p className="text-xs uppercase tracking-[0.25em] text-aurora">Onboarding</p><h1 className="mt-2 text-4xl font-semibold">Build your semester command center</h1><p className="mt-3 text-white/70">Step {step + 1}/3 · {steps[step]}</p><div className="mt-8 grid gap-4 md:grid-cols-2">{demoProfiles.map((p)=><button key={p.id} onClick={()=>setSelected(p.id)} className={`rounded-2xl border p-5 text-left ${selected===p.id?"border-aurora bg-white/10":"border-white/20 bg-white/5"}`}><p className="text-lg">{p.name}</p><p className="text-sm text-white/60">{p.major}</p></button>)}</div><div className="mt-6 rounded-xl bg-white/5 p-4 text-sm text-white/75">Courses: {profile.courses.join(", ")}<br/>Goals: {profile.goals.join(" · ")}</div><div className="mt-8 flex gap-3"><button onClick={()=>setStep((v)=>Math.min(v+1,2))} className="rounded-full bg-white/10 px-5 py-2">Next</button><button onClick={()=>onStart(profile)} className="rounded-full bg-gradient-to-r from-aurora to-lilac px-5 py-2 text-ink">Launch SemesterOS</button></div></section></main>;
}

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => <article className="glass rounded-2xl p-5"><h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-white/70">{title}</h3>{children}</article>;
const LoadingState = () => <div className="mb-4 animate-pulse rounded-xl bg-white/10 p-4 text-sm text-white/60">AI is generating a realistic weekly action plan…</div>;
const Priority = ({ tasks }: { tasks: Task[] }) => tasks.length === 0 ? <p className="text-sm text-white/60">No tasks yet. Add a deadline to activate the planner.</p> : <ul className="space-y-2 text-sm">{[...tasks].sort((a,b)=>b.hours-a.hours).slice(0,4).map((t)=><li key={t.id} className="rounded-lg bg-white/5 px-3 py-2">{t.title}<span className="text-white/50"> · {t.hours}h</span></li>)}</ul>;
const Heatmap = ({ load, days }: { load: number[]; days: string[] }) => <div className="grid grid-cols-7 gap-2">{load.map((h,i)=><div key={days[i]} className="flex flex-col items-center gap-1"><div className="h-16 w-full rounded-xl" style={{background:`rgba(116,240,196,${0.18+h/12})`}} /><p className="text-[10px] text-white/50">{days[i]}</p></div>)}</div>;
const Overview = ({ plan, goals }: { plan: Plan; goals: string[] }) => <div className="space-y-4"><h2 className="text-2xl font-medium">Workload Intelligence <span className="text-sm text-white/50">({plan.source ?? "fallback"})</span></h2><p className="text-white/80">{plan.summary}</p><div className="grid gap-4 md:grid-cols-2"><ul className="space-y-2">{plan.priorities.map((p,i)=><li key={i} className="rounded-lg bg-white/5 p-3">{p}</li>)}</ul><div className="rounded-xl bg-white/5 p-4"><p className="text-sm uppercase text-white/60">Personal goals</p><ul className="mt-2 space-y-2 text-sm">{goals.map((g,i)=><li key={i}>• {g}</li>)}</ul></div></div></div>;
const Timeline = ({ tasks }: { tasks: Task[] }) => tasks.length === 0 ? <p className="text-white/60">Timeline empty — add tasks in onboarding.</p> : <div className="space-y-3">{tasks.map((t)=><div key={t.id} className="rounded-xl bg-white/5 p-4"><div className="flex items-center justify-between"><p>{t.title}</p><span className="rounded-full bg-white/10 px-3 py-1 text-xs">{t.due}</span></div><p className="mt-1 text-sm text-white/60">{t.course} · {t.type} · {t.hours}h</p></div>)}</div>;
const Planner = ({ plan }: { plan: Plan }) => <div><h2 className="text-2xl">Weekly Action Plan</h2><ul className="mt-4 space-y-2">{plan.weekly.map((w,i)=><li key={i} className="rounded-xl bg-white/5 p-3">{w}</li>)}</ul></div>;
const Focus = () => <div className="text-center"><p className="text-xs uppercase tracking-[0.25em] text-aurora">Focus CELL</p><p className="mt-5 text-6xl font-semibold">25:00</p><p className="mt-2 text-white/60">Deep work sprint · notifications silenced</p><div className="mx-auto mt-6 h-2 max-w-md rounded-full bg-white/10"><div className="h-2 w-1/3 rounded-full bg-gradient-to-r from-mint to-aurora" /></div></div>;
const Milestones = ({ tasks }: { tasks: Task[] }) => <div className="grid gap-3 md:grid-cols-3">{tasks.slice(0,3).map((t)=> <div key={t.id} className="rounded-xl bg-white/5 p-4"><p>{t.title}</p><p className="text-sm text-mint">On track</p></div>)}</div>;
