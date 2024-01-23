const ErrorFormate=require('./ErrorFormate');


module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || 'Internal Server Error ';
    // console.log(err)
    if(process.env.TYPE==='DEVELOPMENT'){
        // console.log("worrrrrrrrrrrrrrrrrrrrk")
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errMessage:err.message,
            stack:err.stack
        })
    }

    if(process.env.TYPE==='PRODUCTION'){
        let error={...err}
        

        error.message=err.message;

        // console.log("working++++++++++")
        // wrong mongose Object Id error
        if(err.name=='CastError'){
            const message=`Resource not found. Invalid :${err.path}`
            error=new ErrorFormate(message,400);
        }

     
        // Handling Mongoose VAlidation error 
        if(err.name=='ValidationError'){
            // console.log(err.erro)
            const message=Object.values(err.errors).map(value=>value.message);
            error=new ErrorFormate(message,400)
            
        }

        // Handling Mongoose duplicate key Error
        if(err.code===11000){
            
            const message=`Duplicate ${Object.keys(err.keyValue)} entered`
            error=new ErrorFormate(message,400)
        }

        // Wrong JWT
        if(err.name==='JsonWebTokenError'){
            const message='JSON Web Token is invalid. Try Again!!!'
            error=new ErrorFormate(message,400)
        }

        // Expire Token
        if(err.name=='TokenExpiredError'){
            const message='JSON Web Token is expired. Try Again!!!'
            error=new ErrorFormate(message,400)

        }

        res.status(error.statusCode).json({
            success:false,
            message:error.message||'Internal Server Error'
        })


    }

}