#!/usr/bin/env bash
sudo add-apt-repository ppa:fkrull/deadsnakes
sudo apt-get update
sudo apt-get install -y build-essential libssl-dev git python2.7
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
echo "source /home/vagrant/.nvm/nvm.sh" >> /home/vagrant/.profile
source /home/vagrant/.profile
nvm install 4.1.1
nvm alias default 4.1.1