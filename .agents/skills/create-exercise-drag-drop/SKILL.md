---
name: create-exercise-drag-drop
description: Create a standalone language learning exercise web page under dev/info-sites/ featuring default dark mode styling, direct text drag-and-drop vocabulary matching (no input box dropzones), toggleable answer example quotes (open/close), CEFR-graded reading texts with maximum mobile width (no panel-in-a-panel), and discussion prompts modeled after dijon-neighborhoods. Uses a /grill-me interview to align on content and design before generation. Use when the user runs /create-exercise-drag-drop or asks to create a drag-and-drop vocabulary exercise site.
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
4. **Visual & Color Theme**: Propose topic-harmonized accent palette colors (e.g., amber, indigo, teal, violet, or emerald). **Always use a dark mode style by default** unless the developer explicitly specifies a light theme or another style.
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
3. **5 Definition Cards (Direct Drop Target — NO Input Boxes & Toggleable Answer Details)**:
   - Concise, learner-friendly definition in the target language.
   - Contextual quote / example sentence demonstrating the word in use.
   - Matching target word (hidden until matched, then displayed inline before the definition).
   - **No separate drop box / input slot**: The entire definition card / definition text acts as the drop target itself (modeled strictly after `dev/info-sites/dijon-neighborhoods/index.html`).
   - **Toggleable Open/Closed**: Once answered/matched, clicking/tapping the card toggles the example sentence block open and closed (`.is-collapsed`), allowing the user to expand or collapse the answer details at will.
4. **Reading Passage (Texte de Lecture)**:
   - Standard length of **~300 words** (typically 2 to 4 well-written paragraphs) at the specified CEFR level unless the user specifies otherwise.
   - Natural inclusion of all 5 vocabulary words from the section.
   - Each vocabulary occurrence wrapped in `<span class="vocab-word" tabindex="0" data-tooltip="...">` showing the definition on hover/focus.
5. **Discussion Question (Question de Discussion)**:
   - An open-ended, engaging question prompting personal reflection or classroom debate based on the reading passage.

---

## 5. UI Design & Styling Specifications

Follow the clean, modern editorial design system from `dijon-neighborhoods`, adapted with **dark mode by default**:

- **Single Self-Contained File**: Everything (`<!DOCTYPE html>`, `<style>`, HTML, `<script>`) contained inside `index.html`. No external CSS/JS dependencies or image requirements.
- **Default Dark Mode Style (unless developer specifies otherwise)**:
  - Use rich, modern dark mode design tokens:
    - `--bg-body: #070b14;` (or `#0b0f19`, deep dark background)
    - `--bg-surface: #0f172a;` (secondary dark surface for panels)
    - `--bg-card: #141f36;` (or `#1e293b`, elevated card surface)
    - `--bg-card-hover: #1a2948;`
    - `--border-subtle: #1e293b;`
    - `--border-strong: #334155;`
    - `--text-main: #f8fafc;`
    - `--text-muted: #94a3b8;`
    - `--text-subtle: #64748b;`
    - Topic-harmonized accent palette (e.g., `--accent-color: #6366f1;`, soft tints `rgba(99, 102, 241, 0.15)`, borders `rgba(99, 102, 241, 0.4)`).
    - Status colors: `--success-green: #10b981;` (`rgba(16, 185, 129, 0.16)` soft bg), `--error-red: #ef4444;`.
  - Dark-tinted glassmorphism for sticky nav and modal backdrops (`background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(10px);`).
- **Toggleable Matched Card Styling**:
  - Matched cards indicate interactivity via pointer cursor:
    ```css
    .def-card.is-matched,
    .def-card.is-matched.is-collapsed {
      cursor: pointer;
    }
    .def-card.is-matched:not(.is-collapsed) .def-example {
      display: block;
      animation: fadeInExample 0.3s ease-out forwards;
    }
    .def-card.is-matched.is-collapsed .def-example {
      display: none;
    }
    ```
- **Typography & Layout**:
  - System font stack (`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`).
  - Max container width ~860px to 900px, responsive padding.
- **Mobile View: Maximum Width & No "Panel in a Panel"**:
  - **Critical Mobile Rule**: Ensure reading texts and definition texts have **maximum width** on mobile screens. Never nest text inside a panel within another panel with multiple layers of padding and borders.
  - On mobile (`@media (max-width: 640px)`):
    - Flatten nested reading wrappers:
      ```css
      .reading-box .reading-body {
        background: transparent;
        border: none;
        padding: 0.15rem 0.15rem;
        box-shadow: none;
      }
      ```
    - Keep outer card padding tight (e.g. `padding: 1.25rem 0.85rem;`) so reading text and definition cards span the maximum screen width.
    - Align reading paragraphs to the left (`text-align: left;`) on mobile instead of justified to avoid awkward gaps.
- **Header & Navigation**:
  - Sticky top navbar with blur backdrop.
  - Brand pill badge (e.g., `TOPIC • Level`).
  - Dropdown menu (Nuxt UI style) to jump smoothly to any section.
  - Global score pill displaying current progress (e.g., `X / Total words`).
  - "Reset all" button triggering a confirmation modal.
- **Modal Confirmation Dialog**:
  - Centered overlay modal with backdrop blur for confirming full progress reset.

---

## 6. Interactive Mechanics Specifications

Implement vanilla JavaScript providing the complete interaction suite from `dijon-neighborhoods`:

1. **NO Separate Input Box / Drop Area (Direct Text Drop)**:
   - **Crucial Layout Rule**: The drag/drop interface must have **NO INPUT BOX area to drop** (no `.card-dropzone`, no empty box slot, no placeholder text like "drop word here").
   - To save space—especially on mobile—the user drops the word chip **directly onto the definition text / card itself**, exactly as done in `dev/info-sites/dijon-neighborhoods/index.html`.
   - **HTML Card Structure**:
     ```html
     <div class="def-card" data-target="<word>" tabindex="0" title="Cliquer pour afficher ou masquer l'exemple">
       <div class="def-main-line">
         <strong class="matched-word"><word></strong>
         <span class="def-text"><definition></span>
       </div>
       <div class="def-example">
         <blockquote class="example-quote">« ... <strong><word></strong> ... »</blockquote>
       </div>
     </div>
     ```
   - Before matching:
     - `.matched-word` is hidden (`display: none;`). The learner sees only the definition.
     - When a word is being dragged or selected, eligible cards receive `.eligible-drop` (`border: 1.5px dashed ...;`).
     - Hovering over a card sets `.drag-hover`.
   - Upon matching:
     - The card receives `.is-matched` and removes `.is-collapsed`.
     - Displays `<strong class="matched-word">` inline before the definition and uncollapses the contextual example quote (`.def-example`).
2. **Dual Drag-and-Drop + Tap-to-Place**:
   - **HTML5 Drag & Drop**: Dragging a chip directly over its matching definition card highlights it; dropping onto the card matches it.
   - **Tap/Click-to-Place**: Clicking a word chip selects it (`.is-selected`), then clicking the target definition card matches it. Essential for mobile and tablet touch devices.
   - **Feedback**: Shake animation (`.shake-error`) on mismatched drops/clicks; success animation and color shift on correct match.
3. **Toggle Answer Details Open/Closed on Matched Cards (`.is-collapsed`)**:
   - Once a card has been answered/matched (`.is-matched`), clicking or tapping anywhere on that card toggles `.is-collapsed` on the card to open or close the contextual example quote block (`.def-example`).
   - Modeled exactly as in `dijon-neighborhoods`:
     ```javascript
     function handleCardClick(e) {
       if (this.classList.contains('is-matched')) {
         // Do not toggle if user was selecting/copying text with cursor
         const selection = window.getSelection();
         const hasSelection = selection && selection.toString().trim().length > 0;
         if (hasSelection || isSelectingCardText) {
           isSelectingCardText = false;
           return;
         }
         // Clean click: toggle open/closed state
         this.classList.toggle('is-collapsed');
         return;
       }
       // ... handle tap-to-place placement when unmatched ...
     }
     ```
   - Card displays an accessible tooltip `title="Cliquer pour afficher ou masquer l'exemple"` (in target language).
   - Word bank chip dims/hides (`.is-placed { display: none; }`) when placed.
   - When all 5 words in a section are placed, the word bank container collapses smoothly (`.is-hidden`).
4. **State Persistence (`localStorage`)**:
   - Use a unique storage key scoped to the site (e.g. `${slug}_progress`).
   - Automatically save matches per section.
   - Restore matches and score on page load (restoring `.is-matched` and removing `.is-collapsed`).
5. **Reset Functionality**:
   - **Section Reset**: Button in each panel header resetting only that section's cards (removing `.is-matched`, `.is-collapsed`) and word bank.
   - **Global Reset**: Top nav button opening the confirmation modal to clear all progress.
6. **Back to Top**:
   - Floating circular button appearing on scroll past 400px.

---

## 7. Execution & Output Delivery

1. Write the complete, standalone file to:
   `c:\edward\projects\apps\langlearn\dev\info-sites\<slug>\index.html`
2. **No Browser or Testing Required**: The agent does NOT need to check the document in the browser, launch any browser subagents, or test it in any way. Simply create the file, write it, and state that it is finished.
3. Provide a concise summary to the user with a direct clickable file link:
   `[index.html](file:///c:/edward/projects/apps/langlearn/dev/info-sites/<slug>/index.html)`
