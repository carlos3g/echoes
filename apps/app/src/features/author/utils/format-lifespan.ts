import type { Author } from '@/types/entities';

export function formatLifespan(author: Author): string | null {
  if (!author.birthDate) return null;
  const birth = new Date(author.birthDate).getFullYear();
  const death = author.deathDate ? new Date(author.deathDate).getFullYear() : null;
  return death ? `${birth} – ${death}` : `b. ${birth}`;
}
