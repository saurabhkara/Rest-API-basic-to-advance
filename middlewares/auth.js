import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtService";

const auth = async (req, res, next)=>{
    //Getting Token from header
    let authHeader = req.headers.authorization;
    
    if(!authHeader){
        return next(CustomErrorHandler.unAuthorized());
    }
    
    const token = authHeader.split(' ')[1];
    try {
        //Verify the token and extracting id and role of user
        const {_id, role} = await JwtService.verify(token);
        req.user ={

        }
        req.user._id= _id;
        req.user.role=role;
        next();
        
    } catch (error) {
        return next(CustomErrorHandler.unAuthorized());
    }
}


export default auth;
