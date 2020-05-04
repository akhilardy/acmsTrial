const mongoose=require('mongoose');
//creating the schema
const nameSchema=new mongoose.Schema({
   type:{
      type:Number,
      required:true
   },
   rollno:{
      type:String,
      required:true
   },
   firstName:{
      type:String,
      required:true
   },
   lastName:{
      type:String
   },
   address:{
      type:String

   },
   phoneNumber:{
      type:Number
   }
},{timestamps:true});
// class User{
//    static getUserById(id){
//       return this.findOne({
//          _id:mongoose.mongo.ObjectID(id)
//       }).exec();
//    }
//    //get all the users having the same firstName
//    static getAllName(firstName){
//       return this.find({firstName
         
//       }).exec();
//    }
//    static insert(obj){
//       return obj.save();

//    }

// }
// nameSchema.loadClass(User);
module.exports=mongoose.model('User',nameSchema)