import { Project } from '../data/portfolioData';

// Returns a punchy, game-flavored summary <= 150 words.
export function generateProjectDetails(project: Project): string {
  const title = project.title;
  const category = project.category.replace('-', ' ').toUpperCase();
  const skills = project.skills.slice(0, 5).join(', ');
  const objective = project.description;
  const featured = project.featured ? 'Legendary' : 'Rare';

  const parts: string[] = [];
  parts.push(`Quest: ${title} [${category}]`);
  parts.push(`Rarity: ${featured} | Loadout: ${skills}`);
  if (objective) parts.push(`Objective: ${objective}`);

  if (project.outcomes && project.outcomes.length) {
    const perks = project.outcomes.slice(0, 2).map(p => `+ ${p}`).join(' ');
    parts.push(`Loot: ${perks}`);
  }

  const raw = parts.join(' ');

  // Trim to ~150 words without cutting mid-sentence
  const words = raw.split(/\s+/);
  if (words.length <= 150) return raw;
  return words.slice(0, 150).join(' ') + '…';
}
