export type Skill = { id: string; name: string; category: string; difficulty: 1|2|3; demandScore: number };
export type User = {
  id: string; name: string; avatarUrl?: string; location: { city: string; country: string; lat: number; lng: number };
  languages: string[]; bio: string; skillsOffered: { skillId: string; level: 1|2|3|4|5 }[]; skillsWanted: { skillId: string; priority: number }[];
  ratingAvg: number; ratingCount: number; wallet: { credits: number };
};
export type CreditTransaction = { id: string; userId: string; type: 'earn'|'spend'|'bonus'|'donation'|'refund'; amount: number; createdAt: string; refSessionId?: string };

export const skills: Skill[] = [
  { id: 's1', name: 'Logo Design', category: 'Design', difficulty: 2, demandScore: 81 },
  { id: 's2', name: 'Guitar', category: 'Music', difficulty: 2, demandScore: 64 },
  { id: 's3', name: 'Spanish Tutoring', category: 'Language', difficulty: 2, demandScore: 74 },
  { id: 's4', name: 'Bike Repair', category: 'DIY', difficulty: 1, demandScore: 52 },
  { id: 's5', name: 'Web Development', category: 'Tech', difficulty: 3, demandScore: 92 },
  { id: 's6', name: 'Accounting Basics', category: 'Business', difficulty: 2, demandScore: 69 },
];

export const users: User[] = [
  {
    id: 'u1', name: 'Alex Rivera', location: { city: 'Barcelona', country: 'ES', lat: 41.39, lng: 2.17 },
    languages: ['English', 'Spanish'], bio: 'Designer and guitarist who loves teaching with practical challenges.',
    skillsOffered: [{ skillId: 's1', level: 5 }, { skillId: 's2', level: 4 }],
    skillsWanted: [{ skillId: 's5', priority: 1 }], ratingAvg: 4.8, ratingCount: 132, wallet: { credits: 120 },
  },
  {
    id: 'u2', name: 'Priya Shah', location: { city: 'Bengaluru', country: 'IN', lat: 12.97, lng: 77.59 },
    languages: ['English', 'Hindi'], bio: 'Full‑stack developer exploring music and languages.',
    skillsOffered: [{ skillId: 's5', level: 5 }], skillsWanted: [{ skillId: 's2', priority: 1 }, { skillId: 's3', priority: 2 }],
    ratingAvg: 4.9, ratingCount: 210, wallet: { credits: 240 },
  },
  {
    id: 'u3', name: 'Samir Ali', location: { city: 'Cairo', country: 'EG', lat: 30.04, lng: 31.24 },
    languages: ['Arabic', 'English'], bio: 'Bike tinkerer and weekend mentor.',
    skillsOffered: [{ skillId: 's4', level: 4 }], skillsWanted: [{ skillId: 's3', priority: 1 }], ratingAvg: 4.6, ratingCount: 58, wallet: { credits: 36 },
  },
];

export const tx: CreditTransaction[] = [
  { id: 't1', userId: 'u1', type: 'earn', amount: 20, createdAt: new Date().toISOString() },
  { id: 't2', userId: 'u1', type: 'spend', amount: -10, createdAt: new Date().toISOString() },
  { id: 't3', userId: 'u1', type: 'bonus', amount: 5, createdAt: new Date().toISOString() },
];
