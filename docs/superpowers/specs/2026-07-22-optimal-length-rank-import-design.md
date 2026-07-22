# Optimal Front Length Rank Calculation and Metadata Import Preview Design

## Overview
This design introduces optimal-length default rank calculation for imported flashcards and updates the CSV import preview table to display extracted metadata attributes (Rank, Pronunciation, Memory Hook).

## Requirements & Constants
When importing flashcards from CSV:
1. If no explicit rank tag (e.g. `..4.3`) is present in card metadata, calculate rank based on the trimmed front text length $n$:
   - `OPTIMAL_FRONT_LENGTH = 34`
   - `OPTIMAL_DEFAULT_RANK = 2.5`
   - Formula: $\text{rank} = \max(0, \text{round}(2.5 - (0.05 \times |34 - n|), 2))$
2. Preview table in `app/pages/import.vue` displays extracted metadata for incoming rows in the exact column order:
   - `Language 1` | `Text 1` | `Language 2` | `Text 2` | `Rank` | `Pronunciation` | `Memory Hook`

## Architecture & Data Flow

### 1. Configuration & Utilities (`server/utils/rank-config.ts` & shared utility)
Define configurable constants and the calculation helper:
```typescript
export const OPTIMAL_FRONT_LENGTH = 34;
export const OPTIMAL_DEFAULT_RANK = 2.5;

export function calculateOptimalRank(frontText: string): number {
  const n = frontText.trim().length;
  const calculatedRank = OPTIMAL_DEFAULT_RANK - (0.05 * Math.abs(OPTIMAL_FRONT_LENGTH - n));
  const roundedRank = Math.round(calculatedRank * 100) / 100;
  return Math.max(0, roundedRank);
}
```

### 2. CSV Import Endpoint (`server/api/import.post.ts`)
- Use `parseMetadata` for raw text 1 and text 2.
- Determine `front` text (after cleaning metadata tags).
- Determine rank:
  ```typescript
  const rank = meta1.rank ?? meta2.rank ?? calculateOptimalRank(front);
  ```
- Store the determined `rank` into Prisma `Flashcard.createMany`.

### 3. Import Preview UI (`app/pages/import.vue`)
- Update `ParsedRow` interface to include extracted/calculated metadata fields:
  ```typescript
  interface ParsedRow {
    lang1: string;
    lang2: string;
    text1: string;
    text2: string;
    rank: number;
    pronunciation: string;
    memoryHook: string;
  }
  ```
- When parsing CSV lines in `handleFileChange`, run `parseMetadata` on `text1` and `text2` to extract clean text, `pronunciation`, `memoryHook`, and resolve `rank` (either explicitly parsed or calculated via `calculateOptimalRank`).
- Update preview table headers and row cells:
  1. Language 1
  2. Text 1
  3. Language 2
  4. Text 2
  5. Rank
  6. Pronunciation
  7. Memory Hook

## Verification Plan
1. **Unit Verification**: Verify front text of length 34 returns rank 2.5, length 32 returns 2.4, length 100 returns 0.
2. **Preview Table UI**: Upload a test CSV containing metadata tags (e.g., `..p.SUR-seel ..m.sky ..4.3`) and standard text; verify columns order: Language 1, Text 1, Language 2, Text 2, Rank, Pronunciation, Memory Hook.
3. **Database Insertion**: Execute import and verify in database / application that flashcards inherit either explicit rank or calculated optimal rank.
