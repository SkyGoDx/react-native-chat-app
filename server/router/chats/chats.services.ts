import { Messages, UserChatModel, UserChats } from "../../models/UserChats"

export const findAllChatsById = async (_id: string) => {
    try {
        return await UserChats.find({ login_id: _id});
    } catch (e) {
        throw e;
    }
}

export const findExisting = async (id: string) => {
    try {
        return await UserChats.findById(id);
    } catch(e) {
        throw e;
    }
}

export const insertUserChats = async (payload: UserChatModel) => {
    console.log(payload)
    try {
        const newUserChats = new UserChats(payload);
        return await newUserChats.save();
    } catch (e) {
        throw e;
    }
}
export const updateUserChats = async (_id: string, newMsg: { msg: string, type: string}) => {
    const latestMsg = newMsg.msg; // Extracting the message string
    try {
        const updated = await UserChats.findOneAndUpdate(
            { login_id: _id },
            {
                $push: {
                    userMessages: newMsg // Pushing the entire newMsg object into the array
                },
                latestMsg: latestMsg // Updating the latestMsg field
            },
            { new: true } // To return the updated document
        );

        return updated;
    } catch (e) {
        throw e;
    }
}
