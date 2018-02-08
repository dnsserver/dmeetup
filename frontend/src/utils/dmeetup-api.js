import axios from 'axios';

const BASE_URL = 'https://denib.com:5000';

export {
    getMessages,
    getRequests,
    sendConnectionRequest,
    getUserInfo,
    searchUsers, 
    doLogin, 
    doRegister
};


function getUserInfo(token){
    const url = '/api/userinfo';
    return axios.request({
        url: url,
        method:'get',
        baseURL: BASE_URL,
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.data);
}

function searchUsers(token, filter){
    const url = `/api/user?filter=${filter}`;
    return axios.request({
        url: url,
        method:'get',
        baseURL: BASE_URL,
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.data);
}       

function doLogin(email, password){
    const url = '/auth/login';
    return axios.request({
        url: url,
        method:'post',
        baseURL: BASE_URL,
        data: {
            email: email,
            password: password
        },
        headers: {
            'Content-Type':'application/json'
        }
    }).then(response => response.data);
}

function doRegister(email, password){
    const url = '/auth/register';
    return axios.request({
        url: url,
        method:'post',
        baseURL: BASE_URL,
        data: {
            email: email,
            password: password
        },
        headers: {
            'Content-Type':'application/json'
        }
    }).then(response => response.data);
}

function sendConnectionRequest(token, receiver, message){
    const url = `/api/connect`;
    return axios.request({
        url: url,
        method:'POST',
        baseURL: BASE_URL,
        data: {
            'receiver':receiver,
            'message': message
        },
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.data);
} 

function getRequests(token){
    const url = '/api/connection_requests';
    return axios.request({
        url: url,
        method:'get',
        baseURL: BASE_URL,
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.data);
} 

function getMessages(token){
    const url = '/api/messages';
    return axios.request({
        url: url,
        method:'get',
        baseURL: BASE_URL,
        headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.data);
}
