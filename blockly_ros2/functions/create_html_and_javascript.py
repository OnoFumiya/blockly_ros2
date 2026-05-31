import os


def get_directory_path():
    dir_path = "/".join(__file__.split("/")[:-2])
    base_dir_path = dir_path + "/template_files"
    create_dir_path = dir_path + "/static"
