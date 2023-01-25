const db=require('../config/connection')
const collection = require('../config/collections');
const { response } = require('../app');
const objectId = require('mongodb').ObjectId
module.exports={
    getAllProducts:(callback)=>{
        return new Promise(async(resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    addProducts:(product,callback)=>{
        console.log(product);
        db.get().collection('product').insertOne(product).then((data)=>{
            console.log(data.insertedId);
            callback(data.insertedId)
        })
    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{
                console.log(response);
                resolve(response)
            }

            )
        })
    },
    
    getProductDetails:(prodId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(prodId)}).then((product)=>{
                
                resolve(product)
            }

            )
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{
                $set:{
                    Item:proDetails.Item,
                    Description:proDetails.Description,
                    Price:proDetails.Prize

                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    getUserDetails:(prodId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(prodId)}).then((user)=>{
                
                resolve(user)
            }

            )
        })
    },
    deleteUser:(prodId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(prodId)}).then((response)=>{
                console.log(response);
                resolve(response)
            }

            )
        })
    },
    
    updateUser:(proId,proDetails)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Email:proDetails.Email,
                    Password:proDetails.Password

                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    getAllUsers:(callback)=>{
        return new Promise(async(resolve, reject) => {
            let userss = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(userss)
        })
    },
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
    }

}