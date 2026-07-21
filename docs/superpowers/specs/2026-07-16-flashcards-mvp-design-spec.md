# Flashcards Local MVP App Design Spec

## Goal Description
Implement a local MVP application for importing flashcards from Google Translate CSV files, testing them, ranking them using a high-precision slider (0.0 to 5.0), managing tags, and searching across all cards.

---

## User Review Required
> [!NOTE]
> - By default, authentication checks are bypassed locally using a mock user (`edwardtanguay@gmail.com`) to match your workflow requirements.
> - Database pushes will utilize Prisma db push to target your Turso LibSQL cloud database.

---

## Database Schema

```prisma
model User {
  id                 String                 @id @default(uuid())
  firstName          String
  lastName           String
  email              String                 @unique
  minutesToTestAgain Int                    @default(10)
  flashcards         Flashcard[]
  activities         UserFlashcardActivity[]
  userFlashcards     UserFlashcard[]
}

model Flashcard {
  id            String                 @id @default(uuid())
  ownerId       String
  owner         User                   @relation(fields: [ownerId], references: [id])
  front         String
  back          String
  frontLanguage String                 // e.g. "en", "fr", "es"
  backLanguage  String                 // e.g. "en", "fr", "es"
  createdAt     DateTime               @default(now())
  
  // Relations
  userFlashcards UserFlashcard[]
  activities     UserFlashcardActivity[]
  tags           FlashcardTag[]
}

model UserFlashcard {
  id          String        @id @default(uuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id])
  flashcardId String
  flashcard   Flashcard     @relation(fields: [flashcardId], references: [id], onDelete: Cascade)
  status      String        @default("LEARNING") // LEARNED, LEARNING, PARKED, DELETED
  rank        Float         @default(0.0)        // decimal from 0.0 to 5.0
  mnemonic    String?
  
  @@unique([userId, flashcardId])
}

model UserFlashcardActivity {
  id             String    @id @default(uuid())
  userId         String
  user           User      @relation(fields: [userId], references: [id])
  flashcardId    String
  flashcard      Flashcard @relation(fields: [flashcardId], references: [id], onDelete: Cascade)
  whenActedUpon  DateTime  @default(now())
  actionTaken    String    // IMPORTED, TESTED, EDITED, DELETED, PARKED
  actionDetails  String?
}

model Tag {
  id           String         @id @default(uuid())
  abbreviation String         @unique // e.g. "best", "fix"
  description  String?
  flashcards   FlashcardTag[]
}

model FlashcardTag {
  id          String    @id @default(uuid())
  flashcardId String
  flashcard   Flashcard @relation(fields: [flashcardId], references: [id], onDelete: Cascade)
  tagId       String
  tag         Tag       @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@unique([flashcardId, tagId])
}
```

---

## CSV Parser & Import (`npm run pd`)
1. **Target**: Any `.csv` file in `/import`.
2. **User Lookup**: Finds or creates User `edwardtanguay@gmail.com`.
3. **Card Orientation Logic**:
   - For each CSV row: `(Lang1, Lang2, Text1, Text2)`:
     - Map languages to ISO codes (e.g. `English` -> `en`, `French` -> `fr`).
     - If English is one of the languages: English is **front**, the other is **back**.
     - Otherwise: `Lang1` is **front**, `Lang2` is **back**.
4. **Database Injection**:
   - Insert new flashcards (prevent duplicates on owner + front + back).
   - Initialize `UserFlashcard` (status = `LEARNING`) and `UserFlashcardActivity` (action = `IMPORTED`).
5. **Post-Import File Movement**:
   - Move processed file to `/dev/backups/import/{original-basename}-{YYYY-MM-DD-HH-mm-ss}.csv` and remove from `/import`.

---

## Web UI & API Endpoints

### Frontend (Nuxt 3/4)
- **Search**: Active input to search across all flashcards (excluding deleted) matching text/mnemonic/tags.
- **Tag Filters**: Row of tag pills at the top to filter the testing queue.
- **Quiz Card**:
  - Displays Front text and language code (e.g. `en`).
  - Smooth flip interaction reveals the Back text, translation, and mnemonic.
  - **High-Precision Rank Slider**:
    - Value range: `0.0` to `5.0` (with precision e.g. `step="0.00001"`).
    - Label `0` as **"Useless"** and `5` as **"Very Useful"**.
    - Displays the current selection (e.g. `2.47562`).
    - `Save Rank & Next` button to save rating, log activity, and load next card.
  - **Action Controls**:
    - `Learned` / `Park` / `Delete` to update status.
    - `Edit` to modify card values or tags inline.

### Backend APIs
- `GET /api/flashcards` - Returns user's active learning queue.
- `GET /api/flashcards/search` - Searches all non-deleted flashcards.
- `PUT /api/flashcards/:id` - Updates status, rank, mnemonic, or values and records activity.
- `GET /api/tags` - Returns all tags.
- `POST /api/tags` - Creates a tag.
- `POST /api/flashcards/:id/tags` - Associates/dissociates a tag.
