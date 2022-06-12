import {SET_ALERT} from '../constant'
const initialstate = []

export default function alert(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_ALERT:
            return action.data
        default:
            return state;
    }
}