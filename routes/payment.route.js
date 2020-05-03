const express = require('express');
const https = require('https');
const { v1: uuidv1 } = require('uuid');
const querystring = require('qs');
const router = express.Router();


var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor";
var partnerCode = "MOMOE8XG20200502";
var accessKey = "69ARD65s7BDF5OMG";
var serectkey = "WdilOWiO5EfWa04nRDlbhMnQXoiPP0E2";
var orderInfo = "Thanh toán MoMo";
var amount = "10000";
var returnUrl = "https://hcmus1712589-momo.herokuapp.com/complete";
var notifyUrl = "https://callback.url/notify";

var requestType = "captureMoMoWallet";
var extraData = "merchantName=NguyenManh";


router.get('/', async (req, res) => {
 
  res.render('home',{ title: 'Trang chủ' });

})

router.get('/payment', async (req, res) => {
 
  res.render('test_payment', { title: 'Thanh toán' });

})


router.post('/payment',  (request, response) => {
  
  var amount = request.body.price;
  var orderId = uuidv1();
  var requestId = uuidv1();
  
  var rawSignature = "partnerCode="+partnerCode+"&accessKey="+accessKey+"&requestId="+requestId
  +"&amount="+amount+"&orderId="+orderId+"&orderInfo="+orderInfo+"&returnUrl="+returnUrl+"&notifyUrl="
  +notifyUrl+"&extraData="+extraData;

  //puts raw signature
  console.log("--------------------RAW SIGNATURE----------------")
  console.log(rawSignature)
  //signature
  const crypto = require('crypto');
  var signature = crypto.createHmac('sha256', serectkey)
                    .update(rawSignature)
                    .digest('hex');
  console.log("--------------------SIGNATURE----------------")
  console.log(signature)

  var body = JSON.stringify({
    partnerCode : partnerCode,
    accessKey : accessKey,
    requestId : requestId,
    amount : amount,
    orderId : orderId,
    orderInfo : orderInfo,
    returnUrl : returnUrl,
    notifyUrl : notifyUrl,
    extraData : extraData,
    requestType : requestType,
    signature : signature,
  })
  var options = { 
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/gw_payment/transactionProcessor',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
   }
  };
  //Send the request and get the response
  console.log("Sending....");
  req = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (body) => {
      console.log('Body');
      console.log(body);
      console.log('payURL');
      console.log(JSON.parse(body).payUrl);
      response.redirect(JSON.parse(body).payUrl);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });
  console.log(body);
  // write data to request body
  req.write(body);
  req.end();

  
})

router.get('/complete', async (req, res) => {
 
  res.render('complete',{ title: 'Thanh toán thành công' });

})
module.exports = router;
