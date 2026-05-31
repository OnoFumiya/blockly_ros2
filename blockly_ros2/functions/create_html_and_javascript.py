import os


def get_directory_path():
    base_dir_path = "/".join(__file__.split("/")[:-3]) + "/template_files"
    create_dir_path = "/".join(__file__.split("/")[:-2]) + "/static"
    print("\033[32m", base_dir_path, "\033[0m")
    print("\033[32m", create_dir_path, "\033[0m")
