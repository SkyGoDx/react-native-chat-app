import mongoose, { Date, Model } from "mongoose";

interface UserChatModel extends Document {
    username: String;
    name: String;
    lastSeen: Date,
    userMessages: Array<Messages>
    userImage: String
}

interface Messages {
    chat_id: Number;
    type: String;
    msg: String
}
const UserChatsSchema = new mongoose.Schema({
    username: {
        type: String
    },
    name: {
        type: String
    },
    lastSeen: {
        type: String
    },
    userMessages: {
        type: Array,
    },
    userImage: {
        type: String
    }
})
export const UserChats: Model<UserChatModel> = mongoose.model<UserChatModel>("user_chats", UserChatsSchema)