import mongoose, { Document, Model, Schema } from "mongoose";

export interface UserChatModel extends Document {
    login_id: string;
    selected_user_id: string;
    username: string;
    name: string;
    lastSeen: Date;
    userMessages: Messages[];
    userImage: string;
    latestMsg: string;
    isSeen: boolean;
}

export interface Messages {
    chat_id: number;
    type: string;
    msg: string;
}

const messageSchema = new Schema({
    chat_id: Number,
    type: String,
    msg: String
});

const UserChatsSchema = new Schema({
    login_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    selected_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    username: String,
    name: String,
    lastSeen: Date,
    userMessages: [messageSchema],
    userImage: String,
    latestMsg: String,
    isSeen: Boolean
});

export const UserChats: Model<UserChatModel> = mongoose.model<UserChatModel>("user_chats", UserChatsSchema);
