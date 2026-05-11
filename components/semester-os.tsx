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

  const workload = useMemo(() => profile.availability.map((d) => Math.min(10, d.hours + Math.round(profile.tasks.length / 2))), [profile]);
  const sortedTasks = useMemo(() => [...profile.tasks].sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime()), [profile.tasks]);

  async function generatePlan() {
    setLoading(true);
    const res = await fetch("/api/ai-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks: profile.tasks, availability: profile.availability, goals: profile.goals })
    });
    const data = await res.json();
    setPlan(data);
    setLoading(false);
  }

  if (!onboarded) return <Onboarding onStart={(p) => { setProfile(p); setOnboarded(true); }} />;

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-6 md:px-8">
      <section className="glass rounded-3xl p-7 shadow-glow md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-aurora">SemesterOS · {profile.semester}</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-5xl">{profile.name}&apos;s Student Operating System</h1>
            <p className="mt-2 text-white/70">{profile.major} · {profile.courses.join(" · ")}</p>
          </div>
          <select className="rounded-xl bg-white/10 p-2 text-sm" onChange={(e) => setProfile(demoProfiles.find((p) => p.id === e.target.value) ?? demoProfiles[0])} value={profile.id}>
            {demoProfiles.map((p) => <option key={p.id} value={p.id}>{p.name} Demo</option>)}
          </select>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`rounded-full px-4 py-2 text-sm transition ${active === tab ? "bg-white text-ink" : "bg-white/10 hover:bg-white/20"}`}>{tab}</button>)}
          <button onClick={generatePlan} className="rounded-full bg-gradient-to-r from-aurora to-lilac px-5 py-2 text-sm font-medium text-ink">{loading ? "Generating…" : "AI Action Plan"}</button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card title="Workload Heatmap"><Heatmap load={workload} /></Card>
        <Card title="Priority Queue"><ul className="space-y-2 text-sm">{[...profile.tasks].sort((a,b)=>b.hours-a.hours).slice(0,4).map((t)=><li key={t.id} className="rounded-lg bg-white/5 px-3 py-2">{t.title}<span className="text-white/50"> · {t.hours}h</span></li>)}</ul></Card>
        <Card title="Milestone Pulse"><p className="text-4xl font-semibold text-mint">{68 + profile.tasks.length}%</p><p className="text-sm text-white/65">Momentum index · live</p></Card>
      </section>

      <motion.section key={active} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 md:p-8">
        {active === "Overview" && <Overview plan={plan} goals={profile.goals} />}
        {active === "Timeline" && <Timeline tasks={sortedTasks} />}
        {active === "Planner" && <Planner plan={plan} />}
        {active === "Focus" && <Focus />}
        {active === "Milestones" && <Milestones tasks={profile.tasks} />}
      </motion.section>
    </main>
  );
}

function Onboarding({ onStart }: { onStart: (profile: StudentProfile) => void }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(demoProfiles[0].id);
  return <main className="mx-auto max-w-4xl px-6 py-12"><section className="glass rounded-3xl p-8 md:p-12"><p className="text-xs uppercase tracking-[0.25em] text-aurora">Onboarding</p><h1 className="mt-2 text-4xl font-semibold">Build your semester command center</h1><p className="mt-3 text-white/70">Step {idx + 1}/3 · Courses → Deadlines → Availability</p><div className="mt-8 grid gap-4 md:grid-cols-2">{demoProfiles.map((p)=><button key={p.id} onClick={()=>setSelected(p.id)} className={`rounded-2xl border p-5 text-left ${selected===p.id?"border-aurora bg-white/10":"border-white/20 bg-white/5"}`}><p className="text-lg">{p.name}</p><p className="text-sm text-white/60">{p.major}</p></button>)}</div><div className="mt-8 flex gap-3"><button onClick={()=>setIdx((v)=>Math.min(v+1,2))} className="rounded-full bg-white/10 px-5 py-2">Next</button><button onClick={()=>onStart(demoProfiles.find((p)=>p.id===selected) ?? demoProfiles[0])} className="rounded-full bg-gradient-to-r from-aurora to-lilac px-5 py-2 text-ink">Launch SemesterOS</button></div></section></main>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) { return <article className="glass rounded-2xl p-5"><h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-white/70">{title}</h3>{children}</article>; }
function Heatmap({ load }: { load: number[] }) { return <div className="grid grid-cols-7 gap-2">{load.map((h,i)=><div key={i} className="h-16 rounded-xl" style={{background:`rgba(116,240,196,${0.18+h/12})`}} />)}</div>; }
function Overview({ plan, goals }: { plan: Plan; goals: string[] }) { return <div className="space-y-4"><h2 className="text-2xl font-medium">Workload Intelligence <span className="text-sm text-white/50">({plan.source ?? "fallback"})</span></h2><p className="text-white/80">{plan.summary}</p><div className="grid gap-4 md:grid-cols-2"><ul className="space-y-2">{plan.priorities.map((p,i)=><li key={i} className="rounded-lg bg-white/5 p-3">{p}</li>)}</ul><div className="rounded-xl bg-white/5 p-4"><p className="text-sm uppercase text-white/60">Personal goals</p><ul className="mt-2 space-y-2 text-sm">{goals.map((g,i)=><li key={i}>• {g}</li>)}</ul></div></div></div>; }
function Timeline({ tasks }: { tasks: Task[] }) { return <div className="space-y-3">{tasks.map((t)=><div key={t.id} className="rounded-xl bg-white/5 p-4"><div className="flex items-center justify-between"><p>{t.title}</p><span className="rounded-full bg-white/10 px-3 py-1 text-xs">{t.due}</span></div><p className="mt-1 text-sm text-white/60">{t.course} · {t.type} · {t.hours}h</p></div>)}</div>; }
function Planner({ plan }: { plan: Plan }) { return <div><h2 className="text-2xl">Weekly Action Plan</h2><ul className="mt-4 space-y-2">{plan.weekly.map((w,i)=><li key={i} className="rounded-xl bg-white/5 p-3">{w}</li>)}</ul></div>; }
function Focus() { return <div className="text-center"><p className="text-xs uppercase tracking-[0.25em] text-aurora">Focus Mode</p><p className="mt-5 text-6xl font-semibold">25:00</p><p className="mt-2 text-white/60">Deep work sprint · notifications silenced</p><div className="mx-auto mt-6 h-2 max-w-md rounded-full bg-white/10"><div className="h-2 w-1/3 rounded-full bg-gradient-to-r from-mint to-aurora" /></div></div>; }
function Milestones({ tasks }: { tasks: Task[] }) { return <div className="grid gap-3 md:grid-cols-3">{tasks.slice(0,3).map((t)=> <div key={t.id} className="rounded-xl bg-white/5 p-4"><p>{t.title}</p><p className="text-sm text-mint">On track</p></div>)}</div>; }
