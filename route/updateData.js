const express = require('express')
const router = express.Router()
const {asyncWrapper,getTableItems, updateItemsInBatches} = require('../middleware/index')
const data = require('../dynamoData.json')
const fs = require('fs');

// router.post('/', asyncWrapper(async(req,res)=> {
//     try{
//         const {name, webpage} = req.body; 


//         const iswebPagePresent = await checkDb(name); 

//         if(iswebPagePresent && "name" in iswebPagePresent){
//             return res.status(409).json({ok:false})
//         } 

//         await saveData(name,webpage).then(()=> {
//         res.status(200).json({
//                 ok:true
//         })
//         })
        


//     }catch(error){
//         console.log(error.message);
//         res.status(500).json({
//             error:error.message
//         })
//     }
// }))

router.get('/', asyncWrapper(async(req,res)=> {
    try{
        await updateItemsInBatches(data.slice(320,340))
        res.status(200).json(true);
    }catch(error){
        console.log(error.message);
        res.status(500).json(error.message)
    }
}))


module.exports = router
