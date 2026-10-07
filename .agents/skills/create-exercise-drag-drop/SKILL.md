---
name: create-exercise-drag-drop
description: Create a standalone language learning exercise web page under dev/info-sites/ featuring drag-and-drop vocabulary matching, CEFR-graded reading texts, and discussion prompts modeled after dijon-neighborhoods. Uses a /grill-me interview to align on content and design before generation. Use when the user runs /create-exercise-drag-drop or asks to create a drag-and-drop vocabulary exercise site.
---

# Create Drag & Drop Exercise Site Workflow

This skill generates a complete, self-contained interactive language learning website in `dev/info-sites/<slug>/index.html` modeled on the layout, interaction design, and pedagogical structure of `dev/info-sites/dijon-neighborhoods/index.html`. It incorporates the `/grill-me` skill to conduct an interactive interview to lock down pedagogical choices, section breakdowns, and aesthetics before generating the page.

---

## 1. Required Parameters & Validation

Every invocation requires two parameters:
1. **Topic**: The subject of the exercise (e.g. `French departments`, `Spanish culinary traditions`, `German renewable energy`).
2. **Language + Level**: The target language and target CEFR proficiency level (e.g. `French B1`, `Spanish B2`, `German A2`, `Italian C1`).

### Interactive Validation Rule
- If **either parameter is missing** from the user's prompt (e.g., the user only provided a topic or only a level, or invoked `/create-exercise-drag-drop` without arguments), **STOP and prompt the user** to provide the missing parameter(s) before proceeding.
- Do not make assumptions or default to arbitrary topics/languages without explicit user confirmation.

---

## 2. Determine Directory Slug & Collision Check

1. Convert the topic into a URL-friendly, kebab-case directory slug:
   - Convert to lowercase.
   - Replace spaces, underscores, and special characters with hyphens (`-`).
   - Remove accents and diacritics.
   - Strip leading and trailing hyphens.
   - *Example*: `"French Departments"` -> `french-departments`.
2. Construct the target directory path:
   `dev/info-sites/<slug>/`
3. **Collision Detection**:
   - Check if `dev/info-sites/<slug>/` already exists.
   - **If the directory exists**: **STOP immediately**. Warn the user that `dev/info-sites/<slug>` already exists and ask how they would like to proceed (e.g., choosing a different slug or explicitly confirming overwrite). Do NOT silently overwrite existing work.

---

## 3. Grilling Phase (`/grill-me`)

Before generating any code or content, run a grilling interview following the `/grill-me` (and `grilling`) skill discipline to resolve all pedagogical, structural, and design decisions with the user.

### Grilling Rules:
- **Relentless Interview**: Interview the user about the exercise scope, content structure, and design until reaching a shared understanding. Walk down each branch of the decision tree, resolving dependencies between decisions one-by-one.
- **One Question at a Time**: Ask questions strictly **one at a time**, waiting for feedback on each question before proceeding. Never ask multiple questions at once.
- **Provide Recommended Answers**: For each question, provide a recommended answer so decisions can be made swiftly.
- **Look Up Facts, Ask Decisions**: If a fact can be found in the filesystem or existing sites, look it up rather than asking. Put all decisions to the user.
- **Hard Gate**: Do NOT proceed to writing HTML, scripts, or content until the user confirms a shared understanding has been reached.

### Decision Points to Grill:
1. **Section Count & Breakdown**: Confirm the exact number of sections (typically 5 to 8) and propose specific thematic titles/subtopics for each section.
2. **Vocabulary & Level Calibration**: Confirm the lexical focus, register, and difficulty suited to the CEFR level, identifying any particular domain vocabulary to feature.
3. **Reading Text Tone & Format**: Confirm narrative or editorial style (e.g., cultural overview, city guides, personal reflections, historical vignettes). Propose the standard default of ~300 words per reading text unless the user specifies otherwise.
4. **Visual & Color Theme**: Propose topic-harmonized accent palette colors (e.g., warm terracotta, emerald green, Mediterranean azure, burgundy).
5. **Discussion Prompts**: Align on the style and focus of the discussion questions (e.g., conversational prompts, analytical debate, personal experiences).

---

## 4. Pedagogical Content Specifications

Generate **5 to 8 thematic sections** (or the specific count requested by the user) appropriate for the topic and graded to the specified CEFR level:

### Target Language Immersion
- **All page content and UI chrome must be in the target language** (e.g. French for French B1, Spanish for Spanish B2).
- Adapt navigation buttons, instructions, score badges, modal messages, and headings into natural, grammatically correct target language.

### For each section:
1. **Section Header**:
   - Section number badge (e.g. `Section 01`, `Section 02`).
   - Category / sub-theme badge.
   - Clear, evocative title.
2. **Vocabulary Word Bank (5 words per section)**:
   - 5 key lexical terms suited to the CEFR level.
   - Shuffled in the word bank container.
3. **5 Definition Cards**:
   - Concise, learner-friendly definition in the target language.
   - Contextual quote / example sentence demonstrating the word in use.
   - Matching target word (hidden until matched or tapped).
4. **Reading Passage (Texte de Lecture)**:
   - Standard length of **~300 words** (typically 2 to 4 well-written paragraphs) at the specified CEFR level unless the user specifies otherwise.
   - Natural inclusion of all 5 vocabulary words from the section.
   - Each vocabulary occurrence wrapped in `<span class="vocab-word" tabindex="0" data-tooltip="...">` showing the definition on hover/focus.
5. **Discussion Question (Question de Discussion)**:
   - An open-ended, engaging question prompting personal reflection or classroom debate based on the reading passage.

---

## 5. UI Design & Styling Specifications

Follow the clean, modern editorial design system from `dijon-neighborhoods`:

- **Single Self-Contained File**: Everything (`<!DOCTYPE html>`, `<style>`, HTML, `<script>`) contained inside `index.html`. No external CSS/JS dependencies or image requirements.
- **CSS Custom Properties**:
  - Light editorial color scheme (`--bg-body: #f8fafc`, `--bg-card: #ffffff`, `--text-main: #0f172a`, `--text-muted: #475569`).
  - Topic-harmonized accent palette (e.g., deep blue, terracotta, emerald, or wine red depending on the subject culture).
  - Clean shadows, subtle borders (`#e2e8f0`), rounded corners (`border-radius: 10px` to `16px`).
- **Typography & Layout**:
  - System font stack (`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`).
  - Max container width ~900px, responsive padding.
- **Header & Navigation**:
  - Sticky top navbar with blur backdrop (`backdrop-filter: blur(10px)`).
  - Brand pill badge (e.g., `TOPIC • Level`).
  - Dropdown menu (Nuxt UI style) to jump smoothly to any section.
  - Global score pill displaying current progress (e.g., `X / Total words`).
  - "Reset all" button triggering a confirmation modal.
- **Modal Confirmation Dialog**:
  - Centered overlay modal with backdrop blur for confirming full progress reset.

---

## 6. Interactive Mechanics Specifications

Implement vanilla JavaScript providing the complete interaction suite from `dijon-neighborhoods`:

1. **Dual Drag-and-Drop + Tap-to-Place**:
   - **HTML5 Drag & Drop**: Dragging a chip over its corresponding definition card highlights it; dropping matches it.
   - **Tap/Click-to-Place**: Clicking a word chip selects it (`.is-selected`), then clicking the matching card places it. Essential for mobile and tablet touch devices.
   - **Feedback**: Shake animation (`.shake-error`) on mismatched drops; success animation and color shift on correct match.
2. **Definition Card Interaction**:
   - Matched cards reveal the word and allow clicking to toggle the example quote (`.is-collapsed`).
   - Word bank chip dims/hides when placed.
3. **State Persistence (`localStorage`)**:
   - Use a unique storage key scoped to the site (e.g. `${slug}_progress`).
   - Automatically save matches per section.
   - Restore matches and score on page load.
4. **Reset Functionality**:
   - **Section Reset**: Button in each panel header resetting only that section's cards and word bank.
   - **Global Reset**: Top nav button opening the confirmation modal to clear all progress.
5. **Back to Top**:
   - Floating circular button appearing on scroll past 400px.

---

## 7. Execution & Output Delivery

1. Write the complete, standalone file to:
   `c:\edward\projects\apps\langlearn\dev\info-sites\<slug>\index.html`
2. **No Browser or Testing Required**: The agent does NOT need to check the document in the browser, launch any browser subagents, or test it in any way. Simply create the file, write it, and state that it is finished.
3. Provide a concise summary to the user with a direct clickable file link:
   `[index.html](file:///c:/edward/projects/apps/langlearn/dev/info-sites/<slug>/index.html)`
