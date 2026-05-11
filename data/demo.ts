export type TaskType = "Assignment" | "Exam" | "Club" | "Personal";
export type Task = {
  id: string;
  title: string;
  course: string;
  due: string;
  hours: number;
  priority: "High" | "Medium" | "Low";
  type: TaskType;
};

export type StudentProfile = {
  id: string;
  name: string;
  semester: string;
  major: string;
  courses: string[];
  availability: { day: string; hours: number }[];
  goals: string[];
  tasks: Task[];
};

export const demoProfiles: StudentProfile[] = [
  {
    id: "stem-sprinter",
    name: "Maya Chen",
    semester: "Fall 2026",
    major: "Computer Science",
    courses: ["Algorithms", "HCI", "Linear Algebra", "Product Studio"],
    availability: [
      { day: "Mon", hours: 4 }, { day: "Tue", hours: 3 }, { day: "Wed", hours: 4 }, { day: "Thu", hours: 3 }, { day: "Fri", hours: 2 }, { day: "Sat", hours: 5 }, { day: "Sun", hours: 5 }
    ],
    goals: ["3.8 GPA", "ship hackathon project", "exercise 3x/week"],
    tasks: [
      { id: "1", title: "Algo Problem Set 4", course: "Algorithms", due: "2026-09-18", hours: 6, priority: "High", type: "Assignment" },
      { id: "2", title: "HCI Prototype Crit", course: "HCI", due: "2026-09-21", hours: 8, priority: "High", type: "Assignment" },
      { id: "3", title: "Linear Algebra Midterm", course: "Linear Algebra", due: "2026-10-02", hours: 12, priority: "High", type: "Exam" },
      { id: "4", title: "Hack Club Demo Day", course: "Product Studio", due: "2026-09-29", hours: 5, priority: "Medium", type: "Club" },
      { id: "5", title: "Workout goal 3x", course: "Personal", due: "2026-09-22", hours: 3, priority: "Low", type: "Personal" }
    ]
  },
  {
    id: "design-lead",
    name: "Aria Patel",
    semester: "Fall 2026",
    major: "Design + Entrepreneurship",
    courses: ["Brand Systems", "Behavioral Psych", "Startup Lab"],
    availability: [
      { day: "Mon", hours: 3 }, { day: "Tue", hours: 4 }, { day: "Wed", hours: 3 }, { day: "Thu", hours: 4 }, { day: "Fri", hours: 3 }, { day: "Sat", hours: 6 }, { day: "Sun", hours: 4 }
    ],
    goals: ["launch portfolio case study", "grow startup MVP", "sleep 8h avg"],
    tasks: [
      { id: "6", title: "Brand guide draft", course: "Brand Systems", due: "2026-09-20", hours: 7, priority: "High", type: "Assignment" },
      { id: "7", title: "Psych reflection brief", course: "Behavioral Psych", due: "2026-09-24", hours: 4, priority: "Medium", type: "Assignment" },
      { id: "8", title: "Startup investor pitch", course: "Startup Lab", due: "2026-10-01", hours: 10, priority: "High", type: "Exam" }
    ]
  }
];

export const fallbackPlan = {
  summary: "Your next 10 days have two peak workload spikes. Start high-cognitive work early in the week and reserve lighter admin/club tasks for low-energy windows.",
  priorities: [
    "Protect 4 deep sessions for the highest-stakes exam deliverable.",
    "Break major assignments into draft, review, polish checkpoints.",
    "Batch low-priority tasks into one 60-minute admin block."
  ],
  weekly: [
    "Mon: Deep work sprint (90m x2) + capture blockers.",
    "Tue/Wed: Build deliverables, request feedback, iterate.",
    "Thu: Review-heavy day and practice quiz cycles.",
    "Fri: Light admin and milestone check-in.",
    "Weekend: Capstone revision + weekly reset planning."
  ]
};
