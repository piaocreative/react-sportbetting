import {SET_WATCHLIST} from '../constant'

export function setwatchlist(watchlist)
{
    return {type:SET_WATCHLIST,data:watchlist}
}