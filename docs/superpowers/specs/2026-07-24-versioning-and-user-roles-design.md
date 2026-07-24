# Versioning, Features, Bug-Fixes, & User Roles System Design

**Date**: 2026-07-24  
**Status**: Approved  

---

## 1. Overview & Goals

The objective of this feature set is to introduce a comprehensive versioning and task tracking framework for **LangLearn**, manage administrative roles, and refine user access controls across the platform.

Key goals:
1. **User Roles**: Differentiate `admin` and `member` roles. Assign `admin` to `edwardtanguay@gmail.com` and default all other users to `member`.
2. **Quick-Add Idea Drawer**: A subtle lightbulb icon in the navigation bar allowing any logged-in user to submit bug fixes or feature requests on the fly.
3. **Automatic Versioning Logic**: Intelligently assign new ideas/items to current `IN_PROGRESS` or `FUTURE` versions, or auto-increment and create a new version (`0.x.0`).
4. **Dev Console Reorganization**: Restructure `/dev` into a desktop-only, admin-only tabbed hub (`Versions`, `Flashcard Flow`, `Users`).
5. **Import Rate Limiting**: Restrict `member` users to importing a maximum of 100 phrases per day, while granting `admin` unlimited imports.
6. **Revised Main Menu & About Page**: Reorder navigation items and upgrade `/about` with a hero section, version timeline, item classification icons, and subtle admin edit capabilities.

---

## 2. Data Models (`prisma/schema.prisma`)

### Schema Changes

```prisma
model User {
  id                 String                 @id @default(uuid())
  firstName          String
  lastName           String
  email              String                 @unique
  role               String                 @default("member") // "admin" | "member"
  minutesToTestAgain Int                    @default(10)
  flashcards         Flashcard[]
  activities         UserFlashcardActivity[]
  versionItems       VersionItem[]          @relation("UserVersionItems")
}

model Version {
  id            String        @id @default(uuid())
  versionNumber String        @unique // e.g. "0.1.0", "0.2.0"
  status        String        @default("FUTURE") // "PUBLISHED" | "IN_PROGRESS" | "FUTURE"
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  versionItems  VersionItem[]
}

model VersionItem {
  id                 String   @id @default(uuid())
  versionId          String
  version            Version  @relation(fields: [versionId], references: [id], onDelete: Cascade)
  type               String   @default("BUGFIX") // "FEATURE" | "BUGFIX"
  status             String   @default("PROPOSED") // "PROPOSED" | "IN_PROGRESS" | "IMPLEMENTED"
  body               String
  startedByUserId    String?
  startedByUser      User?    @relation("UserVersionItems", fields: [startedByUserId], references: [id])
  orderWithinVersion Int      @default(1)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

### Initial Seed Data (`prisma/seed.ts`)

- `Version 0.1.0` (`status: "PUBLISHED"`)
  - Initial features: Flashcard testing engine, optimal front-text length rank calculation, CSV web import, Kinde Google auth.
- `Version 0.2.0` (`status: "IN_PROGRESS"`)
  - Initial item: Versioning, Features, & Bug-Fixes tracking system.

---

## 3. Authentication & Authorization

### Role Management
- Default role for new users: `"member"`.
- Automated Admin Promotion: In `server/utils/auth.ts`, whenever `requireAuth(event)` executes, if the authenticated user's email is `edwardtanguay@gmail.com` and their database role is not `"admin"`, update their role to `"admin"`.
- Utility function `requireAdmin(event)`:
  - Calls `requireAuth(event)`.
  - Verifies `dbUser.role === 'admin'`.
  - Throws HTTP 403 `Forbidden: Admin access required` if the user is not an admin.

---

## 4. Quick-Add Idea Drawer (`Navigation.vue`)

- **Trigger**: A lightbulb icon situated in the navigation header bar (visible for all logged-in users on mobile and desktop).
- **Drawer / Banner UI**:
  - Smooth top slide-down container.
  - Radio buttons: `Bug-fix` (default) vs `Feature`.
  - Textarea: `versionItem.body` without label, with placeholder *"Describe a feature idea or bug fix..."*.
  - Action buttons: `Submit Idea` and `Cancel`.
- **Auto Version Assignment Endpoint** (`POST /api/version-items/quick-add`):
  1. Query version with `status == "IN_PROGRESS"`.
  2. If found, assign `versionId` to it.
  3. If none found, query version with `status == "FUTURE"` (oldest created).
     - If found, update its status to `"IN_PROGRESS"` and assign `versionId` to it.
  4. If neither exists:
     - Find the highest existing `versionNumber` (e.g. `0.1.2`).
     - Increment the minor version number (e.g. `0.2.0`).
     - Create a new `Version` with `versionNumber: "0.2.0"` and `status: "IN_PROGRESS"`.
     - Assign `versionId` to this newly created version.
  5. Set `orderWithinVersion = (max existing order in version) + 1`.

---

## 5. Dev Page Reorganization (`app/pages/dev.vue` & Sub-Components)

- **Access Controls**:
  - Restricted to `admin` role.
  - Desktop-only UI (`hidden md:block`). Displays a mobile fallback notice when screen width is `< 768px`.
- **Sub-Menu Tabs**:
  1. **Versions**:
     - Accordion list of all versions sorted by `versionNumber`.
     - Displays version status badges (`PUBLISHED`, `IN_PROGRESS`, `FUTURE`).
     - List of items with `FEATURE` / `BUGFIX` tags and `PROPOSED` / `IN_PROGRESS` / `IMPLEMENTED` statuses.
     - Reordering: Up / Down action buttons updating `orderWithinVersion`.
     - Full CRUD modals for Version and VersionItem management.
  2. **Flashcard Flow**:
     - Houses existing testing countdown timer controls, card priority simulation, and debug tools.
  3. **Users**:
     - Searchable data table of registered users.
     - Allows admins to edit user entry details and toggle role between `member` and `admin`.

---

## 6. Daily Import Limit (100 Phrases / Day)

- **Server Enforcement (`POST /api/import`)**:
  - Check authenticated user role.
  - If `role === 'member'`, calculate:
    ```typescript
    const countToday = await prisma.flashcard.count({
      where: {
        ownerId: user.id,
        createdAt: { gte: startOfTodayUTC }
      }
    });
    ```
  - If `countToday + incomingCards.length > 100`, reject request with HTTP 400: *"Daily limit exceeded. Non-admin users are limited to 100 imported phrases per day."*
- **Import Page UI (`app/pages/import.vue`)**:
  - Displays dynamic daily import counter banner:
    - Member: *"Daily Allowance: 35 / 100 phrases used today"*
    - Admin: *"Daily Allowance: Unlimited (Admin)"*

---

## 7. Navigation & Revised About Page

### Navigation Menu Order
1. **Flashcards** (`/`)
2. **Import** (`/import`)
3. **Dev** (`/dev` - desktop only, admin only)
4. **About** (`/about`)
5. **User Profile / Logout**

### Revised About Page (`app/pages/about.vue`)
- **Introductory Hero**:
  - Left: Clean vector/SVG language learning symbol representing rapid flashcard learning.
  - Right: Mission statement: *"LangLearn takes advantage of modern, free tools like Google Translate, AI search, to help you learn languages faster and in a more self-directed, personal approach."*
- **Version Roadmap Section**:
  - Structured card layout displaying versions and version items.
  - Custom iconography for version states, Feature items (sparkles ✨), and Bug-fix items (bug 🐛).
- **Admin Inline Editing**:
  - Subtle pencil edit icon next to versions and items when viewed by an `admin`.
  - Clicking pencil triggers quick-edit modal to update text or status directly.

---

## 8. Verification & Testing Strategy

1. **Prisma Migrations**: Run `npx prisma db push` or migration step to update SQLite schema.
2. **Role Verification**: Log in as `edwardtanguay@gmail.com` to verify auto-promotion to `admin` and access to `/dev`. Log in as another account to verify `member` restrictions.
3. **Quick-Add Test**: Click the lightbulb icon, submit a bug fix and feature request, verify automatic version assignment (`0.2.0` `IN_PROGRESS`).
4. **Dev Page Verification**: Test tab switching between `Versions`, `Flashcard Flow`, and `Users`. Verify item reordering up/down.
5. **Import Limit Test**: Attempt importing 101 phrases as a `member` user to confirm rate limit rejection.
6. **About Page Verification**: Confirm layout, icons, public view, and admin edit popups.
