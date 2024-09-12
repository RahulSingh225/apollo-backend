const express = require('express');
const dbService = require('../services/dbService');


const activityRouter = express.Router()


activityRouter.get('/activities',async (res,req)=>{
    try{
        const result = await dbService.executeQuery('SELECT activity_id, activity_type, start_date, end_date, activity_poster_uuid, activity_booklet_uuid, activity_collateral_qty, created_at, updated_at FROM public."tblActivity"')

        return res.json(result)

    }catch(err){

        return res.json({message:'Internal Server Error'})
    }

})


activityRouter.post('/activity-details',async (res,req)=>{
    const {activiy_id} = req.body
    try{
        const result = await dbService.executeQuery('SELECT cam.*,col.*,cre.* FROM public."tblActivity" cam INNER JOIN public."tblActivityCollateral" col ON cam.activity_id = col.activity_id INNER JOIN public."tblCreative" cre ON col.collateral_id = cre.activity_collateral_id WHERE cam.activity_id = $1',[activiy_id])

        return res.json(result)

    }catch(err){

        return res.json({message:'Internal Server Error'})
    }

})


module.exports = activityRouter