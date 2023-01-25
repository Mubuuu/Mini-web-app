const db=require('../config/connection')
const collection = require('../config/collections')
const bcrypt = require('bcrypt');
const { response } = require('../app');
const objectId = require('mongodb').ObjectId

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve, reject) => {
            let detail=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(!detail){
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(async(data)=>{
              
                    let userr=await db.get().collection(collection.USER_COLLECTION).findOne({_id:data.insertedId})
                      console.log(userr);
                      resolve("success.....")
                  })
            }else{
                console.log('aaaaaaaaa');
                resolve("user already exist")
            }
           
            
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve, reject) => {
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                if(userData.Password===user.Password){
                    console.log('success');
                    response.user=user
                    response.status=true
                    resolve(response)
                }else{
                    console.log('failed');
                    resolve({status:false})
                }
            }else{
                console.log('incorrect');
                resolve({status:false})

            }
        })
    },
    addToCart:(proId,userId)=>{
        return new Promise(async(resolve, reject) => {
            let userCart =await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})

            if (userCart) {
                console.log('hai');
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},
                {
                    
                        $push:{products:objectId(proId)}
                   
                }
                ).then((response)=>{
                    resolve()
                })
            } else {
                console.log('no');
                let cartObj = {
                    user:objectId(userId),
                    products:[objectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve, reject) => {
            
            let cartItems= await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        let:{prodList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$prodList"]
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems[0].cartItems)
        })
    }
}