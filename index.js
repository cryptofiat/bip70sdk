var PaymentProtocol = require('bitcore-payment-protocol');
var Script = require('bitcore-lib/lib/script/script');
var Address = require('bitcore-lib/lib/address');
var PrivateKey = require('bitcore-lib/lib/privatekey');

var requestorAddress = '1NaTVwXDDUJaXDQajoa9MqHhz4uTxtgK14';
var appUrl = "http://localhost:8080"
var restEndpoint = "/v1/payment-request"

var now = Date.now() / 1000 | 0;

// construct address
var address = Address.fromString(requestorAddress);
var script = Script.buildPublicKeyHashOut(address);

// constructing outputs
var outputs = new PaymentProtocol().makeOutput();
outputs.set('amount', 1);
outputs.set('script', script.toBuffer());

// construct the payment details
var details = new PaymentProtocol().makePaymentDetails();
details.set('network', 'test');
details.set('outputs', outputs.message);
details.set('time', now);
details.set('expires', now + 60 * 60 * 24);
details.set('memo', 'A payment request from the merchant.');
details.set('payment_url', 'https://localhost/-/pay');
details.set('merchant_data', new Buffer(7)); // identify the request

var certificates = new PaymentProtocol().makeX509Certificates();
certificates.set('certificate',
`3082 03b5 3082 029d a003 0201 0202 0900
8de8 b98c fcd5 9e4c 300d 0609 2a86 4886
f70d 0101 0b05 0030 4531 0b30 0906 0355
0406 1302 4155 3113 3011 0603 5504 0813
0a53 6f6d 652d 5374 6174 6531 2130 1f06
0355 040a 1318 496e 7465 726e 6574 2057
6964 6769 7473 2050 7479 204c 7464 301e
170d 3137 3033 3139 3039 3237 3234 5a17
0d31 3930 3331 3930 3932 3732 345a 3045
310b 3009 0603 5504 0613 0241 5531 1330
1106 0355 0408 130a 536f 6d65 2d53 7461
7465 3121 301f 0603 5504 0a13 1849 6e74
6572 6e65 7420 5769 6467 6974 7320 5074
7920 4c74 6430 8201 2230 0d06 092a 8648
86f7 0d01 0101 0500 0382 010f 0030 8201
0a02 8201 0100 ad4a fec4 f4b7 8a0c 70de
e93c 4435 14ff 68a6 e243 08b5 c9d5 c32a
f543 3f50 da9a 659a 9dc7 e7e0 2f45 bb0c
151b 6647 f33a cdd7 09b1 3748 24e8 402b
a324 b695 9065 c17f 8194 7db2 4529 d429
447e c9db 913f fdd5 0ccb 52de 5de2 5cd2
72c3 8750 763d 73d2 4961 7294 5eed 6d6e
d0b3 6664 8c0a 5e91 cb8f 6d74 a803 608a
55e9 5bc7 43a8 9357 9999 4bbf b3b8 3637
bcee 66ad 4786 6dc6 9d22 be40 fbc3 1b32
386c fa5d e63a 74c8 f90f df5d 7354 651a
56f7 860a 354b 9464 d2f3 77da 912d 6d96
a16a a239 cb42 2cbb 456e 331e dea4 2fdd
ea96 2418 71e0 96b0 8d30 9c2d 5a91 b56b
c627 c4cc 2d68 1ad6 4387 6fcd dd56 661f
c9b0 b797 9562 4711 1f5d 26db 691b 522c
92fe b766 dee7 0203 0100 01a3 81a7 3081
a430 1d06 0355 1d0e 0416 0414 72f9 611d
556b 1a77 863b f9d7 05ec 531e 358c bd55
3075 0603 551d 2304 6e30 6c80 1472 f961
1d55 6b1a 7786 3bf9 d705 ec53 1e35 8cbd
55a1 49a4 4730 4531 0b30 0906 0355 0406
1302 4155 3113 3011 0603 5504 0813 0a53
6f6d 652d 5374 6174 6531 2130 1f06 0355
040a 1318 496e 7465 726e 6574 2057 6964
6769 7473 2050 7479 204c 7464 8209 008d
e8b9 8cfc d59e 4c30 0c06 0355 1d13 0405
3003 0101 ff30 0d06 092a 8648 86f7 0d01
010b 0500 0382 0101 00aa 8f29 f32d c400
13ed f3b5 d248 5f43 3e44 65a0 e727 5ab6
6a8d 5e49 14fa 225f 0fa0 79fe 7617 16d8
1c55 4f59 0412 8e20 6be7 d0ae 3e80 d564
9383 9f16 e466 d7e9 c573 2fb7 b9b6 9efe
3d5e ce04 08ae 2483 3e15 a614 6ada 261c
8e96 04fe d420 eeeb 3019 08fb b0ac b063
a0e9 8e26 674c fe4b 3b31 57a6 329b 181f
58eb 819c 19b4 8e39 58af e851 1a50 b2bb
f480 2cc8 4532 e473 cb91 9462 90f1 f1d4
0ff7 b681 3142 55de e569 4094 73c6 9b05
c9ba c3ff cf4c 9dc5 9a75 8569 26bd e9a4
c7eb 3e5c 3fee 19ff c190 2074 07ac d687
135e 9389 e874 f6b2 b715 d13f a4bc 180d
18c4 78ce e612 f2e3 a10d f526 cfa3 32bc
d656 7deb 99ac a2b0 ba5c 9e9f 09ef 8246
b358 7e07 558a c65b 36`); //x509_der_cert

// form the request
var request = new PaymentProtocol().makePaymentRequest();
request.set('payment_details_version', 1);
request.set('pki_type', 'x509+sha256');
request.set('pki_data', certificates.serialize());
request.set('serialized_payment_details', details.serialize());

request.sign(`-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEArUr+xPS3igxw3uk8RDUU/2im4kMItcnVwyr1Qz9Q2pplmp3H
5+AvRbsMFRtmR/M6zdcJsTdIJOhAK6MktpWQZcF/gZR9skUp1ClEfsnbkT/91QzL
Ut5d4lzScsOHUHY9c9JJYXKUXu1tbtCzZmSMCl6Ry49tdKgDYIpV6VvHQ6iTV5mZ
S7+zuDY3vO5mrUeGbcadIr5A+8MbMjhs+l3mOnTI+Q/fXXNUZRpW94YKNUuUZNLz
d9qRLW2WoWqiOctCLLtFbjMe3qQv3eqWJBhx4JawjTCcLVqRtWvGJ8TMLWga1kOH
b83dVmYfybC3l5ViRxEfXSbbaRtSLJL+t2be5wIDAQABAoIBAEVgOcCl6/izZFiJ
bVwtGBvsTKtWhN0qUY7R2uCyL29k0npk4kwdPy+eY4brsjXp1Ufk5/dvl01XQaF2
rdL+65EhNyesR+ofsFBEuSw9Kc7rnHY3qgqiBVoDKSlSyBBZVd7ReBkwIuAiE2aC
3N+IL1xTYfDpmbtTLA7xMtW6rXqTEC14uT6Bn+8XxawkQ/O6Pr08JqfctrBgPjpM
nWmGO5uI3Qmik7XLTQvC1txRAPkC2UL6/kiaokGM28fd4Uk2PqYf712ydxQ/SEC6
AH4OBDVsoLuSudMHFaSGQUvMN1Y5SzH1US6IHw6n0RPEDILekfcZD2SfyPIF50Wj
gajvPTkCgYEA5X+sPyv8AoW4HMzm3ffpQjJpDD2cutC1ieJGYuKiQZYAsA5Hdpy4
O+RFj9OpLwLZVnnyFavU9NSa08iO/mtEfKTU9dqxUXR7pO4LlVe+Bu+mdpbNhF6A
J1rkP+MudpfRqtoFlTrLIVVqV3MvD9RG6d2dNUAfBRMjuLCJKxqfJoMCgYEAwU3L
lcmFjc+CL5+t7EBqldinIG7rMMgsj3Z/bJwkTrZ/79+YV3+ccKs3tcBPqqKgbgqv
NZimp6deI8In/5KLLue4NAaB1/cMi13BHVjpH8lsWyyN/diy+GIpGI6rNCReWVEd
bwhW1fhPgwbY689+E9F75CAkNKahrLXwme7oWM0CgYEAkGTd6PkxnByqFGTPNQVQ
G7g/49W4EMpUDibyBjF1yTIpyJuTVwuP1w7uvWl83vk56XDcYco1OL2zlGBxp52x
/4JuAynPuuJBESo823/TLeYGpEKJmCklFJ3ZUmEL0M4AuzBlptjRCW4GdHMiPyFe
ZLJswR5Q5g5+wStBgn9DdyUCgYBxpg5y40d9J6pP257CzuCbdwRTgkMOrDHeqvmh
3m9OQ+gWHKyRjPpqF5AqcIWmOfT+nZODfFtHKJSli2o+zWa9TgkztTuzwJEEgzud
yH9Pa/oj5J8axsP6WqP0xzSK9HLwKkuW0x1Ssan1zBnPEm/6sOgZKHiA6BMX2uQ5
bIf4ZQKBgQChzMFU3WpmuQ6dU0g5FpHgRbYRdwHKYBltROQhszLyJOWdNHGxMHC2
fnktEQfPeU4COAdc6LL9h3pN72fy0148t5gepJv8xz/IMgygcRRGwP8TlLmZG4A6
FBEaaIjpU57LUfBwLjD9YdySzRUq08s2xWOaftCTffDhuErdOXXKnQ==
-----END RSA PRIVATE KEY-----`);

// serialize the request
var rawbody = request.serialize();
console.log('REQUEST:')
console.log(request);

console.log('\n\nRAW BODY:')
console.log(rawbody);

console.log('\n\nRAW BODY FULL HEX:')
console.log(rawbody.toString('hex'));

console.log('\n\nDESERIALIZED:')
console.log(request.deserialize(rawbody));

var axios = require('axios/lib/axios');

axios.post(appUrl + restEndpoint, rawbody,
      { 
      	// responseType: 'arraybuffer',
      	responseType: 'string',
      	headers: {'Content-Type': 'application/octet-stream'}
      	// headers: {'Content-Type': 'application/x-protobuf'}
      }
    ).then(function (response) {
      console.log(response)
    })
    .catch(function (response) {
      console.log(response)
	})