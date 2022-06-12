import {SET_WATCHLIST} from '../constant'

const initialstate = []

export default function watchlist(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_WATCHLIST:
            return action.data
        default:
            return state
    }
}