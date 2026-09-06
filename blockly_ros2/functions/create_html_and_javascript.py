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

    if ((create_file_name != "main.js") and (".js" in create_file_name)):
        s = loop_block_create_sentence(s)

    with open(create_file_dir + "/" + create_file_name, mode='w') as f:
        f.write(s)


def loop_block_create_sentence(sentence):
    split_sentence = sentence.split("\n")

    stack_index = []
    for i in range(len(split_sentence)):
        if (("[" in split_sentence[i]) and ("]" in split_sentence[i])):
            num = (split_sentence[i].split("[")[1]).split("]")[0]

            if (num.isnumeric()):
                num = int(num)
            else:
                continue

            if (": block.getFieldValue" in split_sentence[i]):
                stack_index += [{"addition_flag": False, "pair_flag": True, "index": [i, i+1], "num": num}]
            elif ("const " in split_sentence[i]):
                stack_index += [{"addition_flag": False, "pair_flag": False, "index": [i, i+2], "num": num}]
            elif ("console.log" in split_sentence[i]):
                stack_index += [{"addition_flag": False, "pair_flag": False, "index": [i, i+1], "num": num}]
            elif ("block.getFieldValue" not in split_sentence[i]):
                j = 1
                while True:
                    if ((i - j) < 0):
                        return sentence

                    if (".appendField" in split_sentence[i - j]):
                        break

                    j += 1

                stack_index += [{"addition_flag": True, "pair_flag": False, "index": [i - j, i + 1], "num": num}]

    if (len(stack_index) == 0):
        return sentence

    replaced_sentence = []
    i = 0
    while (i < len(split_sentence)):
        sel_index_info = None
        for index_info in stack_index:
            if ((index_info["index"][0] <= i) and (i <= index_info["index"][1])):
                sel_index_info = index_info
                break

        if (sel_index_info is None):
            replaced_sentence += [split_sentence[i]]

        else:
            if (sel_index_info["addition_flag"]):
                replaced_sentence[-2] = replaced_sentence[-2] + ";"
                replaced_sentence = replaced_sentence[:-1] + ["    this.appendDummyInput()"] + [replaced_sentence[-1]]

            for num in range(sel_index_info["num"]):
                for j in range(sel_index_info["index"][0], sel_index_info["index"][1] + 1):
                    if (sel_index_info["pair_flag"]):
                        temp_reppaced = split_sentence[j].split(": block.getFieldValue")
                        if (len(temp_reppaced) < 2):
                            replaced_sentence += [split_sentence[j]]
                        else:
                            temp_reppaced[0] = temp_reppaced[0].split("[" + str(sel_index_info["num"]))[0] + "__" + str(num) + "__" + ("[" + str(sel_index_info["num"])).join(temp_reppaced[0].split("[" + str(sel_index_info["num"]))[1:])[1:]
                            temp_reppaced[1] = temp_reppaced[1].split("[" + str(sel_index_info["num"]))[0] + "__" + str(num) + "__" + ("[" + str(sel_index_info["num"])).join(temp_reppaced[1].split("[" + str(sel_index_info["num"]))[1:])[1:]
                            replaced_sentence += [temp_reppaced[0] + ": block.getFieldValue" + temp_reppaced[1]]
                    else:
                        if ("[" + str(sel_index_info["num"]) in split_sentence[j]):
                            replaced_sentence += [split_sentence[j].split("[" + str(sel_index_info["num"]))[0] + "__" + str(num) + "__" + ("[" + str(sel_index_info["num"])).join(split_sentence[j].split("[" + str(sel_index_info["num"]))[1:])[1:]]
                        else:
                            replaced_sentence += [split_sentence[j]]

            i = index_info["index"][1]

        i += 1

    sentence = "\n".join(replaced_sentence)
    # return sentence
    return loop_block_create_sentence(sentence)


def clear_dir(set_dir_path):
    shutil.rmtree(set_dir_path)
    os.mkdir(set_dir_path)


if __name__ == "__main__":
    base_dir_path, create_dir_path = get_directory_path()
    # create_file(base_dir_path + "/index.html", create_dir_path, "index.html", {'TOOO': {"name": "TOOO"}, 'JJJJ': {"name": "JJJJ"}})