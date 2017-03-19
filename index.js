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
// certificates.set('certificate', [file_with_x509_der_cert]);

// form the request
var request = new PaymentProtocol().makePaymentRequest();
request.set('payment_details_version', 1);
request.set('pki_type', 'x509+sha256');
request.set('pki_data', certificates.serialize());
request.set('serialized_payment_details', details.serialize());
// request.sign(new PrivateKey('b221d9dbb083a7f33428d7c2a3c3198ae925614d70210e28716ccaa7cd4ddb79').toBuffer());

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