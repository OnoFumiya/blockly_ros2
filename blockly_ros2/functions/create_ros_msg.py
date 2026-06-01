import re
import importlib
import math

def create_interface(module_command, mode="msg"):
    command_set = re.split("[./]", module_command)

    is_ok = True
    if ((len(command_set) != 2) and (len(command_set) != 3)):
        is_ok = False
    elif (len(command_set) == 3):
        if (command_set[1] == mode):
            command_set[1] = command_set[2]
        else:
            is_ok = False

    if (not is_ok):
        print("\033[31mInvalid command format: " + module_command + "\033[0m", flush=True)
        return None

    try:
        module = importlib.import_module(command_set[0] + "." + mode)
        return getattr(module, command_set[1])
    except Exception as e:
        print("\033[31mError occurred while creating interface: " + str(e) + "\033[0m", flush=True)
        return None


def set_members(data, msg, members, topic_name):
    for mem, msg_type in members.items():

        # "." または "/" で分割
        mem_dict = re.split(r"[./]", mem)

        target = msg

        # 最後の1つ前まで辿る
        for attr in mem_dict[:-1]:
            target = getattr(target, attr)

        # 最後msg_typeを見て代入
        msg_type = re.sub(r"\d", "", msg_type.lower())
        get_namespace = topic_name.replace("/", "") + "___" + mem.replace(".", "__")

        value = None
        if ((msg_type == "int") or (msg_type == "integer")):
            value = int(data.get(get_namespace, 0))
        elif ((msg_type == "float") or (msg_type == "double")):
            value = float(data.get(get_namespace, 0.0))
        elif ((msg_type == "string") or (msg_type == "str") or (msg_type == "char")):
            value = str(data.get(get_namespace, ""))
        elif ((msg_type == "bool") or (msg_type == "boolean")):
            val = data.get(get_namespace, True)
            if ((val == "TRUE") or (val == "True") or (val == "true")):
                value = True
            else:
                value = False
        elif ((msg_type == "time")):
            from builtin_interfaces.msg import Duration
            val = float(data.get(get_namespace, 0.0))
            frac, integral = math.modf(val)
            sec = int(integral)
            nanosec = round(frac * 1_000_000_000)
            if nanosec >= 1_000_000_000:
                sec += 1
                nanosec -= 1_000_000_000
            value = Duration(sec=sec, nanosec=nanosec)
        elif ((msg_type == "deg") or (msg_type == "degree")):
            value = float(data.get(get_namespace, 0.0)) * math.pi / 180.0
        else:
            pass
            # TODO: List of (int or float or str)
        
        if (value is not None):
            if (mem_dict[-1] == ""):
                msg = value
            else:
                setattr(target, mem_dict[-1], value)

    return msg


def create_send_message(data, msg_type, members, mode, topic_name):
    if (mode == "topic"):
        msg = msg_type()
    elif (mode == "service"):
        msg = msg_type.Request()
    else:
        msg = msg_type.Goal()

    msg = set_members(data, msg, members, topic_name)

    return msg


def build_tree(prefix, msg, template_val):
    tree = {}

    for key, value in msg.items():

        # 現在のキー名を生成
        current_key = f"{prefix}.{key}" if prefix else key

        # 最終ノード判定
        if isinstance(value, dict) and (value.keys() == template_val.keys()):
            tree[current_key] = value

        # まだネストが続く場合
        elif isinstance(value, dict):
            tree.update(build_tree(current_key, value, template_val))

    return tree