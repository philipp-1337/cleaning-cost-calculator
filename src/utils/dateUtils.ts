// Datums-Hilfsfunktionen
export function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getCurrentDateString(): string {
  return new Date().toISOString().split('T')[0];
}