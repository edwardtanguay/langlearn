# LangLearn

This site enables me to achieve my goal of becoming B1+ fluent in 10 languages.

The tech stack is: Nuxt 4, TypeScript, Prisma, Turso and Kinde.

## Setup at Hetzner

`etc/nginx/conf.d/langlearn.tanguay.eu.conf`
```
server {
    server_name langlearn.tanguay.eu;
    location / {
        proxy_pass http://127.0.0.1:3149;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port 443;

        # Add these lines to handle large Kinde OAuth cookies:
        proxy_buffer_size          128k;
        proxy_buffers              4 256k;
        proxy_busy_buffers_size    256k;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/langlearn.tanguay.eu/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/langlearn.tanguay.eu/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
server {
    if ($host = langlearn.tanguay.eu) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name langlearn.tanguay.eu;
    return 404; # managed by Certbot
}
```

`.env`
```
NODE_ENV=development
DATABASE_URL="libsql://langlearn-...REPLACE""
DATABASE_AUTH_TOKEN="eyJhb...REPLACE"

# Kinde Auth Configuration
NUXT_KINDE_AUTH_DOMAIN="https://tanguayeu.kinde.com"
NUXT_KINDE_CLIENT_ID="1e60...REPLACE"
NUXT_KINDE_CLIENT_SECRET="C2cj...REPLACE"
NUXT_KINDE_LOGOUT_REDIRECT_URL="https://langlearn.tanguay.eu"
NUXT_KINDE_PASSWORD="a_random_32_ch...REPLACE"

NUXT_KINDE_SITE_URL="https://langlearn.tanguay.eu"
NUXT_KINDE_POST_LOGOUT_REDIRECT_URL="https://langlearn.tanguay.eu"
NUXT_KINDE_POST_LOGIN_REDIRECT_URL="https://langlearn.tanguay.eu"
NUXT_KINDE_REDIRECT_URL="https://langlearn.tanguay.eu/api/callback"

NUXT_SITE_URL="https://langlearn.tanguay.eu"

# Set to true to bypass authentication check for local dev
NUXT_PUBLIC_BYPASS_AUTH=false
```

## Mobile testing

- browser at 378 x 915

## Publish a new version at Hetzner

- merge version into main
    - in version branch
    - `git switch main`
    - `git merge <version-v000> --squash`
        - rename e.g. "Version 0.5.0: Grouped Flashcard Testing"
- ssh into Hetzner machine
	- C:\edward\projects\ssharea
	- open hyper
	- ./het.sh
	- (password in Hetzner-debian-001)
- update site
	- cd projects/langlearn
	- git pull
		- (if in editor, CTRL-x)
	- nvm install 22
	- npm i
	- NODE_OPTIONS="--max-old-space-size=4096" npm run build
	- pm2 restart langlearn
		- (or try: `npm2 start ecosystem.config.cjs`)
