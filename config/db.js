const mongoose=require('mongoose')


const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('mongodb connected ')

    }catch(error){
        console.error('error occured', error)
    }
}

module.exports=connectDb