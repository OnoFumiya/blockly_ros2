import os
import shutil

def get_directory_path():
    base_dir_path = "/".join(__file__.split("/")[:-3]) + "/template_files"
    create_dir_path = "/".join(__file__.split("/")[:-2]) + "/static"
    # print("\033[32m", base_dir_path, "\033[0m")
    # print("\033[32m", create_dir_path, "\033[0m")

    return base_dir_path, create_dir_path


def create_file(base_file_path, create_file_dir, create_file_name, options={}):
    create_file_only_name = create_file_name.split(".")[0].lower().replace("/", "")
    create_file_only_name_up  = create_file_only_name.upper()
    create_file_only_name_cap = ""
    for cf in create_file_only_name.split("_"):
        create_file_only_name_cap += cf.capitalize()

    with open(base_file_path) as f:
        s = f.read()

    s = s.replace('/*file_name*/', create_file_only_name)
    s = s.replace('/*FILE_NAME*/', create_file_only_name_up)
    s = s.replace('/*FileName*/', create_file_only_name_cap)

    while ("/*LIST_START:DATA_NAME*/" in s):
        before_loop = s.split("/*LIST_START:DATA_NAME*/")[0]
        before_loop_other = "/*LIST_START:DATA_NAME*/".join(s.split("/*LIST_START:DATA_NAME*/")[1:])
        in_loop = before_loop_other.split("/*LIST_END:DATA_NAME*/")[0]
        after_loop = "/*LIST_END:DATA_NAME*/".join(before_loop_other.split("/*LIST_END:DATA_NAME*/")[1:])
        temp_s = ""
        for key, item in options.items():
            in_loop_ = in_loop
            data = "__".join(key.split("."))
            data_up  = data.upper()
            in_loop_ = in_loop_.replace("/*data_name*/", data)
            in_loop_ = in_loop_.replace("/*DATA_NAME*/", data_up)
            temp_s += in_loop_

            # temp_temp_s = ""
            while ("/*IF_START:TYPE_NAME*/" in temp_s):
                temp_before_if = temp_s.split("/*IF_START:TYPE_NAME*/")[0]
                temp_before_if_other = "/*IF_START:TYPE_NAME*/".join(temp_s.split("/*IF_START:TYPE_NAME*/")[1:])
                temp_in_if = temp_before_if_other.split("/*IF_END:TYPE_NAME*/")[0]
                temp_after_if = "/*IF_END:TYPE_NAME*/".join(temp_before_if_other.split("/*IF_END:TYPE_NAME*/")[1:])
                if (temp_in_if[:len("/*" + item["type"] + "*/")] == ("/*" + item["type"] + "*/")):
                    temp_s = temp_before_if + temp_in_if.replace("/*" + item["type"] + "*/", "") + temp_after_if
                else:
                    temp_s = temp_before_if + temp_after_if
            name = item["name"]
            name_up = name.upper()
            temp_s = temp_s.replace("/*name_name*/", name)
            temp_s = temp_s.replace("/*NAME_NAME*/", name_up)

        s = before_loop + temp_s + after_loop

    with open(create_file_dir + "/" + create_file_name, mode='w') as f:
        f.write(s)


def clear_dir(set_dir_path):
    shutil.rmtree(set_dir_path)
    os.mkdir(set_dir_path)


if __name__ == "__main__":
    base_dir_path, create_dir_path = get_directory_path()
    # clear_dir(create_dir_path)
    # create_file(base_dir_path + "/custom_block.js", create_dir_path + "/custom_blocks", "spawn.js", {'name': {'type': 'string', 'name': 'Name: '}, 'x': {'type': 'float', 'name': 'X: '}, 'y': {'type': 'float', 'name': 'Y: '}})
    create_file(base_dir_path + "/index.html", create_dir_path, "index.html", {'TOOO': {"name": "TOOO"}, 'JJJJ': {"name": "JJJJ"}})
