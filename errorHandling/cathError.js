module.exports=fn=>{
    return(req,res,next)=>{ // pela e uper na function ne call karse
        fn(req,res,next).catch(next)
    };// a function ni body e exicute karse means andar nu fn ne exicute karse
}