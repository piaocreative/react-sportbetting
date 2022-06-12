import {SET_FAVOURITE} from '../constant'

const initialstate = []

export default function favourite(state = initialstate,action)
{
    switch(action.type)
    {
        case SET_FAVOURITE:
            return action.data;
        default:
            return state;
    }
}