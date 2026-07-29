# mini apps

If you are asked to make a "miniapp", see /output/miniapps/agents.md"

# general

- if you don't have to, don't run a "npm run build"
- make all UX interaction with APIs optimistic, i.e. show an immediate, positive response, changing the data on the frontend, and only reverting it if there is an error or exception from the server
- any buttons that perform highly destructive actions, should be shown as dark red links, they should be hard to see and click, and they should always ask for confirmation before executing the action 
- in edit/add forms, make ENTER mean SAVE

# language colors reference

Here are the colors defined for the languages:
- French (`fr`): `#333388` (dark blue)
- Spanish (`es`): `#be185d` (magenta / pink-red)
- Italian (`it`): `#194d19` (dark green / forest green)
- Dutch (`nl`): `#d97706` (mustard-orange)
- Polish (`pl`): `#b8b8b8` (light grey)
- German (`de`): `#7e4402` (brown)
- Russian (`ru`): `#3f3f46` (dark grey)
- Icelandic (`is`): `#06b6d4` (cyan / light blue)
- Danish (`da`): `#7e22ce` (purple)
- Greek (`el`): `#ea580c` (orange-red)

In general, don't use colors if they are not language related, e.g. don't make links blue, but rather white so that any color indicates a language.

# forms

- use optimitic updates for all API calls. e.g. add the new item to the list immediately
- if something fails, revert the change
- when clicking a button, disable it and show a loading spinner or something similar to indicate that the action is being processed. change it back when the API call returns