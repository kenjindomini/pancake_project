#!/usr/bin/env bash
git clone https://github.com/kenjindomini/pancake_project.git ~/pancake_project
cd ~/pancake_project
echo "Running npm install"
npm install
echo "Running npm run build-dev"
npm run build-dev