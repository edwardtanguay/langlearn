export interface ParsedMetadataResult {
  cleanText: string;
  pronunciation?: string;
  memoryHook?: string;
  rank?: number;
}

export function parseMetadata(text: string): ParsedMetadataResult {
  if (!text || typeof text !== 'string') {
    return { cleanText: '' };
  }

  // Find all metadata tokens matching .. tag
  // A metadata chunk starts with ".." up to the next ".." or end of line
  const metadataRegex = /\.\.([^\.\s]+(?:\.[^\.\s]+)?(?:\s+[^.\s]+)*)/g;
  
  let pronunciation: string | undefined;
  let memoryHook: string | undefined;
  let rank: number | undefined;

  // Simple and robust parser: find indices of ".."
  const parts: string[] = [];
  let currentIndex = 0;
  
  // We can scan text for ".." markers
  const textLen = text.length;
  let cleanTextBuilder = '';
  
  let i = 0;
  while (i < textLen) {
    if (text[i] === '.' && text[i + 1] === '.') {
      // We hit ".."
      // Find end of this metadata chunk (either next ".." or end of string)
      let endIdx = text.indexOf('..', i + 2);
      if (endIdx === -1) {
        endIdx = textLen;
      }
      
      const chunk = text.substring(i + 2, endIdx).trim();
      i = endIdx; // advance loop pointer

      if (chunk.length > 0) {
        parseChunk(chunk);
      }
    } else {
      cleanTextBuilder += text[i];
      i++;
    }
  }

  function parseChunk(chunk: string) {
    // 1. Rank syntax: starts with digit or decimal number (e.g. "43", "4", "4899", "4.3")
    if (/^\d+(\.\d+)?$/.test(chunk)) {
      if (chunk.includes('.')) {
        rank = parseFloat(chunk);
      } else if (chunk.length === 1) {
        rank = parseFloat(chunk + '.0');
      } else {
        // First digit is integer part, rest is fractional part (e.g. 43 -> 4.3, 4899 -> 4.899)
        const intPart = chunk[0];
        const decPart = chunk.substring(1);
        rank = parseFloat(`${intPart}.${decPart}`);
      }
      return;
    }

    // 2. Category tags: category letter + "." + body (e.g. "p.SUR-seel", "m.the sky")
    const dotIndex = chunk.indexOf('.');
    if (dotIndex > 0) {
      const category = chunk.substring(0, dotIndex).toLowerCase();
      const body = chunk.substring(dotIndex + 1).trim();
      
      if (category === 'p') {
        pronunciation = body;
      } else if (category === 'm') {
        memoryHook = body;
      }
    }
  }

  // Clean up extra whitespace in cleanText
  const cleanText = cleanTextBuilder.replace(/\s+/g, ' ').trim();

  const result: ParsedMetadataResult = { cleanText };
  if (pronunciation) result.pronunciation = pronunciation;
  if (memoryHook) result.memoryHook = memoryHook;
  if (rank !== undefined && !isNaN(rank)) result.rank = rank;

  return result;
}
