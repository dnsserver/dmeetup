import axios from 'axios';

const BASE_URL = 'https://denib.com:5000';

export {getUserInfo, doLogin, doRegister};


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

