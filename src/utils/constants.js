export const ROLES = {
  TEACHER: "teacher",
  PRINCIPAL: "principal",
};

export const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const SCHEDULE_STATUS = {
  SCHEDULED: "scheduled",
  ACTIVE: "active",
  EXPIRED: "expired",
};

export const SUBJECTS = [
  { value: "mathematics", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "english", label: "English" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "computer_science", label: "Computer Science" },
  { value: "art", label: "Art" },
  { value: "music", label: "Music" },
  { value: "physical_education", label: "Physical Education" },
];

/**
 * Subject accent colors for the live page and subject badges.
 * Tailwind bg/text class pairs keyed by subject value.
 */
export const SUBJECT_COLORS = {
  mathematics:        { bg: "bg-indigo-500/20",  text: "text-indigo-300",  border: "border-indigo-500/30"  },
  science:            { bg: "bg-teal-500/20",    text: "text-teal-300",    border: "border-teal-500/30"    },
  english:            { bg: "bg-pink-500/20",    text: "text-pink-300",    border: "border-pink-500/30"    },
  history:            { bg: "bg-orange-500/20",  text: "text-orange-300",  border: "border-orange-500/30"  },
  geography:          { bg: "bg-teal-500/20",    text: "text-teal-300",    border: "border-teal-500/30"    },
  physics:            { bg: "bg-violet-500/20",  text: "text-violet-300",  border: "border-violet-500/30"  },
  chemistry:          { bg: "bg-amber-500/20",   text: "text-amber-300",   border: "border-amber-500/30"   },
  biology:            { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/30" },
  computer_science:   { bg: "bg-cyan-500/20",    text: "text-cyan-300",    border: "border-cyan-500/30"    },
  art:                { bg: "bg-rose-500/20",    text: "text-rose-300",    border: "border-rose-500/30"    },
  music:              { bg: "bg-purple-500/20",  text: "text-purple-300",  border: "border-purple-500/30"  },
  physical_education: { bg: "bg-lime-500/20",    text: "text-lime-300",    border: "border-lime-500/30"    },
};

export const FILE_LIMITS = {
  MAX_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_SIZE_LABEL: "10MB",
  ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/gif"],
  ACCEPTED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif"],
  ACCEPTED_LABEL: "JPG, PNG, GIF",
};

export const QUERY_KEYS = {
  MY_CONTENT: "my-content",
  ALL_CONTENT: "all-content",
  PENDING_CONTENT: "pending-content",
  LIVE_CONTENT: "live-content",
  PROFILE: "profile",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  VIRTUALIZE_THRESHOLD: 100,
};
