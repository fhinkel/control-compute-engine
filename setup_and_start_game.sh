#!/bin/bash

touch hello.js

# Get gameserver source code
# gsutil -m cp {{ coud_storage }}/gameserver.tar.gz
gsutil -m cp gs://battleship/gameserver.tar.gz .

# Unpack gameserver
tar zxf gameserver.tar.gz

# Get Node version manager and install Node
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.9/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


nvm install 8

# Start Battleship-JavaScript
cd Battleship-JavaScript
npm install
npm start 
