// backend/src/utils/similarity.ts

/**
 * Compute cosine similarity between two numeric vectors.
 * Returns a number between -1 and 1.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
    if (!a || !b || a.length !== b.length) return 0;
  
    let dot = 0;
    let magA = 0;
    let magB = 0;
  
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
  
    if (magA === 0 || magB === 0) return 0;
  
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }
  