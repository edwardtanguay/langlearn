# LangLearn

This site enables me to achieve my goal of becoming B1+ fluent in 10 languages.

The tech stack is: Nuxt 4, TypeScript, Prisma, Turso and Kinde.

## Publish at Hetzner

- push main to GitHub
- ssh into Hetzner machine
	- C:\edward\projects\ssharea
	- open hyper
	- ./het.sh
	- (password in Hetzner-debian-001)
- update site
	- cd projects/langlearn
	- git pull
		- (if in editor, CTRL-x)
	- nvm install 20
	- npm i
	- NODE_OPTIONS="--max-old-space-size=4096" npm run build
	- pm2 restart langlearn
