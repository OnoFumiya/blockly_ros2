<a name="readme-top"></a>

[英語](README.md) | [日本語](README_ja.md)

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

# Blockly ROS2

GoogleのBlocklyを基盤としたビジュアルプログラミングインターフェースを提供するROS 2パッケージ。


<!-- Table of Contents -->
<details>
  <summary>目次</summary>
  <ol>
    <li>
      <a href="#概要">概要</a>
    </li>
    <li>
      <a href="#はじめに">はじめに</a>
      <ul>
        <li><a href="#前提条件">前提条件</a></li>
        <li><a href="#インストール">インストール</a></li>
      </ul>
    </li>
    <li><a href="#起動と使用方法">起動と使用方法</a></li>
      <li><a href="#設定方法">設定方法</a></li>
    <li><a href="#マイルストーン">マイルストーン</a></li>
    <li><a href="#参考文献">参考文献</a></li>
  </ol>
</details>




<!-- Repository overview -->
## 概要

このリポジトリは、視覚的でブロックベースのプログラミングインターフェースを構築するための広く認知されたオープンソースライブラリであるGoogleのBlocklyと統合されたROS 2パッケージを提供します。Blocklyの直感的なドラッグ＆ドロップ環境とROS 2の強力な機能を結びつけることで、このプロジェクトは、ユーザーが複雑な従来のコードを記述することなく、ロボットの動作を開発、制御、および調整することを可能にします。教育目的や迅速なプロトタイピング、そして初心者がロボティクスを手軽に始められるようにするのに最適です。


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- Getting Started -->
## はじめに

このリポジトリの設定方法について説明します。


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### 前提条件

まず、インストール手順に進む前に、以下の環境を整えておいてください。

| System  | Version |
| ------------- | ------------- |
| Ubuntu | 26.04 (Resolute Raccoon) |
| ROS    | Lyrical Luth |
| Python | 3.14 |
| Google Blockly | 10.4.3 |

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### インストール
1. `src`フォルダへ移動
    ```sh
    $ cd ~/colcon_ws/src
    ```
2. 本リポジトリを`src`直下にclone
    ```sh
    $ git clone -b lyrical-devel https://github.com/OnoFumiya/blockly_ros2.git
    ```
3. 本リポジトリへ移動
    ```sh
    $ cd blockly_ros2
    ```
4. 必要なライブラリをインストール
    ```sh
    $ bash install.sh
    ```
5. パッケージをビルド
    ```sh
    $ cd ~/colcon_ws/
    $ colcon build --symlink-install
    $ source ~/colcon_ws/install/setup.sh
    ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Launch and Usage -->
## 起動と使用方法
パッケージのビルドが正常に完了したら、以下の手順で動作を確認できます。

1. [block_structure.yaml](config/block_structure.yaml) で、各ブロックの設定を更新します。\
    ここでは、現在のデフォルト設定のまま進めます。\
    また、[server_bringup.launch.py](launch/server_bringup.launch.py) には、設定可能なパラメータがいくつかあります。\
    詳細なセットアップ手順については、[こちらのガイド](#設定方法)をご参照ください。

2. 必要なサーバーの起動 \
    [1.]で定義されたブロックのうち、ServiceブロックとActionブロックは、対応するサーバーが存在しない場合、起動しません。 \
    ※これは、システムがまずサーバーの存在を確認するためです。
    したがって、必要なノードを起動する必要があります。

    デフォルトのブロックを使用する場合、turtlesimおよびfibonacciサーバーが実行されている必要があります。

    今回必要なコマンドは以下の通りです：
    ```sh
    $ ros2 run turtlesim turtlesim_node
    ```
    ```sh
    $ ros2 run action_tutorials_cpp fibonacci_action_server
    ```

3. 必要な変更がすべて完了したら、[server_bringup.launch.py](launch/server_bringup.launch.py) を実行して、正常に動作するか確認できます：
    ```sh
    $ ros2 launch blockly_ros2 server_bringup.launch.py
    ```

    開いたブラウザ上でブロックを操作できます。「送信」ボタンを押すと、「main」ブロックから順にブロックが実行されます。

    また、同じWi-Fiネットワークに接続されたデバイスから、表示されているQRコードにリンクされたウェブサイトにアクセスして、ブロックを操作することもできます。

> [!NOTE]
> QRコードの画像とそのURLは、それぞれTransient Local(QoS)として、トピックに1回ずつ公開されます。
> 公開先は、それぞれ`/blockly_url_qrcode`(sensor_msgs/Image)および"/blockly_url_link"(std_msgs/String)です。

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# 設定方法

本パッケージでは、ROS 2における **Topic通信のPublish**、**Service通信のCall**、**Action通信のSend Goal** をブロック操作で行うことができます。
ターミナルコマンドでいう `ros2 topic pub`、`ros2 service call`、`ros2 action send_goal` に相当します。
基本構造として、1つのROSメッセージが1つのブロックに対応します。

以下では [`config/block_structure.yaml`](config/block_structure.yaml) を例に、パラメータの設定方法を説明します（5つのROSメッセージ設定例が含まれています）。

---

### 1. Topic通信の例1

```yaml
text:
    msg_type: "std_msgs/String"
    mode: "topic"
    value_rules:
        data: {type: "string", name: "MESSAGE: "}

```

* **通信モード (`mode`):** `"topic"` のため Topic通信となります。
* **トピック名:** `text` です。ノード起動時に namespace を指定した場合は `/{namespace}/text` となります。namespace を付与したくない場合は、明示的に `/text` と指定することも可能です。
* **Interface (メッセージ型):** `std_msgs/String` です。
* **`value_rules`:** メッセージ構造をどのようにブロック化するかを定義します。

このブロックと同等の処理をターミナルで実行する場合、以下のコマンドになります。

```sh
$ ros2 topic pub /text std_msgs/msg/String 'data: "Hello World"' --once

```

`data: "Hello World"` 部分が Block 上で入力する項目となり、YAML内の以下の設定が参照されます。

```yaml
data: {type: "string", name: "MESSAGE: "}

```

* `type: "string"`: 入力タイプが文字列型であることを示します。
* `name: "MESSAGE: "`: Block 上の入力フィールドのラベルとして `MESSAGE: ` と表示されます。

---

### 2. Topic通信の例2

```yaml
number:
    msg_type: "std_msgs/msg/Float64"
    mode: "topic"
    value_rules:
        data: {type: "float", name: "No. "}

```

* **通信モード (`mode`):** `"topic"`（Topic通信）
* **トピック名:** `number`
* **Interface (メッセージ型):** `std_msgs/msg/Float64`（`msg/` は省略可能です）

ターミナルでの実行例:

```sh
$ ros2 topic pub /number std_msgs/msg/Float64 'data: 1.57' --once

```

Block 上の入力項目の参照設定:

```yaml
data: {type: "float", name: "No. "}

```

* `type: "float"`: 浮動小数点数での入力を示します。
* `name: "No. "`: Block 上に `No. ` というラベルで表示されます。

---

### 3. Service通信の例

```yaml
spawn: 
    msg_type: "turtlesim_msgs.Spawn"
    mode: "service"
    value_rules: 
        name: {"type": "string", "name": "Name: "}
        x: {"type": "float", "name": "X: "}
        y: {"type": "float", "name": "Y: "}

```

* **通信モード (`mode`):** `"service"`（Service通信）
* **サービス名:** `spawn`
* **Interface (メッセージ型):** `turtlesim_msgs.Spawn`（パッケージ名と型名の区切りは `/` のほか `.` でも記述可能です）

ターミナルでの実行例:

```sh
$ ros2 service call /spawn turtlesim_msgs/srv/Spawn '{x: 5.2, y: 5.8, theta: 0.0, name: "ROBOT1"}'

```

`value_rules` では `name`, `x`, `y` の入力項目を定義しています。

* `name`: 文字列型（ラベル: `Name: `）
* `x`: 浮動小数点型（ラベル: `X: `）
* `y`: 浮動小数点型（ラベル: `Y: `）

> [!NOTE]
> **未設定フィールドの挙動について**
> `turtlesim_msgs/srv/Spawn` には `theta` フィールドが存在しますが、上記YAMLでは設定していません。このように設定を省略したフィールドは Block 上に表示されず、送信時には**デフォルト値**（float型の場合は `0.0`）が適用されます。
> 現在、Block 上に非表示にしたままデフォルト値**以外**の固定値を送信する機能には対応していません。デフォルト値以外を送信したい場合は、必ず `value_rules` に含めて Block 上から入力してください。

---

### 4. Action通信の例

```yaml
"/fibonacci":
    msg_type: "example_interfaces/Fibonacci"
    mode: "action"
    value_rules:
        order: {"type": "int", "name": "Number of calculations >> "}

```

* **通信モード (`mode`):** `"action"`（Action通信）
* **アクション名:** `/fibonacci`
先頭に `/` がついているため、ノードに namespace が設定されていても常に絶対パス `/fibonacci` となります。namespace を反映させたい場合は、`/` を外して `fibonacci` と記述します。
* **Interface (メッセージ型):** `example_interfaces/Fibonacci`

ターミナルでの実行例:

```sh
$ ros2 action send_goal /fibonacci example_interfaces/action/Fibonacci "order: 1"

```

* `order`: `type: "int"` のため整数型を受け取ります。Block 上では `Number of calculations >> ` と表示されます。

---

### 5. Topic通信の例3（配列・ネスト構造・特殊型）

これまでの設定を踏まえた、より複雑なメッセージ（配列や特殊型）の設定例です。

```yaml
"joint_controller/joint_trajectory":
    msg_type: "trajectory_msgs/msg/JointTrajectory"
    mode: "topic"
    value_rules:
        joint_names[3]: {"type": "string", "name": "ジョイント名"}
        points[1]:
            positions[3]: {"type": "deg", "name": "角度"}
            time_from_start: {"type": "time", "name": "移動時間"}

```

* **通信モード (`mode`):** `"topic"`（Topic通信）
* **トピック名:** `joint_controller/joint_trajectory`
* **Interface (メッセージ型):** `trajectory_msgs/msg/JointTrajectory`

ターミナルでの実行例:

```sh
$ ros2 topic pub /joint_controller/joint_trajectory trajectory_msgs/msg/JointTrajectory "{joint_names: [joint1, joint2, joint3], points: [{positions: [1.57, 0.78, -0.78], time_from_start: {sec: 1, nanosec: 0}}]}" --once

```

#### 設定解説

1. **配列の定義 (`joint_names[3]`):**
* リスト・配列型の場合は要素数を指定します（例: `[3]` で要素数3）。
* `{"type": "string", "name": "ジョイント名"}` と指定することで、Block 上に「ジョイント名」というラベルの付いた3つ分の文字列入力フィールドが生成されます。


2. **度数法への自動変換 (`type: "deg"`):**
* 通常、ROSの角度はラジアン（rad）で扱いますが、`type: "deg"` と指定すると GUI 上からは度（deg）で入力できます。
* 入力された値は内部で `× π / 180`（rad換算）されて送信されます。
* 例: GUI上で `90`, `45`, `-45` と入力すると、送信時にはそれぞれ約 `1.57`, `0.78`, `-0.78` [rad] に自動変換されます。（ラジアンで直接入力したい場合は `type: "float"` を使用します）


3. **時間の簡易指定 (`type: "time"`):**
* ROS 2の `builtin_interfaces/Duration` 型フィールドには `type: "time"` を指定できます。
* 小数点付きの数値（秒）を入力するだけで、自動的に `sec` と `nanosec` に変換されます。
* 従来通り、以下のように明示的に `sec` と `nanosec` を分けて設定することも可能です。



```yaml
points[1]:
    time_from_start:
        sec: {"type": "int", "name": "移動時間[s]: "}
        nanosec: {"type": "int", "name": "移動時間[ns]: "}

```

---

### `type` に設定可能な型一覧

Block 上の入力フィールドに指定できる `type` の一覧です。基本的には ROS 2 Interface の末端フィールドに対応しますが、`time` のみ `builtin_interfaces/Duration` 型全体に対応します。

| ROS 2 Interface 上の型 | 指定可能な `type` | 備考 |
| --- | --- | --- |
| `int8`, `int16`, `int32`, `int64` | `int`, `integer` | 整数型 |
| `float32`, `float64` | `float`, `double`, `deg` | `deg` を指定した場合、入力値を `× π / 180` して float（rad）として扱います。 |
| `string` | `string`, `str`, `char` | 文字列型 |
| `bool` | `bool`, `boolean` | 真偽値 |
| `builtin_interfaces/Duration` | `time` | 秒数（小数可）を Duration 型（`sec`, `nanosec`）に自動変換します。 |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## マイルストーン

- [ ] Service通信のResponse、およびAction通信のFeedback / Resultの取得・Block側への反映
- [ ] 作成したBlockの保存機能、および保存した状態からの再開（プロジェクトの復元）機能の実装
- [ ] Blocklyにおける変数保持機能の実装、および繰り返し（Loop）処理や条件分岐（IF）ブロックの使い勝手の向上
- [ ] 動的な配列について定義方法の提案・実装

Please check the [Issue page][issues-url] for current bugs and feature requests.


## 参考文献
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
