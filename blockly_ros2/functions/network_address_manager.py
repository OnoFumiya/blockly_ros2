import socket


def get_ipaddress(mode = "Global"):
    ip_address = ""
    if (mode.lower() == "global"):
        # Global IPアドレスを取得
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip_address = s.getsockname()[0]
        s.close()
    elif (mode.lower() == "local"):
        # Local IPアドレスを取得
        hostname = socket.gethostname()
        ip_address = socket.gethostbyname(hostname)

    print("IPアドレス:", ip_address, flush=True)

    return ip_address