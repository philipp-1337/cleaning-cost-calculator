// Zentrale Konstanten
export const RATE_PER_PERSON_PER_HOUR = 18;

export const MINUTE_OPTIONS = [0, 15, 30, 45] as const;

export const DEFAULT_NEW_ENTRY = {
  date: '',
  persons: 2,
  hours: 0,
  minutes: 0
};

export const DEFAULT_NEW_PAYMENT = {
  date: '',
  amount: ''
};