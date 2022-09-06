import axios from 'axios';
//ANDROID sesuaikan ip address di pc/laptop
// const apiUrl = 'http://192.168.0.125:3000';
//IOS 
const apiUrl = 'http://localhost:3000';

const ApiGet = async (http) => {
    let options = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
        }
    };
    const request = await axios.get(apiUrl + http, options)
        .then(response => response)
        .catch(error => error);
    return request;
};

const ApiPost = async (http, payload) => {
    let options = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    const req = await axios.post(apiUrl + http, payload, options)
        .then(response => response)
        .catch(error => error.response.data);
    return req;
};


export const ApiPut = (http, payload) => {
    let options = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return axios.put(apiUrl + http, payload, options)
        .then(response => response)
        .catch(error => error.response.data);
};


export const ApiDelete = (http, payload) => {
    let options = {
        'Content-Type': 'application/json'
    };
    return axios.delete(apiUrl + http, { params: payload, headers: options })
        .then(response => response)
        .catch(error => error.response.data);
};

export default {
    ApiGet,
    ApiPost,
    ApiPut,
    ApiDelete
}