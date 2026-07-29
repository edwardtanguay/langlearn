# Dev Page, Idea Adding, and Minimal Versions Redesign - Design Spec

**Date:** 2026-07-24  
**Status:** Approved  

---

## 1. Overview & Goals

This specification details four key UI/UX and database enhancements across the LangLearn application:
1. **Dev Page Navigation & Cleanliness**: Update tab order to `Flashcard Flow` (default), `Versions`, `Users`. Remove tab icons and remove all "syncing" background status messages during sub-page switching.
2. **Idea Adding ("Have an idea?")**: Center the quick-add drawer trigger between the user profile name and "Flashcards" link in the top navigation bar, rename it to "Have an idea?", remove drawer title text, and connect the type selection control to the top of the text input area as connected pills/tabs.
3. **Minimal Versions Display (Dev Page)**: Strip away colorful panels, collapsible wrappers, status pills, and item count badges. Display versions and their items as minimal bulleted text lists grouped under indented `features` and `bug fixes` headings (suppressing empty group headings). Support item inline text links (`up | down | edit | delete | add`) where `add` inserts a new item directly after the target item. Add `publishDate` field to `Version` database model and expose it in version editing.
4. **Minimal Versions Display & Admin Editing (About Page)**: Apply the identical minimal version rendering to `/about`, allowing logged-in admin users to perform full CRUD operations directly on the About page.

---

## 2. Technical Architecture & Database Schema

### 2.1 Prisma Schema Change
Update `prisma/schema.prisma` to add `publishDate` to the `Version` model:

```prisma
model Version {
  id            String        @id @default(uuid())
  versionNumber String        @unique
  status        String        @default("FUTURE")
  publishDate   DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  versionItems  VersionItem[]
}
```

### 2.2 Server API Updates
- **`/api/dev/versions` & `/api/versions/public`**: Include `publishDate` in query responses and sort versions predictably (e.g. by `publishDate` or `versionNumber`).
- **`/api/dev/versions/[id]` (PUT/POST)**: Accept `publishDate` parameter (ISO string or null).
- **`/api/dev/version-items/reorder` (or inline reordering logic)**: Endpoint/logic to recalculate `orderWithinVersion` when inserting an item at a specific rank position or moving items `up`/`down`.

---

## 3. Detailed Component Specifications

### 3.1 Top Navigation & Idea Drawer (`Navigation.vue` & `QuickAddIdeaDrawer.vue`)
- **Navigation Placement (`Navigation.vue`)**:
  - Position `<QuickAddIdeaDrawer>` directly between the User Avatar/Name block and the `Flashcards` navigation item.
- **Drawer Trigger & Styling (`QuickAddIdeaDrawer.vue`)**:
  - Rename trigger button label from `Idea` to `Have an idea?`.
  - Remove the inner drawer title line `"Have an Idea or Bug Fix?"`.
  - **Connected Pills Control**: Implement segmented selector buttons for `Bug fix` / `Feature` directly attached to the top border of the `textarea` container (styled like connected tabs resting on top of the text field).

### 3.2 Developer Page (`dev.vue`)
- **Tabs Restructuring**:
  - Set default active tab to `'flashcard-flow'`.
  - Order tabs: `Flashcard Flow` (default), `Versions`, `Users`.
  - Remove all Heroicons (`WrenchScrewdriverIcon`, `HashtagIcon`, `UserGroupIcon`) from tab headers.
  - Remove the `isBackgroundLoading` / `"Synching..."` indicator banner when user clicks or switches sub-page tabs.
- **Minimal Version List Rendering**:
  - Remove outer background boxes, card borders, toggle chevron buttons, status pills (`IN_PROGRESS`, `PUBLISHED`), and count text `(X items)`.
  - Render version title as plain text header: `v1.2.0 (Published YYYY-MM-DD)` or `v1.2.0` if `publishDate` is null. Beside version header, include `edit` link opening modal with version number and a date picker (`<input type="date">`).
  - Item sectioning:
    - Group items into `features` and `bug fixes`.
    - If a group contains items, render header `features` (or `bug fixes`) and list items as indented bullets (`• <item body>`).
    - If a group has no items, do not render its header.
  - Inline CRUD Links:
    - Next to each bullet item, render simple text links: `up | down | edit | delete | add`.
    - `add`: Opens an item creation prompt/modal preset with `orderWithinVersion` ranked immediately after the clicked item.
    - `up` / `down`: Swaps rank order with adjacent item within the same version.

### 3.3 About Page (`about.vue`)
- Replace current colorful cards and pills in the roadmap section of `about.vue` with the same minimal bulleted text format.
- Show `publishDate` next to versions.
- When `isAdmin` is `true`, render the exact same inline text CRUD links (`up | down | edit | delete | add`) and version edit controls so admins can manage versions directly from `/about`.

---

## 4. Verification Plan

1. **Database Schema Verification**:
   - Verify `npx prisma db push` or migration applies cleanly.
2. **UI & Navigation Verification**:
   - Test tab order and active state on `/dev`. Confirm no "syncing" message appears when clicking tabs.
   - Confirm trigger in top nav displays "Have an idea?" positioned between User Profile and "Flashcards".
   - Confirm drawer displays connected pills flush on top of textarea and lacks header title line.
3. **Minimal Versions & CRUD Verification**:
   - Verify versions on both `/dev` and `/about` display minimal bullets under `features` / `bug fixes`.
   - Verify editing version `publishDate` using date picker updates database and reflects formatted date.
   - Verify clicking `add` inserts a new item below the clicked item; verify `up` and `down` reorders correctly.
