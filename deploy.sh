#!/bin/bash

# Arizona Project Deploy Script
SERVER="194.32.141.21"
USER="ubuntu"
PASS="0qyMw4XKWWX1S5WQzvsjgjI="
REMOTE_PATH="/var/www/arizona"

echo "Deploying to ku.arizona.cv..."

# Fix ownership for upload
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@$SERVER "sudo chown -R ubuntu:ubuntu $REMOTE_PATH"

# Upload files (excluding node_modules)
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'deploy.sh' --no-perms --no-owner --no-group \
  -e "sshpass -p '$PASS' ssh -o StrictHostKeyChecking=no" \
  . $USER@$SERVER:$REMOTE_PATH/

# Fix permissions and restart services
sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no $USER@$SERVER "
  sudo chmod -R 755 $REMOTE_PATH
  pm2 restart arizona-pdf
  sudo systemctl restart nginx
"

echo "Deploy complete! Site: https://ku.arizona.cv"
