<a name="readme-top"></a>

[EN](README.md) | [JA](README_ja.md)

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

# Blockly ROS2

A ROS 2 package providing a visual programming interface powered by Google's Blockly.


<!-- Table of Contents -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#introduction">Introduction</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#launch-and-usage">Launch and Usage</a></li>
      <li><a href="#parameters">Parameters</a></li>
    <li><a href="#milestone">Milestone</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>




<!-- Repository overview -->
## Introduction

This repository provides a ROS 2 package that integrates with Google's Blockly, a widely recognized open-source library for building visual, block-based programming interfaces. By bridging Blockly's intuitive drag-and-drop environment with the powerful capabilities of ROS 2, this project allows users to develop, control, and orchestrate robotic behaviors without writing complex traditional code. It is ideal for educational purposes, rapid prototyping, and making robotics accessible to beginners.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- Getting Started -->
## Getting Started

This section describes how to set up this repository.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Prerequisites

First, prepare the following environment before proceeding to the installation steps.

| System  | Version |
| ------------- | ------------- |
| Ubuntu | 24.04 (Noble Numbat) |
| ROS | Jazzy Jalisco |
| Python | 3.12 |
| Google Blockly | 10.4.3 |

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Installation
1. First, navigate to the `src` folder of your ROS 2 workspace.
    ```sh
    cd ~/colcon_ws/src
    ```
2. Clone the ROS package `blockly_ros2` into the `src` folder.
    ```sh
    git clone -b jazzy-devel https://github.com/OnoFumiya/blockly_ros2.git
    ```
3. Navigate into the cloned repository folder.
    ```sh
    cd blockly_ros2
    ```
4. Install the required dependencies.
    ```sh
    bash install.sh
    ```
5. Build the package.
    ```sh
    cd ~/colcon_ws/
    ```
    ```sh
    colcon build --symlink-install
    ```    
    ```sh
    source ~/colcon_ws/install/setup.sh
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Launch and Usage -->
## Launch and Usage
Once the package has been successfully built, you can verify its operation using the following steps:

1. In [block_structure.yaml](config/block_structure.yaml), update each Block config. \
    Here, we will proceed using the current default settings. \
    In addition, there are several parameters that can be set for [server_bringup.launch.py](launch/server_bringup.launch.py).\     
    For detailed setup instructions, please refer to [this guide](#parameters).

2. Once all the necessary changes are complete, you can launch [server_bringup.launch.py](launch/server_bringup.launch.py) to verify that it is working:
    ```sh
    ros2 launch blockly_ros2 server_bringup.launch.py
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Parameters
<!-- The parameters that can be set in [block_structure.yaml](config/block_structure.yaml) are as follows: -->

> [!NOTE]
> This is a NOTE.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Milestones


Please check the [Issue page][issues-url] for current bugs and feature requests.



<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments
* [Google Blockly](https://blockly.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/OnoFumiya/blockly_ros2.svg?style=for-the-badge
[contributors-url]: https://github.com/OnoFumiya/blockly_ros2/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/OnoFumiya/blockly_ros2.svg?style=for-the-badge
[forks-url]: https://github.com/OnoFumiya/blockly_ros2/network/members
[stars-shield]: https://img.shields.io/github/stars/OnoFumiya/blockly_ros2.svg?style=for-the-badge
[stars-url]: https://github.com/OnoFumiya/blockly_ros2/stargazers
[issues-shield]: https://img.shields.io/github/issues/OnoFumiya/blockly_ros2.svg?style=for-the-badge
[issues-url]: https://github.com/OnoFumiya/blockly_ros2/issues
[license-shield]: https://img.shields.io/github/license/OnoFumiya/blockly_ros2.svg?style=for-the-badge
[license-url]: LICENSE
