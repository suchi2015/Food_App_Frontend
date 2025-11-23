const testController=(req,res)=>{
    try{
        res.status(200).send(
    //         {
    //         success:true,
    //         message:'test user data api'
    //    } 
    "<h1> Test user data</h1>"
    )

    }catch(error){

    }
}

module.exports={testController}