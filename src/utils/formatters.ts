// Formatierungs-Hilfsfunktionen
export function formatHours(hours: number, minutes: number): string {
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
}

export function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)} €`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString + 'T12:00:00').toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

export function getBalanceLabel(balance: number): string {
  if (balance > 0) return 'Überzahlung';
  if (balance < 0) return 'Noch zu zahlen';
  return 'Ausgeglichen';
}