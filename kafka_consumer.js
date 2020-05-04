const kafka = require('kafka-node');
const config = require('./config');
const mongoose = require('mongoose');
const orderModel = require('./databaseSchema');
const uri = "mongodb+srv://sellerperformance:sellerpassword@acms-project-wgmfk.mongodb.net/test?retryWrites=true&w=majority";
    async function saveUser(user1){
        try{
           await user1.save();
           console.log(user1);
        }
        catch(err){
           console.log(err);
        }
     
     }
     async function searchFun(search,eventName,gotObj){
         try{
                var newObj=new orderModel();
                switch(eventName){
                    case "created": newObj.orderId=gotObj.orderId;
                                    newObj.orderDate=gotObj.orderDate;
                                    newObj.promisedShipDate=gotObj.promisedShipDate;
                                    newObj.promisedDeliveryDate=gotObj.promisedDeliveryDate;
                                    break;
                    case "shipped": newObj.orderId=gotObj.orderId;
                                    newObj.actualShipDate=gotObj.actualShipDate;
                                    break;
                    case "delivered":newObj.orderId=gotObj.orderId;
                                     newObj.actualDeliveryDate=gotObj.actualDeliveryDate;
                                     break;
                    case "cancelled":newObj.orderId=gotObj.orderId;
                                     newObj.cancelStatus=true;
                                     newObj.cancellationOrigin=gotObj.cancellationOrigin;
                                     break;
                    case "returned":newObj.orderId=gotObj.orderId;
                                    newObj.returnStatus=true;
                                    break;

                }
            const orderInfo=await orderModel.findOne(search);
             if(orderInfo!=null){
                if(orderInfo.sellerId){
                    newObj.sellerId=gotObj.sellerId;
                }
                if(orderInfo.promisedShipDate){
                    newObj.promisedShipDate=orderInfo.promisedShipDate;
                }
                if(orderInfo.promisedDeliveryDate){
                    newObj.promisedDeliveryDate=orderInfo.promisedDeliveryDate
                }
                if(orderInfo.actualShipDate){
                    newObj.actualShipDate=orderInfo.actualShipDate;
                }
                if(orderInfo.actualDeliveryDate){
                    newObj.actualDeliveryDate=orderInfo.actualDeliveryDate;
                }
                if(orderInfo.cancelStatus){
                    newObj.cancelStatus=orderInfo.cancelStatus;
                }
                if(orderInfo.cancellationOrigin){
                    newObj.cancellationOrigin=orderInfo.cancellationOrigin;
                }
                if(orderInfo.returnStatus){
                    newObj.returnStatus=orderInfo.returnStatus;
                }
                var cnt=orderInfo.count;
                newObj.count=cnt+1;
             }
             else{
                 newObj.count=1;
             }
            saveUser(newObj);
            await orderModel.deleteOne(search);

                
    }
    catch(err){
    console.log("error");
    }
}
try {
    const Consumer = kafka.Consumer;
    const client = new kafka.KafkaClient(config.kafka_server);
    let consumer = new Consumer(
        client,
        [{ topic: config.kafka_topic, partition: 0 }],
        {
            autoCommit: true,
            fetchMaxWaitMs: 1000,
            fetchMaxBytes: 1024 * 1024,
            encoding: 'utf8',
            fromOffset: false
        }
    );
    
consumer.on('message', async function (message) {
        console.log('here');
        console.log(JSON.parse(message.value));
        mongoose.connect(uri,{
            useUnifiedTopology: true,
            useNewUrlParser: true, 
        }).then(()=>{
        var gotObj=JSON.parse(message.value);
        const eventName=gotObj.eventType;
        const presentId=gotObj.orderId;
        const toSearch={orderId:presentId};
        searchFun(toSearch,eventName,gotObj);
    })
    .catch(err=>{
        console.log("database not connected");
    });
})
consumer.on('error', function (err) {
        console.log('error', err);
    });


}
catch (e) {
    console.log(e);
}