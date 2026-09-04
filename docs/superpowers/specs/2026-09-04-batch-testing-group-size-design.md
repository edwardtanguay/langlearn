# Design Specification: Batch Flashcard Testing Mode & Group Size

**Date:** 2026-09-04  
**Status:** Approved  
**Topic:** Batch Testing Mode, Configurable Group Size, Dynamic Language Filter & Strategy Selection  

---

## 1. Overview & Goals

LangLearn users need a structured, mastery-oriented workflow when practicing flashcards:
1. Users practice in focused batches of $N$ flashcards at a time (default: **10**).
2. The user cycles through the batch, keeping unlearned cards in rotation until **every card in the batch is marked as Learned** (or Parked/Deleted).
3. Once all cards in the batch are mastered, the user progresses to the next batch.
4. The user can configure their preferred **"Testing Group Size"** in their Profile, with a helpful explanation.
5. On the testing screen, the user can easily select:
   - **Language Filter Dropdown:** Lists `"All languages"` plus each language that has at least $N$ cards available for the chosen strategy.
   - **Strategy Dropdown:** Lets the user choose how batches are composed using clean, recognizable labels:
     - `Last imported`
     - `Most important`
     - `Review learned`
     - `Phrases with à/de`
   - A subtle info explanation below the dropdowns detailing the active mode.

---

## 2. Architecture & Data Model

### 2.1 Database Changes (`prisma/schema.prisma`)
Add a new configurable field `testingGroupSize` to the `User` model:
```prisma
model User {
  id                 String                 @id @default(uuid())
  firstName          String
  lastName           String
  email              String                 @unique
  role               String                 @default("member")
  minutesToTestAgain Int                    @default(10)
  dailyTakeGoal      Int                    @default(100)
  testingGroupSize   Int                    @default(10)
  flashcards         Flashcard[]
  activities         UserFlashcardActivity[]
  versionItems       VersionItem[]          @relation("UserVersionItems")
  mobileImports      MobileImport[]
}
```

### 2.2 Profile APIs
* **`GET /api/user/me`**: Returns `testingGroupSize` alongside existing user profile fields.
* **`POST /api/user/profile`**: Accepts `testingGroupSize: number` (clamped between 3 and 50) and updates the database.

---

## 3. Backend Endpoints

### 3.1 Language Availability Endpoint (`GET /api/flashcards/batch-languages`)
* **Parameters:**
  * `strategy`: `'last_imported' | 'most_important' | 'review_learned' | 'phrases_a_de'`
* **Functionality:**
  1. Identifies all cards matching the user ID and the strategy criteria.
  2. Aggregates card counts grouped by `backLanguage`.
  3. Filters out any language where `count < user.testingGroupSize`.
  4. Returns a JSON array containing the eligible language codes and counts, e.g.:
     ```json
     [
       { "code": "fr", "name": "French", "count": 28 },
       { "code": "de", "name": "German", "count": 14 }
     ]
     ```
     Languages with fewer than the threshold (e.g., Spanish with only 4 cards) are excluded from this list.

### 3.2 Batch Cards Endpoint (`GET /api/flashcards/batch`)
* **Parameters:**
  * `strategy`: One of `last_imported`, `most_important`, `review_learned`, `phrases_a_de` (default: `most_important`).
  * `language`: Language code (e.g. `fr`), or omitted/`'all'` for all languages.
  * `limit`: Number of cards to fetch (defaults to `user.testingGroupSize`, clamped between 1 and 50).
  * `excludeIds`: Optional comma-separated list of flashcard IDs to avoid repeating immediately across back-to-back batches.
* **Strategy Queries:**
  * **`last_imported`**:
    * Filter: `ownerId = user.id`, `status = 'LEARNING'`, `nextTestTime = null` (untested/new).
    * Order: `createdAt: 'desc'`.
  * **`most_important`**:
    * Filter: `ownerId = user.id`, `status = 'LEARNING'`.
    * Order: `rank: 'desc'`, `id: 'asc'`.
  * **`review_learned`**:
    * Filter: `ownerId = user.id`, `status = 'LEARNED'`.
    * Order: `rank: 'desc'`, `id: 'asc'`.
  * **`phrases_a_de`**:
    * Filter: `ownerId = user.id`, `status != 'DELETED'`, card has tag where `abbreviation IN ('à', 'de')`.
    * Order: `rank: 'desc'`, `id: 'asc'`.
* **Partial Batch Graceful Fallback:**
  * If fewer matching cards exist than `limit` (e.g. 6 available total), returns all 6 matching cards.

---

## 4. Frontend UI & Interaction Design

### 4.1 User Profile Page (`app/pages/user.vue`)
* Add a new card section for **Testing Group Size**:
  * **Title:** Testing Group Size
  * **Input:** Number input field (min: 3, max: 50, default: 10) with an optimistic Save button.
  * **Explanation:**
    > *"Choose how many flashcards you test in a single batch. LangLearn will cycle through this group until you mark all of them as learned, before loading the next batch."*
  * **Behavior:** Optimistic updates, spinner while saving, brief green "Saved!" confirmation message.

### 4.2 Flashcard Testing Page (`app/pages/flashcard/[[id]].vue`)

#### A. Controls Header (Above Flashcard)
* **Language Dropdown:**
  * Fixed first option: `All languages`
  * Dynamically populates with eligible languages (languages having $\ge N$ cards for the active strategy).
  * If a strategy change reduces the current language's available cards below $N$, it smoothly defaults back to `All languages`.
* **Strategy Dropdown:**
  * Options:
    1. `Last imported`
    2. `Most important`
    3. `Review learned`
    4. `Phrases with à/de`
* **Subtle Info Explainer:**
  * A neat, muted caption under the dropdowns describing the current mode:
    * *Last imported:* "Testing the newest cards you imported that haven't been tested yet."
    * *Most important:* "Practicing your highest-ranked unlearned flashcards."
    * *Review learned:* "Refreshing flashcards you previously marked as learned."
    * *Phrases with à/de:* "Targeted practice on phrases containing prepositions à and de."

#### B. Batch Progress Header
* Positioned directly above the flashcard container:
  * Text indicator: `Batch: 4 / 10 Learned`
  * Visual progress dots/capsules:
    * 🟢 Green: Cards in this batch marked as "Learned".
    * ⚪ Neutral/Gray: Cards still unlearned in the active cycle.

#### C. Active Batch Cycling Loop
* The batch starts with $N$ cards stored in active component state.
* **When user clicks "Keep Testing":**
  * Current card animates out (`card-exit`).
  * Card is moved to the back of the unlearned queue within this batch.
  * Next unlearned card animates in (`card-enter`).
  * Database records action `MARKED_AS_KEEP_TESTING`.
* **When user clicks "Learned":**
  * Current card is removed from the active unlearned cycle.
  * Batch progress indicator updates (one dot turns green, counter increments).
  * Database records action `MARKED_AS_LEARNED` with status `LEARNED`.
  * If unlearned cards remain in the batch, the next unlearned card slides in.
* **When user clicks "Park" or "Delete":**
  * Card is removed from the batch cycle and database status is updated.
* **Batch Completion State (0 Unlearned Cards Remaining):**
  * Replaces card view with a celebratory completion overlay:
    * 🎉 **"Batch Complete!"**
    * *"You've mastered all 10 cards in this batch."*
    * Primary button: `Start Next 10 Cards` (with auto-advance countdown after 3 seconds).
  * Clicking loads the next batch from `/api/flashcards/batch`.

---

## 5. Non-Functional Requirements & Design Principles
1. **Zero-Latency In-Batch Cycling:** Transitions between unlearned cards in an active batch are pure client-side queue rotations without waiting for network responses.
2. **Optimistic UI:** All button clicks update local queue and stats immediately, syncing to the server asynchronously (`agents.md`).
3. **Graceful Edge Cases:** If a strategy has fewer than $N$ cards, the batch adapts to the count available without crashing or blocking the user.
4. **Color Guidelines Compliance:** Respects `agents.md` language color coding guidelines across UI badges and dropdown markers.
