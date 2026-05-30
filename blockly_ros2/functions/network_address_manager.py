import socket
import qrcode


def get_ipaddress(mode = "Global"):
    ip_address = ""
    if (mode.lower() == "global"):
        # Get the global IP address
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip_address = s.getsockname()[0]
        s.close()
    elif (mode.lower() == "local"):
        # Get the local IP address
        hostname = socket.gethostname()
        ip_address = socket.gethostbyname(hostname)

    print("IP address:", ip_address, flush=True)

    return ip_address


def create_qrcode(url="https://example.com", save_file_name="../../img/qrcode.png"):
    img = qrcode.make(url) # Make
    img.save(save_file_name) # Save
    return img