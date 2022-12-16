import Joi from 'joi';
import CustomErrorHandler from '../services/CustomErrorHandler';
import {RefreshToken, User} from '../models'
import bcrypt from 'bcrypt';
import JwtService from '../services/JwtService';
import { REFRESH_SECRET } from '../config';

const registerController = {

     async register(req, res, next){
        

        //user validation 
        const registerSchema = Joi.object({
            name : Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeatpassword : Joi.ref('password')
        })

        const {error} = registerSchema.validate(req.body);
        if(error){
            return next(error);
        }


        // check user already exist in database
        try {
          const alreadyExist = await User.exists({ email: req.body.email });
          if (alreadyExist) {
            return next(CustomErrorHandler.alreadyExist("User already Exist"));
          }
        } catch (err) {
            //to catch error from db if error occurred 
           return next(err);
        }

        
        const { name, email, password } = req.body;
        //Hash Password
        const hashedPassword = await bcrypt.hash(password,10);


        //prepare model
        
        const user = new User({
          name,
          email,
          password: hashedPassword
        })
        let access_token;
        let refresh_token;
        try {
          const result = await user.save();


          //token creation
          access_token =JwtService.sign({ _id : result._id, role:result.role});
          refresh_token =JwtService.sign({ _id : result._id, role:result.role},'1y',REFRESH_SECRET);
          

          //DB whitelist
          await RefreshToken.create({token:refresh_token});

        } catch (err) {
          return next(err);
        }

        res.json({access_token:access_token, refresh_token:refresh_token});
        
    }

}

export default registerController;