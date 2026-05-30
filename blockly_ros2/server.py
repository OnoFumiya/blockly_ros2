import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient

import os
import copy
import time
from subprocess import Popen

from ament_index_python.packages import get_package_share_directory
import yaml

from .functions import create_ros_msg
from .functions import ros2_communications_control
from .functions import network_address_manager

from flask import Flask
from flask import request
from flask import jsonify
from flask import send_from_directory

from flask_cors import CORS

app = Flask(__name__, static_folder="static")

CORS(app)


class BlocklyServer(Node):
    def __init__(self, app):
        super().__init__('blockly_server')
        self.app = app

        default_config_file = os.path.join(get_package_share_directory("blockly_ros2"), "config", "block_structure.yaml")

        # Declare Parameters
        self.declare_parameter("block_config", default_config_file)
        self.declare_parameter("port", 5000)
        self.declare_parameter("ui_bringup", False)

        self.comm_ctrl = ros2_communications_control.CommunicationsControl(self)

        # Get Parameter
        block_config = self.get_parameter("block_config").get_parameter_value().string_value
        self.port = self.get_parameter("port").get_parameter_value().integer_value

        self.controllers = {}
        if (not os.path.isfile(block_config)):
            self.get_logger().error("\033[31mConfig File not found...\033[0m")
            exit(0)

        with open(block_config, 'r') as file:
            self.controllers = yaml.safe_load(file)


        # self.controllers = {
        #     # "topic_name" : {"msg_type": "ros2_msgs/Topic",                       "mode": "topic",   "value_rules": {"data": {"type": "type", "name": "UI上のブロック名"}}},
        #     "text"       : {"msg_type": "std_msgs/String",                       "mode": "topic",   "value_rules": {"data": {"type": "string", "name": "テキスト"}}},
        #     "number"     : {"msg_type": "std_msgs/Float64",                      "mode": "topic",   "value_rules": {"data": {"type": "float", "name": "数値"}}},
        #     "spawn"      : {"msg_type": "turtlesim/Spawn",                       "mode": "service", "value_rules": {"x": {"type": "float", "name": "X座標"}, "y": {"type": "float", "name": "Y座標"}, "name": {"type": "string", "name": "名前"}}},
        #     "fibonacci"  : {"msg_type": "action_tutorials_interfaces/Fibonacci", "mode": "action",  "value_rules": {"order": {"type": "int", "name": "計算したい回数"}}},
        # }

        # "value_rules"内をUIが解釈できる形に形成する
        self.buirding_rules()

        # Topic/Service/Actionの初期化
        self.load_controllers()

        # ルーティング登録
        self.set_url_rule()


    def load_controllers(self):

        # すべてのコントローラをTopic/Service/Actionにわける
        for topic_name, info in self.controllers.items():
            info["controller"] = None

            # コントローラーの初期化
            if (info["mode"] == "topic"):
                info["msg_type"] = create_ros_msg.create_interface(info["msg_type"], mode="msg")

                if info["msg_type"] is not None:
                    info["controller"] = self.create_publisher(info["msg_type"], topic_name, 1)

            elif (info["mode"] == "service"):
                info["msg_type"] = create_ros_msg.create_interface(info["msg_type"], mode="srv")

                if info["msg_type"] is not None:
                    info["controller"] = self.create_client(info["msg_type"], topic_name)

                    while not info["controller"].wait_for_service(timeout_sec=1.0):
                        self.get_logger().info(f'\033[93m[{topic_name}] Service server is not available, waiting again...\033[0m')

            elif (info["mode"] == "action"):
                info["msg_type"] = create_ros_msg.create_interface(info["msg_type"], mode="action")

                if info["msg_type"] is not None:
                    info["controller"] = ActionClient(self, info["msg_type"], topic_name)

                    while not info["controller"].wait_for_server(timeout_sec=1.0):
                        self.get_logger().info(f'\033[93m[{topic_name}] Action server is not available, waiting again...\033[0m')


    def buirding_rules(self):

        for topic_name, info in self.controllers.items():

            """
            {
                "memA": {
                    "type": "float",
                    "name": "FLOAT_MSG"
                },
                "mini": {
                    "mini_memB": {
                        "type": "string", "name": "STR_MSGB"
                    },
                    "mini_memC": {
                        "type": "string",
                        "name": "STR_MSGB"
                    }
                }
            }
            --> 変換 -->
            {
                "memA": "float",
                "mini.mini_memB": "string",
                "mini.mini_memC": "string",
            }
            """

            info["value_rules"] = create_ros_msg.build_tree("", info["value_rules"], {"type": None, "name": None})


    def set_url_rule(self):
        self.app.add_url_rule("/", view_func=self.index)

        for topic_name, info in self.controllers.items():
            if (info["controller"] is not None):
                # URLルールを設定
                url_rule = f"/{topic_name.replace("/", "")}"

                # ルールの追加
                self.app.add_url_rule(
                    url_rule,
                    endpoint=topic_name.replace("/", ""),
                    view_func=lambda topic_name=topic_name: self.run(topic_name),
                    methods=["POST"]
                )


    def get_values(self, key):

        data = request.json

        rules = {}
        for rule in self.controllers[key]["value_rules"]:
            rules[rule] = data

        return rules


    def execute(self):

        if (self.get_parameter("ui_bringup").get_parameter_value().bool_value):
            url = "http://" + str(network_address_manager.get_ipaddress()) + ":" + str(self.port)
            Popen(["xdg-open", url])

        self.app.run(
            host="0.0.0.0",
            port=self.port
        )


    # =========================
    # Blockly UI
    # =========================
    def index(self):

        return send_from_directory(
            "static",
            "index.html"
        )


    # =========================
    # Python API (Callback of Block)
    # =========================
    def run(self, key):

        data = request.json

        send_msg = create_ros_msg.create_send_message(
            data,
            self.controllers[key]["msg_type"],
            copy.deepcopy(self.controllers[key]["value_rules"]),
            self.controllers[key]["mode"],
            key,
        )

        return_msg = {}

        if (self.controllers[key]["mode"] == "topic"):
            return_msg = self.comm_ctrl.topic_run(
                self.controllers[key]["controller"],
                send_msg,
                self.controllers[key]["msg_type"]
            )

        elif (self.controllers[key]["mode"] == "service"):
            return_msg = self.comm_ctrl.service_run(
                self.controllers[key]["controller"],
                send_msg,
                self.controllers[key]["msg_type"]
            )

        elif (self.controllers[key]["mode"] == "action"):
            return_msg = self.comm_ctrl.action_run(
                self.controllers[key]["controller"],
                send_msg,
                self.controllers[key]["msg_type"]
            )

        # TODO: return_msgを見てUIに対して結果を送信
        result = jsonify({
            "status": "success"
        })

        return result


def main():
    global app

    rclpy.init()
    node = BlocklyServer(app)

    node.execute()

    node.destroy_node()
    rclpy.shutdown()

# =========================

if __name__ == "__main__":
    main()