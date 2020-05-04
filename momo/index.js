const express = require('express');
let app = express();
const https = require('https');
const querystring = require('qs');
const router = express.Router();


app.use(express.static(__dirname + '/public'));



app.post('/',  (request, response) => {
    const { v1: uuidv1 } = require('uuid');
    const https = require('https');
    //parameters send to MoMo get get payUrl
    var endpoint = "https://test-payment.momo.vn/gw_payment/transactionProcessor";
    var hostname = "https://test-payment.momo.vn";
    var path = "/gw_payment/transactionProcessor";
    var partnerCode = "MOMOEOOI20200501";
    var accessKey = "C0bguoXgVA1qa6GA";
    var serectkey = "NWhwpwRSSC98BP3QLJ3wUFAj7CWV3D6L";
    var orderInfo = "pay with MoMo";
    var returnUrl = "https://nvh-momo-1712439.herokuapp.com";
    var returnUrl = "http://localhost:5000/";
    var notifyUrl = "https://callback.url/notify";
    var amount = "50000";
    var requestType = "captureMoMoWallet";
    var extraData = "merchantName=HieuNguyen"; 
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


app.set('port', process.env.PORT || 5000 );
app.listen(app.get('port'), () => {
    console.log(`Server is running at port ${app.get('port')}`);
});