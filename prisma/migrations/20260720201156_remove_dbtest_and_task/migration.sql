-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "minutesToTestAgain" INTEGER NOT NULL DEFAULT 10
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "frontLanguage" TEXT NOT NULL,
    "backLanguage" TEXT NOT NULL,
    "pronunciation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'LEARNING',
    "rank" REAL NOT NULL DEFAULT 2.5,
    "memoryHook" TEXT,
    "copiedFromId" TEXT,
    CONSTRAINT "Flashcard_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flashcard_copiedFromId_fkey" FOREIGN KEY ("copiedFromId") REFERENCES "Flashcard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserFlashcardActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "whenActedUpon" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionTaken" TEXT NOT NULL,
    "actionDetails" TEXT,
    CONSTRAINT "UserFlashcardActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserFlashcardActivity_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "abbreviation" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "FlashcardTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flashcardId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "FlashcardTag_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FlashcardTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_abbreviation_key" ON "Tag"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "FlashcardTag_flashcardId_tagId_key" ON "FlashcardTag"("flashcardId", "tagId");
