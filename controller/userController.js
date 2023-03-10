import { User } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";

const userController = {
  async me(req, res, next) {

    try {
      //Getting user detail from DB
      const user = await User.findOne({ _id: req.user._id }).select('-password -updatedAt -__v');
      if(!user){
        return next(CustomErrorHandler.notFound());
      }
      return res.json(user);
    } catch (err) {
        return next(err);
    }
  },
};

export default userController;
