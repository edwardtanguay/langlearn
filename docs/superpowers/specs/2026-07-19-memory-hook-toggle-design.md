# Memory Hook Toggle Design

## Goal
Improve the "Memory hook" display on the front of the flashcard by hiding the mnemonic text behind a toggleable button to prevent spoilers, using an intuitive lightbulb icon.

## Architecture & Components
- **Component**: `app/components/FlashcardFront.vue`
- **State**: Add a local ref (e.g., `showMnemonic = ref(false)`) to manage the toggle state of the mnemonic text.
- **UI Elements**:
  - A bottom-centered button containing a Lightbulb icon (using an SVG or an existing icon system like Heroicons if available) and the text "Memory hook".
  - The mnemonic text itself, which is conditionally rendered (`v-if="showMnemonic"`) or toggled via CSS directly beneath the button.

## Data Flow
- The `currentCard.mnemonic` prop passed to `FlashcardFront.vue` is read. 
- If a mnemonic exists, the toggle button is rendered.
- When clicked, `showMnemonic` is toggled.

## Edge Cases
- **Flipping the Card**: If the user flips the card or moves to the next card, the `showMnemonic` state might persist if the component isn't re-mounted. To prevent leaking the hint for the next card, we should use a watcher on `currentCard.flashcard.id` to reset `showMnemonic` back to `false` whenever the card changes.

## Constraints & Trade-offs
- Adding local state to `FlashcardFront.vue` means it's no longer purely presentational based strictly on props, but since the state is purely for UI reveal, it's appropriate.
