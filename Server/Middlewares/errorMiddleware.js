export const notFound = (req,res,next) =>{
    const error = new Error(`Not Found - ${req.originalLUrl}`);
    res.status(404);
    next(error);
}

export const errorHandler = (error,req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }

    res.status(error.code || 500).json({message:error.message || "An unknow error occured"})
}