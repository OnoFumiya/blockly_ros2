import rclpy
from rclpy.node import Node
from rclpy.action import ActionClient

from std_msgs.msg import String
from sensor_msgs.msg import Image

import os
import time

from ament_index_python.packages import get_package_share_directory
import yaml


class CommunicationsControl():
    def __init__(self, node):
        self.node = node

        qos_policy = rclpy.qos.QoSProfile(
            reliability=rclpy.qos.ReliabilityPolicy.RELIABLE,
            history=rclpy.qos.HistoryPolicy.KEEP_LAST,
            durability=rclpy.qos.DurabilityPolicy.TRANSIENT_LOCAL,
            depth=1
        )

        self.url_link_pub = self.node.create_publisher(String, "blockly_url_link", qos_policy)
        self.url_qr_pub = self.node.create_publisher(Image, "blockly_url_qrcode", qos_policy)


    def uipath_publish(self, str_data, img_data):
        self.url_link_pub.publish(String(data=str_data))
        self.url_qr_pub.publish(img_data)


    def topic_run(self, controller, send_msg, msg_type):
        self.node.get_logger().info("--- Topic (START) ---")

        self.node.get_logger().info(str(send_msg))

        controller.publish(send_msg)

        self.node.get_logger().info("--- Topic (START) ---")


    def service_run(self, controller, send_msg, msg_type):
        self.node.get_logger().info("--- Service (START) ---")

        self.node.get_logger().info(str(send_msg))

        future = controller.call_async(send_msg)

        rclpy.spin_until_future_complete(self.node, future)

        # TODO : Result for Blockly
        response = future.result()

        self.node.get_logger().info("--- Service (END) ---")


    def action_run(self, controller, send_msg, msg_type):
        self.node.get_logger().info("--- Action (START) ---")

        # TODO: Use Feedback
        feedback_msg = msg_type.Feedback()
        def callback_feedback(msg):
            nonlocal feedback_msg
            feedback_msg = msg.feedback
            self.node.get_logger().info(str(feedback_msg))

        future = controller.send_goal_async(
            send_msg,
            feedback_callback=callback_feedback,
        )

        rclpy.spin_until_future_complete(self.node, future)
        goal_handle = future.result()
        result_future = goal_handle.get_result_async()

        while (rclpy.ok()):
            rclpy.spin_once(self.node, timeout_sec=0.5)
    
            if result_future.done():
                break

        if not result_future.done():
            rclpy.spin_until_future_complete(self.node, result_future)

        # TODO : Result for Blockly
        result = result_future.result().result

        self.node.get_logger().info("--- Action (END) ---")