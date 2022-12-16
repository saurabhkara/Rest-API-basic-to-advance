import Joi from "joi";
import {RefreshToken, User} from '../models'
import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtService";
import { REFRESH_SECRET } from "../config";
const refreshController ={
     async refresh(req, res, next){

        //Validation 
        const refreshSchema = Joi.object({
            "refresh_token": Joi.string().required()
        })
        const {error} = refreshSchema.validate(req.body);
        if(error){
            return next(error);
        }
        
        //checking refresh token in DB
        try { 
            const refreshToken = await RefreshToken.findOne({token:req.body.refresh_token});
            if(!refreshToken){
                return next(CustomErrorHandler.unAuthorized('Invalid Refresh Token'));
            }

            //verifing refresh token 
            let userId;

            try {
                const {_id} = await JwtService.verify(req.body.refresh_token,REFRESH_SECRET);
                userId = _id;
            } catch (error) {
                return next(CustomErrorHandler.unAuthorized('Invalid Refresh Token'));
            }

            //getting user's data from User Table using id
            const user = User.findOne({_id:userId});
            if(!user){
                return next(CustomErrorHandler.unAuthorized('No User Found'));
            }


            //Token Generation
            const access_token = JwtService.sign({ _id:user._id,role:user.role});
            const refresh_token = JwtService.sign({ _id:user._id,role:user.role},'1y',REFRESH_SECRET);
    
              //DB whitelist
            await RefreshToken.create({token:refresh_token});
            
            res.json({access_token,refresh_token});

        } catch (error) {
            return next(new Error('Something went wrong', error.message));
        }
    }
}

export default refreshController;