# Streamline Flashcard Import and Metadata Parsing Design Spec

## Executive Summary
This spec outlines the redesign of the CSV import system in `langlearn`. The goal is to:
1. Support parsing of `..` inline metadata (pronunciation, rank, memoryHook) at the end of phrase fields (`text1`/`text2`).
2. Optimize import execution speed for large datasets (e.g. 1,000–2,000 phrases) from 15–20 minutes down to < 0.5 seconds.
3. Guarantee atomic batch transactions (all-or-nothing rollback) on failure to prevent orphaned cards or partial imports.
4. Prevent duplicate card creation both against existing database records and within the CSV payload itself.

---

## 1. Metadata Parsing Specification

### 1.1 Metadata Syntax
Users can append metadata tags to phrase text fields (`text1` or `text2`) using the `..` prefix. A metadata chunk starts with `..` and continues until the next `..` or the end of the text.

Supported metadata formats:
- **Pronunciation Tag**: `..p.<pronunciation_text>`
  - Example: `..p.SUR-seel` $\rightarrow$ `pronunciation = "SUR-seel"`
- **Memory Hook Tag**: `..m.<memory_hook_text>`
  - Example: `..m.the sky` $\rightarrow$ `memoryHook = "the sky"`
- **Rank Tag**: `..<digits_or_decimals>`
  - `..43` $\rightarrow$ `rank = 4.3`
  - `..4` $\rightarrow$ `rank = 4.0`
  - `..4899` $\rightarrow$ `rank = 4.899`
  - `..4.3` $\rightarrow$ `rank = 4.3`
  - If no rank tag is present, default rank is `2.5`.

### 1.2 Text Cleaning
Before saving the flashcard, all `..` metadata chunks are stripped from `text1` and `text2`. Leading and trailing whitespace is trimmed.

---

## 2. Architecture & Data Flow

### 2.1 Metadata Parser Utility (`server/utils/metadata-parser.ts`)
A dedicated parser function handles text extraction:
```ts
export interface ParsedMetadataResult {
  cleanText: string
  pronunciation?: string
  memoryHook?: string
  rank?: number
}

export function parseMetadata(text: string): ParsedMetadataResult
```

### 2.2 Server Import Handler (`server/api/import.post.ts`)

#### Phase 1: Authentication & User Lookup
1. Authenticate user request via `requireAuth(event)`.
2. Fetch `dbUser` record from Prisma.

#### Phase 2: Single SELECT for Existing Cards
Perform a single query to retrieve all non-deleted flashcard `front` and `back` values for the user:
```ts
const existingCards = await prisma.flashcard.findMany({
  where: { ownerId: dbUser.id, status: { not: 'DELETED' } },
  select: { front: true, back: true }
})
```
Build a `Set` of normalized keys `${front.trim().toLowerCase()}|${back.trim().toLowerCase()}`:
- `existingSet = new Set(...)`
- `payloadSet = new Set()`

#### Phase 3: In-Memory Row Processing & Filtering
Loop over `body.rows`:
1. Resolve language mapping (`frontLanguage`, `backLanguage`).
2. Parse `text1` and `text2` using `parseMetadata()`. Combine metadata extracted from both text fields.
3. If clean `front.trim().toLowerCase() === back.trim().toLowerCase()`, skip card and add to `skippedCards`.
4. Generate key `${front.trim().toLowerCase()}|${back.trim().toLowerCase()}`.
5. If `existingSet.has(key)` OR `payloadSet.has(key)`, skip card and add to `skippedCards`.
6. Otherwise, add key to `payloadSet`, generate a new UUID for the card, and push to `cardsToCreate` and `activitiesToCreate` arrays.

#### Phase 4: Atomic Bulk Transaction
Execute a single `prisma.$transaction`:
```ts
await prisma.$transaction(async (tx) => {
  if (cardsToCreate.length > 0) {
    await tx.flashcard.createMany({ data: cardsToCreate })
    await tx.userFlashcardActivity.createMany({ data: activitiesToCreate })
  }
})
```

---

## 3. Error Handling & Rollback
- If an exception occurs at any point during `prisma.$transaction`, SQLite automatically rolls back the entire batch.
- The server throws an HTTP 500 error, and no partial records remain in the database.

---

## 4. Verification Plan

### Automated / Scripted Verification
1. **Unit Test / Script Test for Metadata Parser**:
   - Verify `parseMetadata("Wir verharrten ..p.SUR-seel ..43 ..m.the sky")` returns cleanText `"Wir verharrten"`, `pronunciation: "SUR-seel"`, `rank: 4.3`, `memoryHook: "the sky"`.
   - Verify `parseMetadata("test phrase ..4")` returns `rank: 4.0`.
   - Verify `parseMetadata("test phrase ..4.3")` returns `rank: 4.3`.
2. **Benchmark & Batch Import Test**:
   - Import a CSV with 1,000–2,000 rows. Verify completion time is < 1 second.
   - Verify zero duplicates created when importing the same file twice.
3. **Rollback Verification**:
   - Simulate a transaction failure and verify database row count remains unchanged.
