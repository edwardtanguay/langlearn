---
name: create-site
description: Create a new standalone info-site in dev/info-sites/ with clean modern styling, an h1 title, and introductory text. Use when the user runs /create-site or asks to scaffold a new site under dev/info-sites.
---

# Create Info-Site Workflow

This skill scaffolds a new standalone static web page in `dev/info-sites/` based on a user-provided title.

## Procedure

### 1. Extract the Title
Extract the title argument from the user's prompt (e.g. `/create-site "First Lesson"` or "create site First Lesson" -> `"First Lesson"`).
If no title was provided, ask the user what the title should be before proceeding.

### 2. Determine Directory Slug
Convert the title to a URL-friendly kebab-case directory slug:
- Convert to lowercase.
- Replace spaces, underscores, and special characters with single hyphens (`-`).
- Trim any leading or trailing hyphens.
- Example: `"First Lesson"` -> `first-lesson`.

The target directory path will be:
`dev/info-sites/<slug>/`

### 3. Check for Collisions
Check if `dev/info-sites/<slug>` already exists.
- **If the directory already exists**: **STOP immediately**. Warn the user that `dev/info-sites/<slug>` already exists and do not overwrite or modify any existing files unless explicitly instructed by the user.

### 4. Create `index.html`
If the directory does not exist, create `dev/info-sites/<slug>/index.html`.

The file must include:
- Valid HTML5 boilerplate (`<!DOCTYPE html>`, `<html lang="en">`, `<head>`, `<meta charset="UTF-8">`, viewport meta).
- `<title>` matching the user's title.
- Embedded `<style>` block with clean, modern CSS:
  - System font stack (`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`).
  - Centered layout container (`max-width: 720px`, responsive padding).
  - Modern typography and clean color scheme (e.g., subtle card container, readable line height).
- An `<h1>` heading with the exact title requested.
- A `<p>` tag with a realistic, engaging introductory paragraph tailored to the topic implied by the title.

### 5. Confirmation
Confirm completion to the user and include a clickable markdown link to the generated file:
`[index.html](file:///c:/edward/projects/apps/langlearn/dev/info-sites/<slug>/index.html)`
