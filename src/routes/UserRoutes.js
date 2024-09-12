const express = require('express');
const pool = require('../..');
const dbService = require('../services/dbService')

const userRoute = express.Router();

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

userRoute.post('/generate-otp', async (req, res) => {
    const { mobile_number } = req.body;
  
    if (!mobile_number) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }
  
    const otp = generateOtp();
    const created_at = new Date();
  
    try {
      
      await dbService.executeQuery(
        'INSERT INTO public."tblOtpValidation" (mobile_number, otp, created_at) VALUES ($1, $2, $3)',
        [mobile_number, otp, created_at]
      );
  
      //return otp
      res.json({ otp });
    } catch (err) {
      console.error('Error inserting OTP:', err);
      res.status(500).json({ error: 'Failed to generate OTP' });
    }
  });

  userRoute.post('/login', async (req, res) => {
    const { mobile_number, otp } = req.body;
  
    if (!mobile_number || !otp) {
      return res.status(400).json({ error: 'Mobile number and OTP are required' });
    }
  
    try {
      
      const result = await dbService.executeQuery(
        'SELECT otp, created_at FROM public."tblOtpValidation" WHERE mobile_number = $1 ORDER BY created_at DESC LIMIT 1',
        [mobile_number]
      );
  console.log(result)
      const storedOtp = result[0] ? result[0].otp : null;
      const createdAt = result[0] ? result[0].created_at : null;
  
      if (storedOtp && otp === storedOtp) {
      
        const otpAge = new Date() - new Date(createdAt);
        const otpExpiry = 5 * 60 * 1000; 
  
        if (otpAge < otpExpiry) {
      
          await dbService.executeQuery(
            'DELETE FROM public."tblOtpValidation" WHERE mobile_number = $1 AND otp = $2',
            [mobile_number, otp]
          );

          const user = await dbService.executeQuery('SELECT * FROM public."tblMember" where mobile_number=$1',[mobile_number]);
          console.log(user)
  
          res.json({ valid: true,data:user });
        } else {
          res.json({ valid: false, reason: 'OTP expired' });
        }
      } else {
        res.json({ valid: false });
      }
    } catch (err) {
      console.error('Error validating OTP:', err);
      res.status(500).json({ error: 'Failed to validate OTP' });
    }
  })


  userRoute.post('/validate-otp', async (req, res) => {
    const { mobile_number, otp } = req.body;
  
    if (!mobile_number || !otp) {
      return res.status(400).json({ error: 'Mobile number and OTP are required' });
    }
  
    try {
      
      const result = await dbService.executeQuery(
        'SELECT otp, created_at FROM public."tblOtpValidation" WHERE mobile_number = $1 ORDER BY created_at DESC LIMIT 1',
        [mobile_number]
      );
  
      const storedOtp = result.rows[0] ? result.rows[0].otp : null;
      const createdAt = result.rows[0] ? result.rows[0].created_at : null;
  
      if (storedOtp && otp === storedOtp) {
      
        const otpAge = new Date() - new Date(createdAt);
        const otpExpiry = 5 * 60 * 1000; 
  
        if (otpAge < otpExpiry) {
      
          await dbService.executeQuery(
            'DELETE FROM public."tblOtpValidation" WHERE mobile_number = $1 AND otp = $2',
            [mobile_number, otp]
          );
  
          res.json({ valid: true });
        } else {
          res.json({ valid: false, reason: 'OTP expired' });
        }
      } else {
        res.json({ valid: false });
      }
    } catch (err) {
      console.error('Error validating OTP:', err);
      res.status(500).json({ error: 'Failed to validate OTP' });
    }
  })


  userRoute.post('/register-user', async (req, res) => {
   try {


    
    
   } catch (error) {
    console.log(error);
    return res.status(500).json({status:false,message:'Internal Server error'})
   }
  })


module.exports = userRoute