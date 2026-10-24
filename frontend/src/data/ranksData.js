export const LOGIC_RANKS = [
  {
    level: 1,
    title: 'Logic Initiate',
    subtitle: 'Novice Problem Solver',
    minPoints: 0,
    maxPoints: 249,
    badgeColor: '#94A3B8',
    borderColor: 'border-slate-500/40',
    bgColor: 'bg-slate-500/10',
    textColor: 'text-slate-300',
    perk: 'Unlocks basic problem catalog & sequential logic validation',
    description: 'Formulates basic sequential logic, inputs, outputs, and variable declarations.'
  },
  {
    level: 2,
    title: 'Pattern Solver',
    subtitle: 'Condition & Branching Specialist',
    minPoints: 250,
    maxPoints: 499,
    badgeColor: '#38BDF8',
    borderColor: 'border-sky-500/40',
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-300',
    perk: 'Unlocks Flowchart Visualizer & Intermediate Algorithm Challenges',
    description: 'Solves multi-condition branches, even/odd parity checks, and comparison logic.'
  },
  {
    level: 3,
    title: 'Algorithm Crafter',
    subtitle: 'Looping & Data Structure Builder',
    minPoints: 500,
    maxPoints: 999,
    badgeColor: '#34D399',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-300',
    perk: 'Unlocks Multi-Language Code Generation (Java, Python, C++, JS, Go, Rust)',
    description: 'Masters array traversals, pointer manipulations, binary searches, and loops.'
  },
  {
    level: 4,
    title: 'Logic Architect',
    subtitle: 'Senior Logic Architect',
    minPoints: 1000,
    maxPoints: 1499,
    badgeColor: '#D4AF37',
    borderColor: 'border-[#D4AF37]/50',
    bgColor: 'bg-[#D4AF37]/15',
    textColor: 'text-[#D4AF37]',
    perk: 'Unlocks AI Socratic Guidance, Classroom Creation & Peer Explanations',
    description: 'Architects mathematically sound and edge-case resilient algorithm formulations.'
  },
  {
    level: 5,
    title: 'Senior Logic Engineer',
    subtitle: 'Optimization Specialist',
    minPoints: 1500,
    maxPoints: 1999,
    badgeColor: '#F472B6',
    borderColor: 'border-pink-500/40',
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-300',
    perk: 'Unlocks Real-Time Doubt Clarification & Priority Automated Verification',
    description: 'Demonstrates deep time-complexity optimization and recursive reasoning.'
  },
  {
    level: 6,
    title: 'Grandmaster Validator',
    subtitle: 'Elite Competitive Logician',
    minPoints: 2000,
    maxPoints: 2999,
    badgeColor: '#A78BFA',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-300',
    perk: 'Unlocks Global Leaderboard Hall of Fame & Custom Problem Submission',
    description: 'Consistently ranks in the top percentile of algorithmic formulation accuracy.'
  },
  {
    level: 7,
    title: 'Titan Logician',
    subtitle: 'Legendary Master of Logic',
    minPoints: 3000,
    maxPoints: Infinity,
    badgeColor: '#F59E0B',
    borderColor: 'border-amber-500/50',
    bgColor: 'bg-amber-500/20',
    textColor: 'text-amber-300',
    perk: 'Unlocks Honorary Logician Diploma & CLV Grand Certification',
    description: 'The pinnacle of logic mastery reached through unbroken streaks and flawless proofs.'
  }
];

export function getRankForPoints(points = 0) {
  const current = LOGIC_RANKS.slice().reverse().find((r) => points >= r.minPoints);
  return current || LOGIC_RANKS[0];
}

export function getCompletedRanks(points = 0) {
  return LOGIC_RANKS.filter((r) => points >= r.minPoints);
}

export function getNextRank(points = 0) {
  return LOGIC_RANKS.find((r) => points < r.minPoints) || null;
}
