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
      <li><a href="#how-to-setup">How To Setup</a></li>
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
| Ubuntu | 26.04 (Resolute Raccoon) |
| ROS    | Lyrical Luth |
| Python | 3.14 |
| Google Blockly | 10.4.3 |

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Installation
1. First, navigate to the `src` folder of your ROS 2 workspace.
    ```sh
    $ cd ~/colcon_ws/src
    ```
2. Clone the ROS package `blockly_ros2` into the `src` folder.
    ```sh
    $ git clone -b jazzy-devel https://github.com/OnoFumiya/blockly_ros2.git
    ```
3. Navigate into the cloned repository folder.
    ```sh
    $ cd blockly_ros2
    ```
4. Install the required dependencies.
    ```sh
    $ bash install.sh
    ```
5. Build the package.
    ```sh
    $ cd ~/colcon_ws/
    $ colcon build --symlink-install
    $ source ~/colcon_ws/install/setup.sh
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Launch and Usage -->
## Launch and Usage
Once the package has been successfully built, you can verify its operation using the following steps:

1. In [block_structure.yaml](config/block_structure.yaml), update each Block config. \
    Here, we will proceed using the current default settings. \
    In addition, there are several parameters that can be set for [server_bringup.launch.py](launch/server_bringup.launch.py). \
    For detailed setup instructions, please refer to [this guide](#howtosetup).

2. Starting the required server \
    Of the blocks defined in [1.], the “Service” and “Action” blocks will not start if the corresponding servers do not exist. \
    ※This is because the system first checks whether the servers exist. 
    Therefore, you must start the necessary nodes.

    When using the default blocks, the “turtlesim” and “fibonacci” servers must be running.
    The commands you'll need this time are as follows:
    ```sh
    $ ros2 run turtlesim turtlesim_node
    ```
    ```sh
    $ ros2 run action_tutorials_cpp fibonacci_action_server
    ```

3. Once all the necessary changes are complete, you can launch [server_bringup.launch.py](launch/server_bringup.launch.py) to verify that it is working:
    ```sh
    $ ros2 launch blockly_ros2 server_bringup.launch.py
    ```

    You can control the blocks in the browser that opens. When you press the “Send” button, the blocks will execute in order, starting with the “main” block.

    You can also control the blocks by accessing the website linked to the displayed QR code using a device connected to the same Wi-Fi network.
> [!NOTE]
> The QR code image and its URL are each published to the topic once as “Transient Local” (QoS) to “/blockly_url_qrcode” (sensor_msgs/Image) and "/blockly_url_link" (std_msgs/String), respectively.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


# How To Setup

This package allows you to **Publish Topics**, **Call Services**, and **Send Action Goals** using visual blocks in Blockly.
These operations correspond to the terminal commands `ros2 topic pub`, `ros2 service call`, and `ros2 action send_goal`.
As a basic rule, one ROS message corresponds to one block.

The following section explains how to configure parameters using [`config/block_structure.yaml`](config/block_structure.yaml) as an example, which contains five ROS message configuration examples.

---

### 1. Topic Communication Example 1

```yaml
text:
    msg_type: "std_msgs/String"
    mode: "topic"
    value_rules:
        data: {type: "string", name: "MESSAGE: "}

```

* **Mode (`mode`):** Set to `"topic"` for Topic communication.
* **Topic Name:** `text`. If a namespace is specified when launching the node, it becomes `/{namespace}/text`. If you want to bypass the namespace, explicitly define it as `/text`.
* **Interface (Message Type):** `std_msgs/String`.
* **`value_rules`:** Defines how the message structure is mapped into a block.

To publish this block equivalent from the terminal, run:

```sh
$ ros2 topic pub /text std_msgs/msg/String 'data: "Hello World"' --once

```

The `data: "Hello World"` field becomes the input field on Blockly, referencing the YAML snippet below:

```yaml
data: {type: "string", name: "MESSAGE: "}

```

* `type: "string"`: Indicates a string input type.
* `name: "MESSAGE: "`: Displays `MESSAGE: ` as the label for this input field on the block.

---

### 2. Topic Communication Example 2

```yaml
number:
    msg_type: "std_msgs/msg/Float64"
    mode: "topic"
    value_rules:
        data: {type: "float", name: "No. "}

```

* **Mode (`mode`):** `"topic"`
* **Topic Name:** `number`
* **Interface (Message Type):** `std_msgs/msg/Float64` (the `msg/` prefix can be omitted)

Terminal execution example:

```sh
$ ros2 topic pub /number std_msgs/msg/Float64 'data: 1.57' --once

```

Block input field mapping:

```yaml
data: {type: "float", name: "No. "}

```

* `type: "float"`: Accepts floating-point values.
* `name: "No. "`: Displays `No. ` as the label on the block.

---

### 3. Service Communication Example

```yaml
spawn: 
    msg_type: "turtlesim_msgs.Spawn"
    mode: "service"
    value_rules: 
        name: {"type": "string", "name": "Name: "}
        x: {"type": "float", "name": "X: "}
        y: {"type": "float", "name": "Y: "}

```

* **Mode (`mode`):** `"service"`
* **Service Name:** `spawn`
* **Interface (Message Type):** `turtlesim_msgs.Spawn` (you can use `.` or `/` as a delimiter)

Terminal execution example:

```sh
$ ros2 service call /spawn turtlesim_msgs/srv/Spawn '{x: 5.2, y: 5.8, theta: 0.0, name: "ROBOT1"}'

```

`value_rules` defines three input fields: `name`, `x`, and `y`.

* `name`: String type (Label: `Name: `)
* `x`: Float type (Label: `X: `)
* `y`: Float type (Label: `Y: `)

> [!NOTE]
> **Handling Unconfigured Fields**
> The `turtlesim_msgs/srv/Spawn` interface includes a `theta` field, but it is omitted in the YAML above. Unconfigured fields will not appear on the block and will be sent using their **default values** (`0.0` for float types).
> Currently, setting a custom fixed value without displaying it on Blockly is not supported. If you wish to send a non-default value, you must define it in `value_rules` and enter it from the block.

---

### 4. Action Communication Example

```yaml
"/fibonacci":
    msg_type: "example_interfaces/Fibonacci"
    mode: "action"
    value_rules:
        order: {"type": "int", "name": "Number of calculations >> "}

```

* **Mode (`mode`):** `"action"`
* **Action Name:** `/fibonacci`
Since it starts with `/`, it will always be resolved as an absolute path (`/fibonacci`), ignoring any node namespace. If you want it to reflect the node's namespace, omit the leading slash and use `fibonacci`.
* **Interface (Message Type):** `example_interfaces/Fibonacci`

Terminal execution example:

```sh
$ ros2 action send_goal /fibonacci example_interfaces/action/Fibonacci "order: 1"

```

* `order`: Accepts an integer (`type: "int"`). The label `Number of calculations >> ` will be shown on the block.

---

### 5. Topic Communication Example 3 (Arrays, Nesting & Special Types)

This example demonstrates advanced configurations including arrays and special types.

```yaml
"joint_controller/joint_trajectory":
    msg_type: "trajectory_msgs/msg/JointTrajectory"
    mode: "topic"
    value_rules:
        joint_names[3]: {"type": "string", "name": "Joint Name"}
        points[1]:
            positions[3]: {"type": "deg", "name": "Angle"}
            time_from_start: {"type": "time", "name": "Movement Time"}

```

* **Mode (`mode`):** `"topic"`
* **Topic Name:** `joint_controller/joint_trajectory`
* **Interface (Message Type):** `trajectory_msgs/msg/JointTrajectory`

Terminal execution example:

```sh
$ ros2 topic pub /joint_controller/joint_trajectory trajectory_msgs/msg/JointTrajectory "{joint_names: [joint1, joint2, joint3], points: [{positions: [1.57, 0.78, -0.78], time_from_start: {sec: 1, nanosec: 0}}]}" --once

```

#### Configuration Breakdown

1. **Array Definition (`joint_names[3]`):**
* Specify array length in brackets (e.g., `[3]` for 3 elements).
* Setting `{"type": "string", "name": "Joint Name"}` creates 3 string input fields labeled "Joint Name" on the block.


2. **Degrees Conversion (`type: "deg"`):**
* Standard ROS angles use radians (rad). Using `type: "deg"` allows users to enter values in degrees on the GUI.
* Input values are automatically converted internally using `× π / 180` before being published as radians.
* Example: Entering `90`, `45`, `-45` in the GUI sends approximately `1.57`, `0.78`, `-0.78` [rad]. (Use `type: "float"` if you prefer direct radian input).


3. **Time Helper (`type: "time"`):**
* For `builtin_interfaces/Duration` fields, `type: "time"` allows entering float values representing seconds, automatically converting them into `sec` and `nanosec`.
* Alternatively, you can explicitly configure `sec` and `nanosec` separately as shown below:



```yaml
points[1]:
    time_from_start:
        sec: {"type": "int", "name": "Movement Time [s]: "}
        nanosec: {"type": "int", "name": "Movement Time [ns]: "}

```

---

### Supported `type` List

Below is the list of supported `type` options for block input fields. Generally, these map to leaf fields of ROS 2 interfaces, except for `time`, which maps to `builtin_interfaces/Duration`.

| ROS 2 Interface Type | Supported `type` | Description |
| --- | --- | --- |
| `int8`, `int16`, `int32`, `int64` | `int`, `integer` | Integer types |
| `float32`, `float64` | `float`, `double`, `deg` | `deg` multiplies the input by `× π / 180` to convert degrees to radians. |
| `string` | `string`, `str`, `char` | String types |
| `bool` | `bool`, `boolean` | Boolean types |
| `builtin_interfaces/Duration` | `time` | Automatically converts decimal seconds into Duration (`sec`, `nanosec`). |


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Milestones

- [ ] Support handling Service Responses as well as Action Feedback / Results within blocks.
- [ ] Implement saving and loading block workspaces to allow users to resume their work.
- [ ] Enhance variable management in Blockly to improve the usability of loop iterations and conditional (IF) blocks.
- [ ] Proposal and Implementation of a Method for Defining Dynamic Arrays.

Please check the [Issue page][issues-url] for current bugs and feature requests.


## Acknowledgments
* [ROS2 Lyrical](http://wiki.ros.org/lyrical)
* [Google Blockly](https://blockly.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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
