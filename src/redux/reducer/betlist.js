const initialstate = {
    success:false,
    data:{
        "NCAAF":[],
        "NFL":[],
        "MLB":[],
        "NBA":[],
        "NCAAB":[],
        "NHL":[]
    },
    sportsbook:[],
    date:new Date(),
    sportlist:[]
}

import {SET_BETLIST, SET_SPORTSBOOK,SET_DATE,SET_SPORTLIST} from '../constant'


export default function betlist(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_BETLIST:
            return {
                ...state,
                success:true,
                data:action.data
            }
        case SET_SPORTSBOOK:
            return {
                ...state,
                sportsbook:action.data
            }
        case SET_DATE:
            return {
                ...state,
                date:action.date
            }
        case SET_SPORTLIST:
            return {
                ...state,
                sportlist:action.data
            }
        default:
            return state;
    }
}