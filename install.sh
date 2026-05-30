#!/bin/bash
echo "╔══╣ Setup: Blockly ROS2 (STARTING) ╠══╗"

sudo apt update
sudo apt install -y \
    xdg-utils

# System Environment
ENV="$(uname -m)"

# Install for Each Environment
if [[ ${ENV} == *"x86_64"* ]]; then
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    sudo apt install ./google-chrome-stable_current_amd64.deb
    sudo rm google-chrome-stable_current_amd64.deb
else
    sudo rm -f /etc/apt/preferences.d/chromium-deb
    sudo tee /etc/apt/preferences.d/chromium-deb > /dev/null \<\<\- 'EOF'
        Package: chromium*
        Pin: release o=LP-PPA-xtradeb-apps
        Pin-Priority: 500

        Package: chromium*
        Pin: release o=Ubuntu*
        Pin-Priority: -1
        EOF
    sudo add-apt-repository -y ppa:xtradeb/apps
    sudo apt update
    sudo apt install -y chromium
fi

pip3 install qrcode[pil] --break-system-packages
python3 -m pip install --break-system-packages \
    flask \
    flask_cors \
    qrcode[pil]

echo "╚══╣ Setup: Blockly ROS2 (FINISHED) ╠══╝"