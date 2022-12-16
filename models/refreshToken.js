import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, unique : true},
});

export default mongoose.model('RefreshToken',refreshTokenSchema,'refreshTokens');