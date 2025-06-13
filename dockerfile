# Utiliser une image de base officielle Node.js
FROM node:20.17.0

# Installer Chrome et les dépendances nécessaires
# RUN apt-get update && apt-get install -y \
#     wget \
#     gnupg \
#     && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
#     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' \
#     && apt-get update && apt-get install -y \
#     google-chrome-stable \
#     --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/*

# Définir les variables d'environnement pour Chrome
# ENV CHROME_BIN=/usr/bin/google-chrome
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /usr/src/app

# Copie uniquement le backend
COPY backend/ ./backend
COPY commons/ ./commons

# aller dans le dossier backend
WORKDIR /usr/src/app/backend

RUN npm install
RUN npm install -g ts-node
RUN npm install -g nodemon
RUN npm install -g typescript

# aller dans le dossier commons
WORKDIR /usr/src/app/commons
RUN npm install

WORKDIR /usr/src/app