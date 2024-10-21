const isAdmin = (req,res,next) =>{
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json('Access Declined! Only Admin has this site Access');
    };
};


const User = (req,res,next) =>{
    if(req.user && req.user.role === 'user'){
        next();
    }else{
        res.status(403).json({message : 'Access Declined! Only Users has access to this site'});
    };
};

const subAdmin = ( req,res,next) =>{
    if (req.user && req.user.role === 'subAdmin') {
        next();
    } else {
        res.status(403).json({message:'Access Declined! Only subAdmin has Access to this site'})
    }
}



const specificUser =(req,res,next)=>{
    if(req.user && req.user.role === 'specificUser'){
        next();
    }else{
        res.status(403).json({message:'Access Declined! only specific users has this route access'});
    };
};


const superAdmin = (req,res,next)=>{
    if(req.user && req.user.role === 'superAdmin'){
        next();
    }else{
        res.status(403).json({message:'Access Declined! only super admin has this route access'})
    }
}


module.exports = {User, specificUser, superAdmin,isAdmin,subAdmin};