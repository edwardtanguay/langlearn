# Design Spec: Flashcard Back Edit Form Professionalization

Date: 2026-07-19
Status: Proposed

## Objective
Professionalize and clean up the visual design and UX of the edit form displayed on the back of the flashcard within the `FlashcardBack.vue` component.

## Key Changes

### 1. Structure & Layout
* **Vertical Centering:** Center the entire form vertically inside the card container.
* **No Labels:** Remove the explicit text labels (`Front`, `Back`, `Pronunc.`, `Hook`).
* **Full-Width Inputs:** All input elements will expand to 100% width, utilizing clear placeholders for identification.
* **Swapped Actions:** Swap the positions of the primary buttons:
  * **Cancel:** Left button.
  * **Save:** Right button.

### 2. Multi-Line Auto-Growing Inputs
* **Inputs affected:** `Front` and `Back`.
* **Element:** Replaced `<input>` with `<textarea>`.
* **Auto-Grow Behavior:** Bind a native `@input` handler or a simple watcher to recalculate the heights of the textareas on content change dynamically so they start at 1 row high and grow seamlessly without causing vertical layout breaks.
* **Keyboard Shortcuts:**
  * **ENTER:** Saves the form by emitting the `save-edit` event.
  * **SHIFT + ENTER:** Inserts a newline character within the textarea field.

### 3. Aesthetics & Styling
* **White/Gray Palette:** Replace all `indigo` color variables (e.g., `text-indigo-300`, `bg-indigo-850/60`, `border-indigo-600/50`, `focus:ring-indigo-400`, `bg-indigo-500`) with white and gray variants.
* **Styling Tokens:**
  * Inputs background: `bg-white/5` (semi-transparent gray/white).
  * Inputs border: `border-white/10`.
  * Inputs focus: `focus:border-white/30 focus:ring-white/30`.
  * Input text: `text-white` with placeholder text in `placeholder-white/30`.
  * **Cancel Button:** Subtle gray background (`bg-white/5 hover:bg-white/10`), text `text-white/70`.
  * **Save Button:** Solid white/gray background (`bg-white hover:bg-white/90`), text `text-black` (or dark gray).
