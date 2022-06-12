import {SET_ALERT} from '../constant'

export function setalert(alertlist)
{
    return {type:SET_ALERT,data:alertlist}
}