import {SET_USERDATA,LOGOUT,SET_PROFILE,SET_PROFILEINFO} from '../constant'

export function setuserdata(token,userinfo)
{
    return {type:SET_USERDATA,token:token,userinfo:userinfo}
}

export function setprofile(uri)
{
    return {type:SET_PROFILE,uri};
}

export function setprofileinfo(profile)
{
    return {type:SET_PROFILEINFO,profile:profile}
}

export function logout()
{
    return {type:LOGOUT}
}

