import {SET_USERDATA,LOGOUT, SET_PROFILE,SET_PROFILEINFO} from '../constant'

const initialstate = {
    token:null,
    userinfo:{}
}

export default function auth(state = initialstate,action){
    switch(action.type)
    {
        case SET_USERDATA:
            return {
                ...state,
                token:action.token,
                userinfo:action.userinfo
            }
        case SET_PROFILE:
            return {
                ...state,
                userinfo:{
                    ...state.userinfo,
                    profile:action.uri
                }
            }

        case SET_PROFILEINFO:
            return {
                ...state,
                userinfo:{
                    ...state.userinfo,
                    ...action.profile
                }
            }
        
        case LOGOUT:
            return initialstate;
        default:
            return state;
    }
}