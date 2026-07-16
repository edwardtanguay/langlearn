# RULES

- this directoy "miniapps" contains one directory per app
- each app is self-contained
- when an agent makes an app, it creates a directory with the name of the app (e.g. "french-verbs") inside that a self-contained "index.html" file with css and javascript all in one files (so that there is no need for cache busting)
- inside each app directory, if there are images, they go in "/images", any other media files (audio, video) go in "/media"
- when you create a mini app, also add a link to it in the "/miniapps/index.html" file
- in every app that you create, also create a link back to /miniapps/index.html
- don't include anything technical in these apps such as "Raw Reference File Contents", these apps are for the end user, not the developer
- for apps that test the user on grammar and spelling, always override what is in the data files with standard rules of the language, for instance, the data file might suggest that the imparfait of prendre is "prendrais" but only use the irregular and correct form "prenais"
- when you make an app, particularly in dark mode, make sure that it does not "blink" when it loads
- make all apps have a .5s fade on entry, so they hide any flicker