const express = require('express')
const router = express.Router()
const {asyncWrapper, saveData, checkDb} = require('../middleware/index')

router.post('/', asyncWrapper(async(req,res)=> {
    try{
        const {webpage,name,isSubscription} = req.body; 

        const iswebPagePresent = await checkDb(name); 

        if(iswebPagePresent && "name" in iswebPagePresent){
            return res.status(409).json({ok:false})
        } 

        await saveData(name,webpage,isSubscription).then(()=> {
        res.status(200).json({
                ok:true
        })
        })

    }catch(error){
        console.log(error.message);
        res.status(500).json({
            error:error.message
        })
    }
}))

module.exports = router
