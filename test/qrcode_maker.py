import qrcode

port_num = 5000

# url = "http://192.168.1.29:" + str(port_num)
url = "https://example.com"

img = qrcode.make(url)

img.save("../img/qrcode.png")

print("QRコードを保存しました")