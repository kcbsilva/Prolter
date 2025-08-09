export function formatDate(d: string) {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  }
  
  export function fuzzyIncludes(haystack: string, needle: string) {
    return haystack.toLowerCase().includes(needle.trim().toLowerCase());
  }
  