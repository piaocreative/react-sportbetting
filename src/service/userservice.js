import axios from 'axios'
import config from '../config/config.json'
export async function signin(username,password)
{
    return await axios.post(config.apiurl + "api/user/login",{username:username,password:password});
}

export async function getuser(token)
{
    return await axios.get(config.apiurl + "api/user/get",{params:{token}})
}

export async function register(userinfo)
{
    return await axios.post(config.apiurl + "api/user/create",userinfo);
}

export async function social_login(userinfo)
{
    return await axios.post(config.apiurl + "api/user/social_login",userinfo);
}

export async function uploadprofile(profile,token)
{
    var formdata = new FormData();
    formdata.append('token',token);
    formdata.append('profile',profile);

    return await axios.post(config.apiurl + "api/user/upload",formdata);
}

export async function setprofileservice(profileinfo,token)
{
    return await axios.post(config.apiurl + "api/user/setprofile",{token,updateinfo:profileinfo})
}

export async function setnotification(token,notifytoken)
{
    return await axios.post(config.apiurl + "api/user/notification",{token,notification:notifytoken})
}