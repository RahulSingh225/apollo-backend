const express  = require('express');
const campaignMaster = require('../datasource/campaignMaster');
const dbService = require('../services/dbService');
const campaignRoute = express.Router()
const {FILE_URL} =require('../services/Constants')
const {COLLATERAL_URL} = require('../services/Constants')

function getCampaignById(id) {
    return Campaigns.find(campaign => campaign.id === id);
  }
campaignRoute.get('/campaigns',async (req,res)=>{

    var data = [
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
var data = [];
    result.map(r=>{
      data.push({campaign_id:r.campaign_id,poster_url:`${FILE_URL}${r.campaign_poster_uuid}`})
    })
    return res.json(data)
  }else{
    return res.json(campaignMaster)

  }
  
  })

  
  campaignRoute.post('/campaign_detail',async (req,res)=>{

    const {campaign_id} = req.body;
    const campaign = getCampaignById(campaign_id);
    const result = await dbService.executeQuery('SELECT cam.*,col.*,cre.* FROM public."tblCampaign" cam INNER JOIN public."tblCampaignCollateral" col ON cam.campaign_id = col.campaign_id INNER JOIN public."tblCreative" cre ON col.collateral_id = cre.campaign_collateral_id WHERE cam.campaign_id = $1',[campaign_id]);

  
    if(result.length){
      var campaginDetail = 

      {id:1,
        name:result[0].name,
        details:result[0].details,
        start_date:result[0].start_date,
        end_date:result[0].end_date,
        poster_url:FILE_URL+result[0].campaign_poster_uuid,
        collaterals:[]
  
      
    }


    const data = {};

    // Iterate over the data array
    result.forEach(item => {
        const { collateral_name, creative_uuid } = item;
        
        // Construct the URL for creative_uuid
        const imageUrl = `${COLLATERAL_URL}${creative_uuid}`;
        
        // If the collateral_name does not exist, initialize it with an array
        if (!data[collateral_name]) {
          data[collateral_name] = [];
        }
        
        // Push the imageUrl to the collateral_name array
        data[collateral_name].push(imageUrl);
    });
    
    // Convert the result object into an array of objects with the desired structure
    const finalResult = Object.keys(data).map(key => ({ [key]: data[key] }));
    
    console.log(finalResult);

    campaginDetail.collaterals=finalResult;
      
        return res.json(campaginDetail)
    }else{

        return res.json(campaign)

    }
    
    })

    module.exports = campaignRoute