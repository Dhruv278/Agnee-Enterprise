class appError extends Error{
    constructor(message,statusCode){
    super(message);
    this.statusCode=statusCode;
    
    // let mess=this.message
    this.status=`${statusCode}`.startsWith('4')?'fail':'error';
    this.isOprational=true;
    Error.captureStackTrace(this,this.constructor)
    }
}

module.exports=appError