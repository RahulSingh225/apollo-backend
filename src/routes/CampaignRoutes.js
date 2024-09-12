const express  = require('express');
const campaignMaster = require('../datasource/campaignMaster');
const dbService = require('../services/dbService');
const campaignRoute = express.Router()

function getCampaignById(id) {
    return Campaigns.find(campaign => campaign.id === id);
  }
campaignRoute.get('/campaigns',async (req,res)=>{

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
  const result = await dbService.executeQuery('SELECT * FROM public."tblCampaign"')
  if(result.length){
    return res.json(result)
  }else{
    return res.json(campaignMaster)

  }
  
  })

  
  campaignRoute.post('/campaign_detail',async (req,res)=>{

    const {campaign_id} = req.body;
    const campaign = getCampaignById(campaign_id);
    const result = await dbService.executeQuery('SELECT cam.*,col.*,cre.* FROM public."tblCampaign" cam INNER JOIN public."tblCampaignCollateral" col ON cam.campaign_id = col.campaign_id INNER JOIN public."tblCreative" cre ON col.collateral_id = cre.campaign_collateral_id WHERE cam.campaign_id = $1',[campaign_id]);
    if(result.length){
        return res.json(result)
    }else{

        return res.json(campaign)

    }
    
    })

    module.exports = campaignRoute