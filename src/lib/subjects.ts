import type { Subject } from "@/lib/types";

export const SUBJECTS: Subject[] = [
  {
    slug: "english-language",
    name: "English Language",
    shortName: "English",
    group: "Science",
    icon: "Languages",
    gradient: "from-sky-500 to-blue-600",
    description:
      "Comprehension, grammar, lexis, oral English and sentence interpretation for confident communication.",
    topics: [
      "Comprehension",
      "Grammar",
      "Vocabulary",
      "Lexis & Structure",
      "Oral English",
      "Sentence Interpretation"
    ]
  },
  {
    slug: "mathematics",
    name: "Mathematics",
    shortName: "Maths",
    group: "Science",
    icon: "Sigma",
    gradient: "from-blue-500 to-indigo-600",
    description:
      "Master algebra, geometry, trigonometry, statistics, probability, calculus and number systems.",
    topics: [
      "Algebra",
      "Geometry",
      "Trigonometry",
      "Statistics",
      "Probability",
      "Calculus",
      "Number Systems"
    ]
  },
  {
    slug: "physics",
    name: "Physics",
    shortName: "Physics",
    group: "Science",
    icon: "Atom",
    gradient: "from-cyan-500 to-sky-600",
    description:
      "Mechanics, electricity, waves, optics, heat and modern physics with worked explanations.",
    topics: ["Mechanics", "Electricity", "Waves", "Optics", "Heat", "Modern Physics"]
  },
  {
    slug: "chemistry",
    name: "Chemistry",
    shortName: "Chemistry",
    group: "Science",
    icon: "FlaskConical",
    gradient: "from-emerald-500 to-teal-600",
    description:
      "Organic chemistry, atomic structure, bonding, acids and bases, and electrochemistry.",
    topics: [
      "Organic Chemistry",
      "Atomic Structure",
      "Chemical Bonding",
      "Acids & Bases",
      "Electrochemistry"
    ]
  },
  {
    slug: "biology",
    name: "Biology",
    shortName: "Biology",
    group: "Science",
    icon: "Dna",
    gradient: "from-lime-500 to-emerald-600",
    description:
      "Genetics, ecology, cell biology, human anatomy, evolution and reproduction.",
    topics: [
      "Genetics",
      "Ecology",
      "Cell Biology",
      "Human Anatomy",
      "Evolution",
      "Reproduction"
    ]
  },
  {
    slug: "literature-in-english",
    name: "Literature in English",
    shortName: "Literature",
    group: "Arts & Humanities",
    icon: "BookOpen",
    gradient: "from-fuchsia-500 to-purple-600",
    description:
      "Drama, poetry, prose, literary terms and African literature analysis.",
    topics: ["Drama", "Poetry", "Prose", "Literary Terms", "African Literature"]
  },
  {
    slug: "government",
    name: "Government",
    shortName: "Government",
    group: "Arts & Humanities",
    icon: "Landmark",
    gradient: "from-amber-500 to-orange-600",
    description:
      "Constitutions, federalism, political parties, elections, foreign policy and Nigerian government.",
    topics: [
      "Constitution",
      "Federalism",
      "Political Parties",
      "Elections",
      "International Relations",
      "Nigerian Government"
    ]
  },
  {
    slug: "christian-religious-studies",
    name: "Christian Religious Studies",
    shortName: "CRS",
    group: "Arts & Humanities",
    icon: "Church",
    gradient: "from-rose-500 to-pink-600",
    description:
      "Old and New Testament studies, Christian ethics and church history.",
    topics: ["Old Testament", "New Testament", "Christian Ethics", "Church History"]
  },
  {
    slug: "islamic-religious-studies",
    name: "Islamic Religious Studies",
    shortName: "IRS",
    group: "Arts & Humanities",
    icon: "MoonStar",
    gradient: "from-teal-500 to-green-600",
    description:
      "Qur'an, Hadith, Islamic jurisprudence and Islamic history.",
    topics: ["Qur'an", "Hadith", "Islamic Jurisprudence", "Islamic History"]
  },
  {
    slug: "history",
    name: "History",
    shortName: "History",
    group: "Arts & Humanities",
    icon: "ScrollText",
    gradient: "from-stone-500 to-amber-700",
    description:
      "Pre-colonial and colonial Nigeria, independence, and major world history themes.",
    topics: [
      "Pre-colonial Nigeria",
      "Colonial Nigeria",
      "Post-independence Nigeria",
      "World History"
    ]
  },
  {
    slug: "economics",
    name: "Economics",
    shortName: "Economics",
    group: "Commercial",
    icon: "TrendingUp",
    gradient: "from-emerald-500 to-cyan-600",
    description:
      "Microeconomics, macroeconomics, money and banking, trade and the Nigerian economy.",
    topics: [
      "Microeconomics",
      "Macroeconomics",
      "Money & Banking",
      "International Trade",
      "Nigerian Economy"
    ]
  },
  {
    slug: "commerce",
    name: "Commerce",
    shortName: "Commerce",
    group: "Commercial",
    icon: "Store",
    gradient: "from-orange-500 to-red-600",
    description:
      "Trade, business organisations, finance, marketing and commercial documents.",
    topics: ["Trade", "Business Organisations", "Finance", "Marketing"]
  },
  {
    slug: "accounting",
    name: "Accounting",
    shortName: "Accounting",
    group: "Commercial",
    icon: "Calculator",
    gradient: "from-indigo-500 to-violet-600",
    description:
      "Accounting principles, double entry, final accounts, ratios and cost accounting.",
    topics: [
      "Principles",
      "Double Entry",
      "Final Accounts",
      "Ratios",
      "Cost Accounting"
    ]
  },
  {
    slug: "geography",
    name: "Geography",
    shortName: "Geography",
    group: "General",
    icon: "Globe2",
    gradient: "from-blue-500 to-cyan-500",
    description:
      "Physical geography, human geography, map reading and the geography of Nigeria.",
    topics: ["Physical Geography", "Human Geography", "Map Reading", "Nigerian Geography"]
  },
  {
    slug: "agricultural-science",
    name: "Agricultural Science",
    shortName: "Agric",
    group: "General",
    icon: "Sprout",
    gradient: "from-green-500 to-lime-600",
    description:
      "Crop science, animal science, soil science and farm management.",
    topics: ["Crop Science", "Animal Science", "Soil Science", "Farm Management"]
  },
  {
    slug: "civic-education",
    name: "Civic Education",
    shortName: "Civic",
    group: "General",
    icon: "Scale",
    gradient: "from-cyan-500 to-blue-600",
    description:
      "Rights and duties, democracy, rule of law and national values.",
    topics: ["Rights & Duties", "Democracy", "Rule of Law", "National Values"]
  }
];

export function getSubject(slug: string): Subject | undefined {
  return SUBJECTS.find((s) => s.slug === slug);
}

export function subjectName(slug: string): string {
  return getSubject(slug)?.name ?? slug;
}

export const SUBJECT_GROUPS = [
  "Science",
  "Arts & Humanities",
  "Commercial",
  "General"
] as const;

export const EXAM_BLUEPRINT = [
  { slug: "english-language", compulsory: true },
  { slug: "mathematics", compulsory: true },
  { slug: "physics", compulsory: false },
  { slug: "chemistry", compulsory: false },
  { slug: "biology", compulsory: false },
  { slug: "government", compulsory: false },
  { slug: "economics", compulsory: false }
];
