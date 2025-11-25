// A simple non-cryptographic hash for demonstration visual purposes
// In a real app we might use crypto.subtle, but we want synchronous instant feedback for UI
export const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Convert to hex and pad to resemble part of a SHA-1
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + hex + hex + hex + hex).substring(0, 40);
};

export const shortHash = (hash: string) => hash.substring(0, 7);