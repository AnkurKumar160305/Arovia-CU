const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendOTP = async (mobile, otp) => {
  // In production, integrate with SMS service like Twilio, AWS SNS, etc.
  console.log(`Sending OTP ${otp} to ${mobile}`);
  return true;
};

module.exports = { generateOTP, sendOTP };