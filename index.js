const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const Campaigns = require('./src/datasource/campaignMaster');
const Engagement = require('./src/datasource/Engagement');
const app = express();
const port = 5008;


const pool = new Pool({
  user: 'apollodbadmin',
  host: '35.207.195.181',
  database: 'apollo',
  password: 'Test@123',
  port: 5432,
});

app.use(bodyParser.json());

// six-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Endpoint to generate and store an OTP
app.post('/api/generate-otp', async (req, res) => {
  const { mobile_number } = req.body;

  if (!mobile_number) {
    return res.status(400).json({ error: 'Mobile number is required' });
  }

  const otp = generateOtp();
  const created_at = new Date();

  try {
    
    await pool.query(
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

// Endpoint to validate an OTP
app.post('/api/validate-otp', async (req, res) => {
  const { mobile_number, otp } = req.body;

  if (!mobile_number || !otp) {
    return res.status(400).json({ error: 'Mobile number and OTP are required' });
  }

  try {
    
    const result = await pool.query(
      'SELECT otp, created_at FROM public."tblOtpValidation" WHERE mobile_number = $1 ORDER BY created_at DESC LIMIT 1',
      [mobile_number]
    );

    const storedOtp = result.rows[0] ? result.rows[0].otp : null;
    const createdAt = result.rows[0] ? result.rows[0].created_at : null;

    if (storedOtp && otp === storedOtp) {
    
      const otpAge = new Date() - new Date(createdAt);
      const otpExpiry = 5 * 60 * 1000; 

      if (otpAge < otpExpiry) {
    
        await pool.query(
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
});
function getCampaignById(id) {
  return Campaigns.find(campaign => campaign.id === id);
}
app.get('/api/campaigns',async (req,res)=>{

  var result = [
    {id:1,
      name:"AVC - Chef ki khoj",
      details:"Apollo AVC's 'Chef Ki Khoj' seeks talented chefs to showcase their culinary skills in an exciting competition. Apply now!",
      start_date:"2024-09-10 18:30:00",
      end_date:"2024-09-25 18:30:00",
      poster_url:"https://storage.googleapis.com/vguard_staging_bucket/apollo/appImages/Campaign/Poster/d5c50fd7-e352-4aa4-ab95-e101d9594be3.png",

    },
    {id:2,
      name:"AVC - Talent ki khoj",
      details:"Apollo AVC's 'Talent Ki Khoj' seeks talented chefs to showcase their culinary skills in an exciting competition. Apply now!",
      start_date:"2024-09-10 18:30:00",
      end_date:"2024-09-25 18:30:00",
      poster_url:"https://storage.googleapis.com/vguard_staging_bucket/apollo/appImages/Campaign/Poster/image%20(4).png",
      
    },
    {id:3,
      name:"Wonder Woman contest",
      details:"Apollo AVC's 'Wonder Woman contest' seeks talented chefs to showcase their culinary skills in an exciting competition. Apply now!",
      start_date:"2024-09-10 18:30:00",
      end_date:"2024-09-25 18:30:00",
      poster_url:"https://storage.googleapis.com/vguard_staging_bucket/apollo/appImages/Campaign/Poster/image%20(5).png",
      
    },
    {id:3,
      name:"Wow - Chef ki khoj 2",
      details:"Apollo AVC's 'Wow - Chef ki khoj 2' seeks talented chefs to showcase their culinary skills in an exciting competition. Apply now!",
      start_date:"2024-09-10 18:30:00",
      end_date:"2024-09-25 18:30:00",
      poster_url:"https://storage.googleapis.com/vguard_staging_bucket/apollo/appImages/Campaign/Poster/image3.png",
      
    },
    {id:3,
      name:"Emerging Turks",
      details:"Apollo AVC's 'Talent Ki Khoj' seeks talented chefs to showcase their culinary skills in an exciting competition. Apply now!",
      start_date:"2024-09-10 18:30:00",
      end_date:"2024-09-25 18:30:00",
      poster_url:"https://storage.googleapis.com/vguard_staging_bucket/apollo/appImages/Campaign/Poster/image%20(6).png",
      
    },
    {id:3,
      name:"JAB FIT TAB HIT",
      details:"Apollo AVC's 'JAB FIT TAB HIT' seeks talented chefs to showcase their culinary skills in an exciting competition. Apply now!",
      start_date:"2024-09-10 18:30:00",
      end_date:"2024-09-25 18:30:00",
      poster_url:"https://storage.googleapis.com/vguard_staging_bucket/apollo/appImages/Campaign/Poster/image%20(7).png",
      
    }
  ]

return res.json(Campaigns)

})

app.post('/api/campaign_detail',async (req,res)=>{

const {campaign_id} = req.body;
const campaign = getCampaignById(campaign_id);

return res.json(campaign)

})

app.get('/api/engagements',async (req,res)=>{
  return res.json(Engagement)
})



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
