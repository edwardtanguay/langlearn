# Create local MVP app for importing and testing flashcards

## Overview

This will eventually be a much more extensive website. For this task, I want to be able to use it locally (via localhost, but logged in as Google User (edwardtanguay@gmail.com), copy a csv file from Google Translate into the import directory (e.g. import\googtran-test.csv), type "npm run pd" (for parse-data), then go to the page "Flashcards", see the "front" of the flashcard, be tested on the "back", and be able to rank the card, delete, edit, park (don't test anymore but keep for searching). 

For now just make the Flashcard page, but have a search which can be used at any time to search flashcards, which searched all of them except deleted flashcards.

If a flashcard is marked "learned" then it is not tested anymore, but appears in search.

The tags appears on the cards, and all tags at top of the Flashcard page, if you click, you see all flashcards for that tag group.

This should work mainly for mobile, but will also work on desktop. Make sure it is responsive. 

## Database
- tables
	- flashcards
		- id
		- ownerId
		- front
		- back
	- userFlashcardActivity
		- id
		- userId
		- flashcardId
		- whenActedUpon
		- actionTaken: IMPORTED, TESTED, EDITED, DELETED, PARKED
		- actionDetails
	- user
		- id
		- firstName
		- lastName
		- email
		- minutesToTestAgain
	- userFlashcard
		- id
		- status: LEARNED, LEARNING, PARKED, DELETED
		- rank (decimal from 0.0 to 5.0)
		- mnemonic
	- flashcardTags
		- id
		- flashcardId
		- tagId
	- tags
		- id
		- abbreviation ("best","fix"
		- description