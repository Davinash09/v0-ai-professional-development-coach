export type PDItemBase = {
  id: string
  title: string
  provider: string
  url: string
  subjects: string[] // e.g., ["Science","Math"]
  grades: ("Elementary" | "Middle School" | "High School" | "Higher Ed")[]
  pedagogy: string[] // e.g., ["PBL","Inquiry","UDL","Blended","AI Literacy","Assessment"]
  cost: "free" | "paid"
}

export type Workshop = PDItemBase & {
  type: "workshop"
  duration: number // minutes
  format: "synchronous" | "asynchronous"
  audience: string[]
}

export type Tool = PDItemBase & {
  type: "tool"
  useCases: string[]
}

export type BestPractice = PDItemBase & {
  type: "best-practice"
  summary: string
}

export type PDResource = Workshop | Tool | BestPractice

export const catalog: PDResource[] = [
  {
    id: "w1",
    type: "workshop",
    title: "Inquiry in Middle School Science: Phenomena-Driven Units",
    provider: "STEM PD Network",
    url: "https://example.org/workshops/inquiry-phenomena-ms",
    subjects: ["Science"],
    grades: ["Middle School"],
    pedagogy: ["Inquiry"],
    cost: "free",
    duration: 60,
    format: "synchronous",
    audience: ["Science Teachers"],
  },
  {
    id: "w2",
    type: "workshop",
    title: "Universal Design for Learning: Planning for Variability",
    provider: "UDL Coalition",
    url: "https://example.org/workshops/udl-planning",
    subjects: ["All"],
    grades: ["Elementary", "Middle School", "High School", "Higher Ed"],
    pedagogy: ["UDL"],
    cost: "free",
    duration: 90,
    format: "asynchronous",
    audience: ["All Educators"],
  },
  {
    id: "t1",
    type: "tool",
    title: "Desmos Classroom",
    provider: "Desmos",
    url: "https://teacher.desmos.com",
    subjects: ["Math"],
    grades: ["Middle School", "High School"],
    pedagogy: ["Inquiry", "Assessment"],
    cost: "free",
    useCases: ["discourse", "visualization", "formative assessment"],
  },
  {
    id: "t2",
    type: "tool",
    title: "PhET Interactive Simulations",
    provider: "CU Boulder",
    url: "https://phet.colorado.edu",
    subjects: ["Science", "Math"],
    grades: ["Elementary", "Middle School", "High School"],
    pedagogy: ["Inquiry"],
    cost: "free",
    useCases: ["phenomena exploration", "conceptual understanding"],
  },
  {
    id: "bp1",
    type: "best-practice",
    title: "Gold Standard PBL: Scaffolding and Milestones",
    provider: "PBLWorks",
    url: "https://example.org/best-practices/pbl-gold-standard",
    subjects: ["All"],
    grades: ["Middle School", "High School"],
    pedagogy: ["PBL"],
    cost: "free",
    summary:
      "Plan clear milestones, public product, and reflection cycles. Use rubrics for collaboration and critical thinking.",
  },
  {
    id: "bp2",
    type: "best-practice",
    title: "UDL Checkpoints for Lesson Design",
    provider: "CAST",
    url: "https://example.org/best-practices/udl-checkpoints",
    subjects: ["All"],
    grades: ["Elementary", "Middle School", "High School", "Higher Ed"],
    pedagogy: ["UDL"],
    cost: "free",
    summary:
      "Offer multiple means of engagement, representation, and action/expression; reduce barriers with flexible options.",
  },
  {
    id: "w3",
    type: "workshop",
    title: "Blended Learning Stations: Efficient Rotations",
    provider: "LearnLab",
    url: "https://example.org/workshops/blended-stations",
    subjects: ["All"],
    grades: ["Elementary", "Middle School"],
    pedagogy: ["Blended"],
    cost: "free",
    duration: 60,
    format: "synchronous",
    audience: ["K-8 Teachers"],
  },
  {
    id: "t3",
    type: "tool",
    title: "Padlet",
    provider: "Padlet",
    url: "https://padlet.com",
    subjects: ["All"],
    grades: ["Elementary", "Middle School", "High School", "Higher Ed"],
    pedagogy: ["Inquiry", "PBL", "Blended"],
    cost: "free",
    useCases: ["brainstorming", "gallery walk", "peer feedback"],
  },
]
