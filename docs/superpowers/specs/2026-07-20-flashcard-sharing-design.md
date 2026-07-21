# Flashcard Sharing and Duplication Design Spec

## Goal
To allow users to share flashcards and copy them to their own collection for personalized testing and editing. 

By duplicating cards upon copying:
- A user's card is completely isolated: changes/deletions made by the original owner do not affect secondary users.
- We can completely eliminate the `UserFlashcard` join table, merging study state directly into the `Flashcard` model.
- Creator attribution is retained via a self-referencing relationship.
- Soft-deletion is handled cleanly by setting the card's `status` to `"DELETED"`, avoiding the need for an extra `isDeleted` column.

---

## Proposed Database Schema Changes

We will merge the study state fields (`status`, `rank`, and `memoryHook` formerly `mnemonic`) from `UserFlashcard` directly into `Flashcard`. We will also add a self-referencing relation `copiedFromId` and delete the `UserFlashcard` model.

```prisma
model User {
  id                 String                 @id @default(uuid())
  firstName          String
  lastName           String
  email              String                 @unique
  minutesToTestAgain Int                    @default(10)
  flashcards         Flashcard[]
  activities         UserFlashcardActivity[]
}

model Flashcard {
  id            String                 @id @default(uuid())
  ownerId       String
  owner         User                   @relation(fields: [ownerId], references: [id])
  front         String
  back          String
  frontLanguage String
  backLanguage  String
  pronunciation String?
  createdAt     DateTime               @default(now())
  
  // Study progress state merged directly into the card
  // Soft-deletion is indicated by setting status = "DELETED"
  status        String                 @default("LEARNING")
  rank          Float                  @default(2.5)
  memoryHook    String?                // Formerly "mnemonic"
  
  // Track original creator card (since cards are soft-deleted, they are never hard-deleted)
  copiedFromId  String?
  copiedFrom    Flashcard?             @relation("CardCopies", fields: [copiedFromId], references: [id], onDelete: Restrict)
  copies        Flashcard[]            @relation("CardCopies")
  
  activities     UserFlashcardActivity[]
  tags           FlashcardTag[]
}
```

---

## Flashcard Sharing & Duplication Flow

### 1. Adding/Copying another User's Flashcard
When User B decides to add/test themselves on a card originally owned by User A:
1. A new `Flashcard` record is created for User B:
   - `ownerId`: User B's ID.
   - `front`, `back`, `frontLanguage`, `backLanguage`, `pronunciation`: Copied from User A's card.
   - `copiedFromId`: Set to User A's card ID.
   - `status`: `"LEARNING"` (default).
   - `rank`: `2.5` (default).
   - `memoryHook`: `null` (default, or copied if they want to adopt User A's memory hook).
2. The user's study sessions and tags will target this new independent `Flashcard` record.

### 2. Modifying or Soft-Deleting the Original Card
- If User A modifies their original card:
  - User B's copied card content and study stats remain completely unaffected (fully isolated).
- If User A deletes their card:
  - User A's card `status` is set to `"DELETED"`.
  - User B's copied card remains active and unaffected.
  - Since it is a soft-delete, the original database record remains intact, allowing User B to still see that their card was copied from User A, and see who originally owned it via `copiedFrom.owner`.

### 3. Displaying Social Metrics (Optional Expansion)
- **Attribution**: When User B views their copied card, we can fetch `copiedFrom.owner` to display "Original Creator: [User A]".
- **Popularity**: To see how many times a card was shared/copied:
  ```ts
  const copyCount = await prisma.flashcard.count({
    where: {
      copiedFromId: originalCardId,
      NOT: {
        status: "DELETED",
      },
    },
  });
  ```

---

## Verification Plan

### Automated Tests
- Integration tests simulating User A creating a card, User B copying it, User A editing/deleting their card (setting status to `"DELETED"`), and verifying that User B's card is preserved and attributes correctly.
