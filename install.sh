#!/bin/bash
echo "╔══╣ Setup: Blockly ROS2 (STARTING) ╠══╗"

sudo apt update
sudo apt install -y \
    xdg-utils

# install for 
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb
sudo rm google-chrome-stable_current_amd64.deb

pip3 install qrcode[pil] --break-system-packages
python3 -m pip install --break-system-packages \
    flask \
    flask_cors \
    qrcode[pil]

echo "╚══╣ Setup: Blockly ROS2 (FINISHED) ╠══╝"