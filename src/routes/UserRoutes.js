const express = require('express');
const pool = require('../..');
const dbService = require('../services/dbService');
const moment = require('moment');

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
  
          res.json({ valid: true,data:user[0] });
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
 
    const {
      name, mobile_number, wa_number, email, marital_status, doa, spouse_name, spouse_number, children_count, address,city,state,pincode,dealership_code,org_name,proprietor_name,gst_number,profile_firm,association_started,dob
    } = req.body;
    

    const count = await dbService.executeQuery('SELECT EXISTS (SELECT 1 FROM public."tblRegistration" WHERE mobile = $1 UNION ALL SELECT 1 FROM public."tblMember" WHERE mobile_number = $1 UNION ALL SELECT 1 FROM public."tblUser" WHERE mobile_number = $1) AS mobile_exists',[mobile_number])
    console.log(count)
if(count[0].mobile_exists){
  return res.status(200).json({status:false,message:'Mobile number already registered'})
}

    const result = await dbService.executeQuery('INSERT INTO public."tblRegistration"( name, mobile, whatsapp, email_id, marital_status, date_of_anniversary, spouse_name,spouse_contact, number_of_children, address,city,state,pincode,dealership_code,org_name,proprietor_name,gst_number,profile_firm,association_started,dob) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)',[
      name, mobile_number, wa_number, email, marital_status, doa, spouse_name, spouse_number, children_count, address,city,state,pincode,dealership_code,org_name,proprietor_name,gst_number,profile_firm,association_started,dob])
    console.log(result);
    return res.status(200).json({status:true,message:'Success'})
   } catch (error) {
    console.log(error);
    return res.status(500).json({status:false,message:'Internal Server error'})
   }
  })



  userRoute.get('/pincodes',async (req,res)=>{

    const result = await dbService.executeQuery('SELECT * FROM public."tblpinmaster"')
console.log(result);
return res.status(200).json(result)


  })


   userRoute.post('/areamanager',async (req,res)=>{
    const {id} = req.body;
    console.log(id)
    const result = await dbService.executeQuery('SELECT * FROM public."tblareamanager" WHERE pin_id = $1',[id])
console.log(result);
if(result.length){


return res.status(200).json(result[0])
}else{
  return res.status(400).json({status:false,message:'No area manager found'})
}

  })
 


module.exports = userRoute