import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required : true},
    price: {type:Number,required:true},
    size: { type:String, required:true},
    image:{type:String, required:true},
}, {timestamps:true});

export default mongoose.model('Product',productSchema,'products');