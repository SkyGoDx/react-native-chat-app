import { createContext, useReducer, useState } from 'react'
import { IS_LOADING, LOGIN_USER, SET_SEARCHED_USER, SET_CHATS, SET_SOCKET, SET_USER, SET_RECIEVED_CHATS } from './actions';
import { getRequest, postRequest, putRequest } from '../useApihook';
import { validateForm } from '../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from "socket.io-client"
import { Platform } from 'react-native';

const SOCKET_URL
    = Platform.OS === 'ios' ?
        'http://localhost:4000/'
        :
        'http://10.0.2.2:4000/';

export const GlobalContext = createContext(null);


const initialState = {
    showLoginView: true,
    user: {
        username: "",
        user_id: "",
        token: ""
    },
    // loading: false,
    socketIo: null,
    userChats: []
}
const myreducer = (state, { type, payload }) => {
    switch (type) {
        case IS_LOADING:
            return { ...state, showLoginView: payload };
        case SET_USER:
            return {
                ...state,
                user: {
                    username: payload.username,
                    token: payload.token,
                    user_id: payload.user_id
                }
            };
        case SET_SOCKET:
            return {...state, socketIo: payload };

        case SET_SEARCHED_USER:
            return {
                ...state,
                selectedUser: payload
            };
        case SET_CHATS:
            return {
                ...state,
                userChats: payload
            };
        case SET_RECIEVED_CHATS:
            return {
                ...state,
                userChats: [
                    ...state.userChats, // Copy existing chats
                    {   // Add the new message to userMessages array
                        ...state.userChats[state.userChats.length - 1], // copy last chat
                        userMessages: [
                            ...(state.userChats[state.userChats.length - 1]?.userMessages || []), // copy existing messages if any
                            payload // add the new message
                        ]
                    }
                ]
            };
    }
}
function Globalstate({ children }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useReducer(myreducer, initialState);

    // socket function
    function connectSocket() {
        const ioo = io(SOCKET_URL);
    
        ioo.on("connection", () => {
            console.log("Socket connected successfully...");
            // Emit connection details after successful connection
            const { username, user_id } = state.user;
            ioo.emit("connection", { username, user_id });
        });
        dispatch({ type: SET_SOCKET, payload: ioo});
        return ioo; 
    };
    // joining users chat
    function joinChat(selectedUser, user_id) {
        const { socketIo } = state;
        console.log("join chat ->", selectedUser)
        return socketIo.emit("joinRoom", { user_id, selectedUser, from: state.user.username})
    }
    // sending private messages
    function sendPrivateMessage(from, touser, user_id, content) {
        const { socketIo } = state;
        console.log("sending private messages to user")
        return socketIo.emit("sendMessage", {
            from,
            touser, 
            user_id,
            content
        });
    }
    // recieving private messages
    function recevePrivateMessage() {
        const { socketIo } = state;
        socketIo.on("newMessage", (content) => {
            console.log("receeved new content...", JSON.stringify(content, null, 2));
            dispatch({
                type: SET_RECIEVED_CHATS,
                payload: { msg: content.msg, type: "received" }
            })
        })
    }
    function setshowLoginView(isTrue) {
        dispatch({ type: IS_LOADING, payload: isTrue })
    }
    // check user session exist 
    async function checkUserSession(navigation, screen) {
        setLoading(true);
        try {
            const user_session = await AsyncStorage.getItem("user_session");
            setLoading(false)
            const parsedUser = JSON.parse(user_session);
            if (parsedUser?.username) {
                dispatch({ type: SET_USER, payload: { ...parsedUser } });
                navigation.navigate("Chat", {
                    username
                })
            } else {
                console.log('user session does not exist');
                return null;
            }
        } catch (e) {
            return false
        }
    };
    // function to fetch existing user
    async function loginUser({ username, password }) {
        const [e1, data] = await postRequest('user/login', { username, password });
        // console.log(e1, data)
        if (e1) return alert(e1);
        if (data?.result >= 1) {
            dispatch({
                type: SET_USER,
                payload: {
                    username,
                    token: data.token,
                    user_id: data._id
                }
            })
            return null;
        } else {
            alert(data.msg);
            dispatch({ type: IS_LOADING, payload: true });
            return null;
        }
    }
    // function to create new user
    async function createUser(username, password) {
        const validationError = validateForm(username, password);
        if (validateForm !== "") return alert(validationError);

        const [e1, data] = await postRequest("user/create", {
            username,
            password
        });
        if (e1) return alert(e1);
        if (data?.result >= 1) {
            alert(data.msg);
            return setshowLoginView(true);
        } else {
            return alert(data?.msg || "Your request failed...");
        }
    };
    async function saveChats(
        isSeen, selected_user_id, newMessage, name
    ) {
        // if(state.userChats.length <= 0) return null;
        console.log("saving data ")
        const [e1, data] = await postRequest("chats/add", {
            ...state.userChats,
            login_id: state.user.user_id,
            latestMsg: newMessage.msg,
            isSeen: isSeen,
            name,
            selected_user_id: selected_user_id,
            userImage: "https://img.freepik.com/free-photo/3d-cartoon-style-character_23-2151034097.jpg?t=st=1708664940~exp=1708668540~hmac=d782110d146ca6125a2dc882857829d7e344b6f88ab19e39c84d71e160694bb2&w=740",
            userMessages : [
                newMessage
            ]
        });
        if(e1) return alert("failed to save chats...");
        if(data.result >= 1) {
            return "success"
        }
    }
    async function updateChats (msg) {
        const [e1, data] = await putRequest(`chats/${state.user.user_id}`, {
            userMessages: {
                msg,
                type: "sent"
            }
        });
        if(e1) return alert(e1);
        return true;
    }
    async function fetchChats() {
        const [e1, data] = await getRequest(`chats/${state?.user.user_id}`);
        if(e1) return alert(e1);
        console.log(data)
        return dispatch({
            type: SET_CHATS,
            payload: data.result === 0 ? [] : data?.userChats
        })
    };
    // console.log(state)
    return <GlobalContext.Provider
        value={{
            ...state,
            username,
            password,
            setUsername,
            setPassword,
            setshowLoginView,
            loginUser,
            createUser,
            checkUserSession,
            loading,
            setLoading,
            connectSocket,
            joinChat,
            sendPrivateMessage,
            recevePrivateMessage,
            saveChats,
            fetchChats,
            updateChats
        }}>
        {children}
    </GlobalContext.Provider>
}

export default Globalstate;