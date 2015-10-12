#!/usr/bin/env bash
sudo apt-get update
sudo apt-get install -y build-essential libssl-dev git
sudo wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | NVM_DIR=/usr/local/nvm bash