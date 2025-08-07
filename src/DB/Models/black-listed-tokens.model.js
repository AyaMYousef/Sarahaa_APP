import mongoose from "mongoose"


const blackListedTokensSchema = new mongoose.Schema({
    tokenId: { type: String, required: true, unique: true },
    expirationDate: { type: Date, required: true }
})


const BlackListedToken = mongoose.model("BlackListedToken", blackListedTokensSchema);
export default BlackListedToken;