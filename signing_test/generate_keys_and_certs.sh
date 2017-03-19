openssl req -x509 -sha256 -nodes -days 730 -newkey rsa:2048 -keyout selfsigned.key -out cert.pem
openssl x509 -outform der -in cert.pem -out cert.der