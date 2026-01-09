/**
 * Multilingual name pool for math exercises
 * Names selected to work well in both Portuguese and English
 */

export interface NameInfo {
  name: string;
  gender: 'feminine' | 'masculine';
}

export const NAME_POOL: NameInfo[] = [
  // Feminine names
  { name: 'Luna', gender: 'feminine' },
  { name: 'Maya', gender: 'feminine' },
  { name: 'Nina', gender: 'feminine' },
  { name: 'Mia', gender: 'feminine' },
  { name: 'Jade', gender: 'feminine' },
  { name: 'Lara', gender: 'feminine' },
  { name: 'Sofia', gender: 'feminine' },
  { name: 'Ana', gender: 'feminine' },
  { name: 'Emma', gender: 'feminine' },
  
  // Masculine names
  { name: 'Leo', gender: 'masculine' },
  { name: 'Noah', gender: 'masculine' },
  { name: 'Davi', gender: 'masculine' },
  { name: 'Kai', gender: 'masculine' },
  { name: 'Lucas', gender: 'masculine' },
  { name: 'Theo', gender: 'masculine' },
  { name: 'Samuel', gender: 'masculine' },
  { name: 'Enzo', gender: 'masculine' },
  { name: 'Miguel', gender: 'masculine' },
];

/**
 * Gets a random name from the pool
 * @param gender - Filter by gender (optional)
 * @param seed - Seed for deterministic randomization (optional)
 * @returns Selected name
 */
export function getRandomName(gender?: 'feminine' | 'masculine', seed?: number): string {
  const filteredPool = gender 
    ? NAME_POOL.filter(n => n.gender === gender)
    : NAME_POOL;
  
  if (seed !== undefined) {
    // Deterministic randomization using seed
    const index = seed % filteredPool.length;
    return filteredPool[index].name;
  }
  
  // True randomization
  const randomIndex = Math.floor(Math.random() * filteredPool.length);
  return filteredPool[randomIndex].name;
}

/**
 * Gets multiple unique names
 * @param count - Number of names to return
 * @param gender - Filter by gender (optional)
 * @returns Array of unique names
 */
export function getRandomNames(count: number, gender?: 'feminine' | 'masculine'): string[] {
  const filteredPool = gender 
    ? NAME_POOL.filter(n => n.gender === gender)
    : NAME_POOL;
  
  const shuffled = [...filteredPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map(n => n.name);
}

/**
 * Gets a consistent name based on an ID/hash
 * Useful for maintaining the same name across an exercise set
 * @param id - Unique identifier (string or number)
 * @param gender - Filter by gender (optional)
 * @returns Consistent name for the provided ID
 */
export function getConsistentName(id: string | number, gender?: 'feminine' | 'masculine'): string {
  const filteredPool = gender 
    ? NAME_POOL.filter(n => n.gender === gender)
    : NAME_POOL;
  
  // Generate simple hash from ID
  const hash = typeof id === 'string' 
    ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : id;
  
  const index = hash % filteredPool.length;
  return filteredPool[index].name;
}

/**
 * Gets all names as comma-separated string
 * Useful for AI prompts
 */
export function getAllNamesString(): string {
  return NAME_POOL.map(n => n.name).join(', ');
}

/**
 * Checks if text contains any name from the pool
 * @param text - Text to check
 * @returns true if contains any name from the pool
 */
export function containsAnyName(text: string): boolean {
  const lowerText = text.toLowerCase();
  return NAME_POOL.some(n => lowerText.includes(n.name.toLowerCase()));
}
