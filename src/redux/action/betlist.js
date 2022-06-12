import {SET_BETLIST,SET_SPORTSBOOK,SET_DATE,SET_SPORTLIST} from '../constant'

export function setbetlist(data)
{
    return {type:SET_BETLIST,data:data}
}

export function setsportsbook(data)
{
    return {type:SET_SPORTSBOOK,data}
}

export function setdate(date)
{
    return {type:SET_DATE,date}
}

export function setsports(data)
{
    return {type:SET_SPORTLIST,data}
}