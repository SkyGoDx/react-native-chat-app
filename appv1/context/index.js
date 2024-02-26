import { createContext, useReducer, useState } from 'react'
import { IS_LOADING, LOGIN_USER, LOGOUT_USER, SET_SOCKET, SET_USER } from './actions';
import { postRequest } from '../useApihook';
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
    searchedUser: {}
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
            }
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
    function sendPrivateMessage(from, to, user_id, content) {
        const { socketIo } = state;
        console.log("sending private messages to user")
        return socketIo.emit("sendMessage", {
            from,
            to, 
            user_id,
            content
        });
    }
    // recieving private messages
    function recevePrivateMessage() {
        console.log("recieving messages ->");
        const { socketIo } = state;
        socketIo.on("newMessage", (content) => {
            console.log("receeved new content...", content);
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
    }
    console.log(state.searchedUser)
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
            dispatch
        }}>
        {children}
    </GlobalContext.Provider>
}

export default Globalstate;