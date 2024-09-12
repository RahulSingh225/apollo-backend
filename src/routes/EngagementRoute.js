const exrpess = require('express');
const Engagement = require('../datasource/Engagement');
const dbService = require('../services/dbService');

const   engagmentRouter = exrpess.Router();

engagmentRouter.get('/engagements',async (req,res)=>{


    const result = await dbService.executeQuery('SELECT * FROM public."tblEngagement"')
    console.log(result)
    if(result.length){
      
return res.json(result)

    }else{

        return res.json(Engagement)

    }
  })


  engagmentRouter.post('/engagement-detail',async (req,res)=>{

    const {engagement_id} = req.body
    const result = await dbService.executeQuery('SELECT eng.*,col.*,cre.* FROM public."tblEngagement" eng INNER JOIN public."tblEngagementCollateral" col ON eng.engagement_id = col.engagement_id INNER JOIN public."tblCreative" cre ON col.collateral_id = cre.engagement_collateral_id WHERE eng.engagement_id = $1',[engagement_id])
    console.log(result)
    return res.json(result)
  })

  module.exports =  engagmentRouter