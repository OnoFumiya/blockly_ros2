#!/bin/bash
echo "╔══╣ Setup: Blockly ROS2 (STARTING) ╠══╗"

sudo apt update
sudo apt install -y \
    xdg-utils

pip3 install qrcode[pil] --break-system-packages
python3 -m pip install --break-system-packages \
    flask \
    flask_cors \
    qrcode[pil]

echo "╚══╣ Setup: Blockly ROS2 (FINISHED) ╠══╝"