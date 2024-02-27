import axios from "axios";
import { Platform } from "react-native";
const API_URL = Platform.OS === 'ios' ? 'http://localhost:4000/api/' : 'http://10.0.2.2:4000/api/';

console.log(API_URL)
async function postRequest(action, body) {
    try {
        const resp = await axios.post(
            `${API_URL}${action}`,
            body
        );
        const data = await resp.data;
        return [null, data];
    } catch (e) {
        console.log(JSON.stringify(e, null, 3))
        return [e]
    }
}
async function putRequest(action, body) {
    try {
        const resp = await axios.put(
            `${API_URL}${action}`,
            body
        );
        const data = await resp.data;
        return [null, data];
    } catch (e) {
        console.log(JSON.stringify(e, null, 3))
        return [e]
    }
}
async function getRequest(action, query) {
    try {
        const resp = await axios.get(
            `${API_URL}${action}?${query}`
        );
        const data = await resp.data;
        return [null, data];
    } catch (e) {
        console.log(JSON.stringify(e, null, 3))
        return [e]
    }
}


export { postRequest, getRequest, putRequest }