const axios = require('axios');

// Define your API key directly
const apiKey = 'P5yST7HuO2aQXYiaJBHpcgOkRIXfbpGW';

// Define the request data
const requestData = {
  apiKey: apiKey,
  fromCountryCode: '+91',
  fromPhoneNo: '+919392365494', // Ensure this number is verified with phone.email
  toCountrycode: '+91',
  toPhoneNo: '+919392365494', // Ensure this number is verified with phone.email
  subject: 'Your SMS Subject',
  tinyFlag: true,
  messageBody: 'Your SMS message here'
};

// Make POST request to phone.email API
axios.post('https://api.phone.email/v1/sendmail', requestData)
  .then(response => {
    if (response.status === 200 && response.data && response.data.responseCode === 0) {
      console.log('SMS Sent successfully');
    } else {
      console.error('Error sending SMS: Unexpected response:', response.data);
    }
  })
  .catch(error => {
    console.error('Error sending SMS:', error.message);
  });
