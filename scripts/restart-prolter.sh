# /opt/Prolter/scripts/restart-prolter.sh
#!/bin/bash
set -e
echo "Stopping Prolter..."
sudo systemctl stop prolter
echo "Waiting 2s..."
sleep 2
echo "Starting Prolter..."
sudo systemctl start prolter
