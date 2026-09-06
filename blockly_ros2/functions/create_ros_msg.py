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


def get_value(data, mem, msg_type):
    # 最後msg_typeを見て代入
    msg_type = re.sub(r"\d", "", msg_type.lower())

    if ((msg_type == "int") or (msg_type == "integer")):
        value = int(data.get(mem, 0))
    elif ((msg_type == "float") or (msg_type == "double")):
        value = float(data.get(mem, 0.0))
    elif ((msg_type == "string") or (msg_type == "str") or (msg_type == "char")):
        value = str(data.get(mem, ""))
    elif ((msg_type == "bool") or (msg_type == "boolean")):
        val = data.get(mem, True)
        if ((val == "TRUE") or (val == "True") or (val == "true")):
            value = True
        else:
            value = False
    elif ((msg_type == "time")):
        from builtin_interfaces.msg import Duration
        val = float(data.get(mem, 0.0))
        frac, integral = math.modf(val)
        sec = int(integral)
        nanosec = round(frac * 1_000_000_000)
        if nanosec >= 1_000_000_000:
            sec += 1
            nanosec -= 1_000_000_000
        value = Duration(sec=sec, nanosec=nanosec)
    elif ((msg_type == "deg") or (msg_type == "degree")):
        value = float(data.get(mem, 0.0)) * math.pi / 180.0
    else:
        value = None
    
    return value


def replace_key(key):
    replaced_key = ""
    split_key = key.split("__")

    num_input = True
    for k in split_key:
        if (k.isnumeric()):
            replaced_key += "__" + k + "__"
            num_input = True
        else:
            if num_input:
                num_input = False
            else:
                replaced_key += "."
            replaced_key += k

    return replaced_key


def set_members(data, msg, members, topic_name):

    end_flag = False
    temp_data = data.copy()
    data = {}
    for key, value in temp_data.items():
        replaced_key = replace_key(key.replace(topic_name.replace("/", "") + "___", ""))
        data[replaced_key] = value

    while (not end_flag):
        end_flag = True
        replaced_members = {}
        for mem, msg_type in members.items():
            if (("[" in mem) and ("]" in mem)):
                num = int((mem.split("[")[1]).split("]")[0])

                for i in range(num):
                    replaced_members[mem.split("[" + str(num))[0] + "__" + str(i) + "__" + ("[" + str(num)).join(mem.split("[" + str(num))[1:])[1:]] = msg_type
                end_flag = False

            else:
                replaced_members[mem] = msg_type
        members = replaced_members


    for mem, msg_type in members.items():

        value = get_value(data, mem, msg_type)
        target = msg

        # "." で分割
        mem_dict = mem.split(".")

        for i in range(len(mem_dict)):
            attr = mem_dict[i]
            if ("__" in attr):
                num = int(attr.split("__")[1])
                temp_attr = attr.replace("__" + str(num) + "__", "")
                temp_value = getattr(target, temp_attr)
                if (i == len(mem_dict) - 1):
                    add_msg = type(value)()
                    if (len(temp_value) <= num):
                        temp_value.extend([add_msg] * (num - len(temp_value) + 1))
                        temp_value[num] = value
                else:
                    add_msg_type = str(target.__class__().get_fields_and_field_types()[temp_attr]).replace("sequence<", "").replace(">", "")
                    module = importlib.import_module(add_msg_type.split("/")[0] + ".msg")
                    add_msg = getattr(module, add_msg_type.split("/")[1])()
                    if (len(temp_value.__class__()) <= num):
                        temp_value.extend([add_msg] * (num - len(temp_value) + 1))
                if (i == len(mem_dict) - 1):
                    setattr(target, temp_attr, temp_value)
                target = temp_value[num]
            else:
                if (i == len(mem_dict) - 1):
                    setattr(target, attr, value)
                target = getattr(target, attr)

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