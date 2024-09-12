const exrpess = require('express');
const Engagement = require('../datasource/Engagement');
const dbService = require('../services/dbService');

const   engagmentRouter = exrpess.Router();

engagmentRouter.get('/engagements',async (req,res)=>{


    const result = await dbService.executeQuery('SELECT * FROM public."tblEngagement"')
    if(result){
return result

    }else{

        return res.json(Engagement)

    }
  })


  engagmentRouter.post('/engagement-detail',async (req,res)=>{


    const result = await dbService.executeQuery('SELECT eng.*,col.*,cre.* FROM public."tblEngagement" eng INNER JOIN public."tblEngagementCollateral" col ON eng.engagement_id = col.engagement_id INNER JOIN public."tblCreative" cre ON col.collateral_id = cre.engagement_collateral_id WHERE eng.engagement_id = $1',[])
    return res.json(Engagement)
  })

  module.exports =  engagmentRouter