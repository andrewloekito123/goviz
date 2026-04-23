export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  accent: string;
};

export const TEAM: TeamMember[] = [
  {
    name: "Elara Voss",
    role: "Founding Principal",
    bio: "20 years shaping civic and cultural architecture across Scandinavia and Central Europe.",
    accent: "#d0d8f0",
  },
  {
    name: "Marcus Holm",
    role: "Design Director",
    bio: "Leads conceptual and computational design from first sketch through to final detail.",
    accent: "#d8d0f0",
  },
  {
    name: "Priya Rao",
    role: "Technical Director",
    bio: "Oversees engineering integration, sustainability certifications, and project delivery.",
    accent: "#d0f0d8",
  },
  {
    name: "Tomas Lind",
    role: "Associate",
    bio: "Specialises in facade systems, material research, and digital fabrication workflows.",
    accent: "#f0e8d0",
  },
];
