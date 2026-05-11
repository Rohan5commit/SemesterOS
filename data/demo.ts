export type Task = { id: string; title: string; course: string; due: string; hours: number; priority: "High"|"Medium"|"Low"; type: "Assignment"|"Exam"|"Club"|"Personal" };

export const profile = {
  name: "Maya Chen",
  semester: "Fall 2026",
  courses: ["Algorithms", "Human-Computer Interaction", "Linear Algebra", "Product Studio"]
};

export const tasks: Task[] = [
  { id: "1", title: "Algo Problem Set 4", course: "Algorithms", due: "2026-09-18", hours: 6, priority: "High", type: "Assignment" },
  { id: "2", title: "HCI Prototype Crit", course: "Human-Computer Interaction", due: "2026-09-21", hours: 8, priority: "High", type: "Assignment" },
  { id: "3", title: "Linear Algebra Midterm", course: "Linear Algebra", due: "2026-10-02", hours: 12, priority: "High", type: "Exam" },
  { id: "4", title: "Hack Club Demo Day", course: "Product Studio", due: "2026-09-29", hours: 5, priority: "Medium", type: "Club" },
  { id: "5", title: "Workout goal 3x", course: "Personal", due: "2026-09-22", hours: 3, priority: "Low", type: "Personal" }
];

export const fallbackPlan = {
  summary: "You have a heavy 2-week window with three high-impact deadlines. Front-load deep work for Algebra and split HCI into prototype, feedback, and polish blocks.",
  priorities: [
    "Linear Algebra Midterm: 4 focused sessions across 8 days.",
    "HCI Prototype Crit: 3 staged deliverables before critique.",
    "Algo Problem Set 4: Start now to avoid overlap week."
  ],
  weekly: [
    "Mon/Tue: 2 x 90m algebra concept drills + 1 algorithm sprint.",
    "Wed/Thu: HCI prototype build + usability notes.",
    "Fri: light review + club prep.",
    "Sat/Sun: exam simulation + revision pass."
  ]
};
