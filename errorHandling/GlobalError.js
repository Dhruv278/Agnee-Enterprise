

const appError = require("./ErrorFormate");
const HandleValidation = (err) => {
    const errors = Object.values(err.errors).map(el => el.message)
    err.message = `invalid input:${errors.join('. ')}`
    return new appError(err.message, 400)

}
const HandleDuplicateFeild = (err) => {
    str = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
    // console.log(str);
    err.message = `this email id already exist`
    return new appError(err.message, 404)

}

const HandlerForID = (err) => {
    err.message = `invalid ${err.path}:${err.value}`
    return new appError(err.message, 404)
}

const HandleInavalidToken = () => {
    return new appError('pleasecheck the token or enter token properly', 400)
}

const sendErrorPro = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOprational) {
        return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                
            });
        }
      return res.status(err.statusCode).json({
                title: 'somthing went wrong',
                msg: err.message
            })
        }
    


        if (err.isOprational) {
           return res.status(err.statusCode).json({
                title: 'somthing went wrong',
                msg: err.message
            })
        }
        return res.status(err.statusCode).json({
                title: 'somthing went wrong',
                msg: err.message
            })
        
   
}


module.exports = (err, req, res, next) => {

    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;

   
        let error = { ...err };

            error.message=err.message
        if (err.name === 'CastError') error = HandlerForID(error);
        if (err.code === 11000) error = HandleDuplicateFeild(error);
        if (err.name === 'ValidationError') error = HandleValidation(error);
        if (err.name === 'JsonWebTokenError') error = HandleInavalidToken();
 
        sendErrorPro(error, req, res)

    

}