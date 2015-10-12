#!/usr/bin/env bash
nvm install 4.1.1
git clone https://github.com/kenjindomini/pancake_project.git ~/pancake_project
cd ~/pancake_project
npm install
npm run build-dev
npm run start