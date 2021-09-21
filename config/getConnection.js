
// const getConnectionObject = ()=>{
//     return new Promise(async(resolve,reject)=>{
//         try{
//             let conn= await mongoose.createConnection(dbUrl)
//             conn
//             .on('open',()=>{
//                 resolve(conn);
//                 console.log("Connected to mongodb")
//             })
//             .on('disconnected',()=>{console.log("disconnected with mongo")})
//             .on('error', (err) => {throw (err)});
//         }catch(err){
//             reject(err);
//         }
//     })    
// }

// getConnectionObject().then(resp=>console.log("resp",resp));
// module.exports={
//     getConnectionObject
// }