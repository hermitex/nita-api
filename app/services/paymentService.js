// services/paymentService.js
const axios = require("axios");

const paymentRepository = require("../repositories/paymentRepository");
// Constants
const consumerKey = "ogpxpuJ3hT0jpUALlLwOKOjGceklTP42";
const consumerSecret = "TDa2ueM0LGEF1z44";
const shortcode = "174379";
const passkey =
  "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

// Generate base64-encoded credentials for Basic Authentication
const base64Credentials = Buffer.from(
  `${consumerKey}:${consumerSecret}`
).toString("base64");

exports.processPayment = async ({partyA, partyB, amount}) => {
  // Business logic for processing payment
  let response = await lipaNaMpesa(partyA, partyB, amount);
  return response;
};

// Function to generate a timestamp
const generateTimestamp = () => {
  const date = new Date();
  return date.toISOString().replace(/\D/g, "").slice(0, 14);
};

// Function to generate a password
const generatePassword = () => {
  const timestamp = generateTimestamp();
  const rawPassword = `${shortcode}${passkey}${timestamp}`;
  return Buffer.from(rawPassword).toString("base64");
};

// Endpoint for making MPESA payment
const lipaNaMpesa = async (partyA, partyB, amount) => {
  try {
    const accessTokenResponse = await generateAccessToken();
    const accessToken = accessTokenResponse.access_token;

    // Construct the request body
    const password = generatePassword();
    const requestBody = {
      SecurityCredential: "YOUR_SECURITY_CREDENTIAL",
      BusinessShortCode: "174379",
      Password: password,
      Timestamp: generateTimestamp(),
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: partyA,
      PartyB: "174379",
      PhoneNumber: partyB,
      CallBackURL: "https://webhook.site/a128ad61-6226-4390-b244-c7f399475a03",
      AccountReference: "Nita Training",
      TransactionDesc: "Payment of Training at Nita",
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    // Make the actual MPESA payment request
    const paymentResponse = await makeHttpRequest(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      "POST",
      requestBody,
      headers
    );

 

    const getCallBackheaders = {
      "Content-Type": "application/json",

      "api-key": "00000000-0000-0000-0000-000000000000",
    };

    // const data = await makeHttpRequest(
    //   "https://enz2twqyavpe.x.pipedream.net",
    //   "GET",
    //   "",
    //   getCallBackheaders
    // );
    // console.log(`dump data: ${data}`);
    return paymentResponse;
  } catch (error) {
    console.error("Error:", error.message);
    return { error: "Internal Server Error" };
  }
};

// Function to generate an access token
const generateAccessToken = async () => {
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${base64Credentials}`,
  };
  const response = await makeHttpRequest(url, "GET", null, headers);
  return response.data;
};

// Function to make HTTP requests
const makeHttpRequest = async (url, method, data, headers) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    });
    return response;
  } catch (error) {
    throw new Error(`HTTP Request failed: ${error.message} ${url}`);
  }
};
