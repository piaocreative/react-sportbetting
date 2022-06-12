import {combineReducers} from 'redux'
import auth from './auth'
import watchlist from './watchlist'
import betlist from './betlist'
import alert from './alert'
import favourite from './favourite'
const rootReducer = combineReducers({
    auth:auth,
    betlist:betlist,
    watchlist:watchlist,
    alert:alert,
    favourite:favourite
})

export default rootReducer