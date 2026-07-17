export const validateRoomCode = (code: unknown): boolean => {
  return typeof code === 'string' && /^[A-Z0-9]{6}$/.test(code);
};

export const validatePlayerName = (name: unknown): string | null => {
  if (typeof name !== 'string') return null;
  // Remove invisible characters and trim
  let cleanName = name.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  // Basic HTML escaping
  cleanName = cleanName
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
    
  if (cleanName.length < 2 || cleanName.length > 20) return null;
  return cleanName;
};

export const validateLanguage = (lang: unknown): string | null => {
  const allowed = ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust', 'TypeScript'];
  if (typeof lang !== 'string') return null;
  const match = allowed.find(l => l.toLowerCase() === lang.toLowerCase());
  return match || null;
};

export const validateBestOf = (num: unknown): number | null => {
  const parsed = typeof num === 'string' ? parseInt(num, 10) : num;
  if (typeof parsed !== 'number' || isNaN(parsed)) return null;
  const allowed = [3, 5, 10, 15];
  if (allowed.includes(parsed)) return parsed;
  return null;
};

export const validateAnswer = (answer: unknown): boolean => {
  if (typeof answer === 'string') {
    return answer.length <= 500;
  }
  if (Array.isArray(answer)) {
    return answer.length <= 50 && answer.every(a => typeof a === 'string' && a.length <= 100);
  }
  return false;
};
