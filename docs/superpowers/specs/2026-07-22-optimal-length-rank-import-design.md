# Optimal Front Length Rank Calculation and Metadata Import Preview Design

## Overview
This design introduces optimal-length default rank calculation for imported flashcards, configures the metadata marker prefix (`METADATA_MARKER = '//'`), and updates the CSV import preview table to display extracted metadata attributes (Rank, Pronunciation, Memory Hook).

## Requirements & Constants

### 1. Central Config Constants
All metadata parsing and rank calculation constants are stored in `server/utils/rank-config.ts` (and shared utility) for single-point configuration:
- `METADATA_MARKER = '//'`
- `OPTIMAL_FRONT_LENGTH = 34`
- `OPTIMAL_DEFAULT_RANK = 3.5`

### 2. Metadata Marker (`//`)
- Examples of incoming metadata text:
  - `zwei Zeitformen //45 //m. eine Verbform ausfüllen` $\rightarrow$ Clean Text: `zwei Zeitformen`, Rank: `4.5`, Memory Hook: `eine Verbform ausfüllen`
  - `it's at the top of the page //43` $\rightarrow$ Clean Text: `it's at the top of the page`, Rank: `4.3`
  - `eyebrows //p.SUR-seel` $\rightarrow$ Clean Text: `eyebrows`, Pronunciation: `SUR-seel`

### 3. Default Rank Calculation (Optimal Length)
When importing flashcards from CSV:
- If no explicit rank tag (e.g. `//4.3` or `//43`) is present in card metadata, calculate rank based on the trimmed clean front text length $n$:
  - Formula: $\text{rank} = \max(0, \text{round}(3.5 - (0.05 \times |34 - n|), 2))$

### 4. CSV Import Preview Table Columns Order
Preview table in `app/pages/import.vue` displays extracted metadata for incoming rows in the exact column order:
- `Language 1` | `Text 1` | `Language 2` | `Text 2` | `Rank` | `Pronunciation` | `Memory Hook`

## Architecture & Data Flow

### 1. Configuration & Utilities (`server/utils/rank-config.ts`)
Define configurable constants and calculation helper:
```typescript
export const METADATA_MARKER = '//';
export const OPTIMAL_FRONT_LENGTH = 34;
export const OPTIMAL_DEFAULT_RANK = 3.5;

export function calculateOptimalRank(frontText: string): number {
  const n = frontText.trim().length;
  const calculatedRank = OPTIMAL_DEFAULT_RANK - (0.05 * Math.abs(OPTIMAL_FRONT_LENGTH - n));
  const roundedRank = Math.round(calculatedRank * 100) / 100;
  return Math.max(0, roundedRank);
}
```

### 2. Metadata Parser Updates (`server/utils/metadata-parser.ts`)
- Import `METADATA_MARKER` from `./rank-config`.
- Update metadata chunk scanner to look for `METADATA_MARKER` dynamically instead of hardcoded strings.
- Extract chunks separated by `METADATA_MARKER` markers up to next marker or end of string.
- Maintain existing parse rules for rank (e.g. `45` $\rightarrow$ `4.5`), pronunciation (`p.SUR-seel`), and memory hook (`m. eine Verbform ausfüllen`).

### 3. CSV Import Endpoint (`server/api/import.post.ts`)
- Use updated `parseMetadata` for raw text 1 and text 2.
- Determine `front` clean text.
- Resolve rank:
  ```typescript
  const rank = meta1.rank ?? meta2.rank ?? calculateOptimalRank(front);
  ```
- Save `rank`, `pronunciation`, `memoryHook` to Prisma.

### 4. Import Preview UI (`app/pages/import.vue`)
- Update `ParsedRow` interface:
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
- Run `parseMetadata` during file reading to generate clean `text1`, clean `text2`, extracted `pronunciation`, extracted `memoryHook`, and calculated/extracted `rank`.
- Preview table rendering order:
  1. `Language 1`
  2. `Text 1`
  3. `Language 2`
  4. `Text 2`
  5. `Rank`
  6. `Pronunciation`
  7. `Memory Hook`

## Verification Plan
1. **Parser Tests / Verification**:
   - `zwei Zeitformen //45 //m. eine Verbform ausfüllen` $\rightarrow$ clean text: `zwei Zeitformen`, rank: `4.5`, memoryHook: `eine Verbform ausfüllen`.
   - `it's at the top of the page //43` $\rightarrow$ clean text: `it's at the top of the page`, rank: `4.3`.
   - `eyebrows //p.SUR-seel` $\rightarrow$ clean text: `eyebrows`, pronunciation: `SUR-seel`.
2. **Optimal Length Rank Verification**:
   - Clean front text length 34 with no `//` rank tag $\rightarrow$ rank `2.5`.
   - Clean front text length 32 $\rightarrow$ rank `2.4`.
3. **Import Preview UI Verification**:
   - File upload preview displays columns in exact order: `Language 1`, `Text 1`, `Language 2`, `Text 2`, `Rank`, `Pronunciation`, `Memory Hook`.
