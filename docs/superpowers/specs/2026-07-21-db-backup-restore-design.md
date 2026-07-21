# Database Backup & Restore Design

## Overview
Implement a native SQLite backup and restore mechanism for the online Turso (LibSQL) database, utilizing the `@libsql/client` embedded replica functionality to fetch exact `.sqlite` files, and generating specialized restore scripts to push data back to the remote database safely.

## Requirements
1. `npm run db-backup`: Downloads a complete `.sqlite` replica from the remote database and saves it into `/dev/backups/database/`.
2. `npm run db-restore`: Discovers the latest backup, confirms the action, securely empties the remote tables, and inserts the backed-up data.
3. Both scripts should include migration-awareness to prevent restoring a backup that expects an older or different schema shape.

## Architecture

### 1. The Backup Script (`scripts/db-backup.ts`)
- **Connection**: Initializes a LibSQL client pointing to a local file, with `syncUrl` set to the remote database URL.
- **Migration Check**: Before syncing, it queries the `_prisma_migrations` table to find the name of the most recently applied migration.
- **File Generation**: 
  - Names the file using the format: `langlearn-data-[YYYY-MM-DD-HH-mm-ss]-migration-[migration_name].sqlite`.
  - Example: `langlearn-data-2026-07-21-09-43-20-migration-20240315_init.sqlite`
- **Execution**: Calls `.sync()` to perform a binary download of the entire database.

### 2. The Restore Script (`scripts/db-restore.ts`)
- **Discovery**: Scans `/dev/backups/database/` and finds the most recent `.sqlite` file (based on timestamp).
- **Migration Validation**: 
  - Parses the `[migration_name]` from the backup filename.
  - Queries the remote database's `_prisma_migrations` table for its current migration state.
  - If the migration in the backup filename does **not** match the remote database's latest migration, it displays a highly visible warning: `WARNING: Schema Mismatch! Backup was created under migration [X], but remote is on [Y]. App might break. Proceed anyway?`
- **Confirmation**: Pauses execution and warns the user: `You are about to replace the current database with a backup from [Date]. Proceed? (y/N)`. Default is NO.
- **Execution (Data Wipe & Insert)**:
  - Connects to the local backup SQLite file.
  - Extracts all rows from the core tables.
  - Uses a transaction (if possible via LibSQL batches) on the remote database to:
    1. Temporarily disable foreign keys (if supported) or delete data in the correct child-first order (e.g., `UserFlashcardActivity` -> `FlashcardTag` -> `Flashcard` -> `User` -> `Tag`).
    2. Insert all data from the backup in the correct parent-first order.
  - The `_prisma_migrations` table itself is left untouched on the remote side, as we only want to restore application data, not roll back the remote migration history.

## Verification
- Run `npm run db-backup` and ensure the file is generated with the correct timestamp and migration name.
- Add some dummy data, run `npm run db-restore`, and ensure the remote database correctly reverts to the state captured in the backup, without throwing foreign key errors.
