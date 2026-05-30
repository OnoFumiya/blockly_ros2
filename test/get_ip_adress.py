import socket

# Local IPアドレスを取得
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip_address = s.getsockname()[0]
s.close()

# Global IPアドレスを取得
# hostname = socket.gethostname()
# ip_address = socket.gethostbyname(hostname)

print("IPアドレス:", ip_address)