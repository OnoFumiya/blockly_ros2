import qrcode

port_num = 5000

url = "https://example.com"

img = qrcode.make(url)

img.save("../img/qrcode.png")

print("QRコードを保存しました")