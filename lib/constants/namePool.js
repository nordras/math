/**
 * Multilingual name pool for math exercises
 * Names selected to work well in both Portuguese and English
 */

export const NAME_POOL = [
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
 * @param {string} [gender] - Filter by gender (optional: 'feminine' or 'masculine')
 * @param {number} [seed] - Seed for deterministic randomization (optional)
 * @returns {string} Selected name
 */
export function getRandomName(gender, seed) {
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
 * @param {number} count - Number of names to return
 * @param {string} [gender] - Filter by gender (optional)
 * @returns {string[]} Array of unique names
 */
export function getRandomNames(count, gender) {
  const filteredPool = gender 
    ? NAME_POOL.filter(n => n.gender === gender)
    : NAME_POOL;
  
  const shuffled = [...filteredPool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map(n => n.name);
}

/**
 * Gets a consistent name based on an ID/hash
 * Useful for maintaining the same name across an exercise set
 * @param {string|number} id - Unique identifier
 * @param {string} [gender] - Filter by gender (optional)
 * @returns {string} Consistent name for the provided ID
 */
export function getConsistentName(id, gender) {
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
 * @returns {string}
 */
export function getAllNamesString() {
  return NAME_POOL.map(n => n.name).join(', ');
}

/**
 * Checks if text contains any name from the pool
 * @param {string} text - Text to check
 * @returns {boolean} true if contains any name from the pool
 */
export function containsAnyName(text) {
  const lowerText = text.toLowerCase();
  return NAME_POOL.some(n => lowerText.includes(n.name.toLowerCase()));
}
