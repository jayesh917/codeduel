export function getUserId(): string {
  let userId = localStorage.getItem('codeDuelUserId');
  if (!userId) {
    userId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('codeDuelUserId', userId);
  }
  return userId;
}
