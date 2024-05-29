import docClient from "../config";
require('dotenv').config(); 

const tableName = process.env.TABLE_NAME

const asyncWrapper = fn => (req,res,next) => {
    return Promise.resolve(fn(req,res,next)).catch(next); 
}

// save to dynamodb
const saveData = async (name,webpage,isSubscription) => {

    const params = {
        TableName:tableName,
        Item:{
            name:name,
            webpage:webpage,
            isSubscription:Boolean(isSubscription),
            dateRegistered: new Date().toISOString()
        }

    }

   Promise.resolve(docClient.put(params).promise()).then(()=> {
    console.log("saved to dynamodb"); 
   })

}

// checks dynamodb for website name
const checkDb = async (name) => {
    
    const params = {
        TableName:tableName,
        Key:{
            name:name,
        }

    }

    // TODO: paginate 
    const data = await docClient.get(params).promise()
    // once number of data reaches specified limit 
    // proceed to 

    return data.Item
}

let scannedData=[]
let params = {
    TableName:'website',
    LastEvaluatedKey:null
}
// get items
const getTableItems = async()=> {

        try{

           await docClient.scan(params).promise().then(async(data)=> {
                scannedData = scannedData.concat(data.Items);

                if(data.LastEvaluatedKey && scannedData.length < 337){
                        params.ExclusiveStartKey = data.LastEvaluatedKey
                        await getTableItems(params)
                }
            })

            return scannedData
            
        }catch(error){
            console.log(error)
        }
        
}


const updateItemsInBatches = async(items)=> {

   let transactItmes = []

    for(const item of items) {

            transactItmes = [
                ...transactItmes,
                {
                    Update:{
                            TableName:'website',
                            Key:{
                                name:item.name
                            },
                            UpdateExpression: 'SET #attrName = :attrValue',
                            ExpressionAttributeValues:{
                                ":attrValue":new Date().toISOString()
                            },
                            ExpressionAttributeNames:{
                                "#attrName":"dateRegistered"
                            },
                            ReturnValues:'ALL_NEW'
    
                    }
                }
            ]

    }

    if(transactItmes.length){
        const params = {
            TransactItems:[...transactItmes]
        }

        await docClient.transactWrite(params).promise()
    }

}


module.exports = {
    asyncWrapper,
    saveData,
    checkDb, 
    getTableItems,
    updateItemsInBatches
}