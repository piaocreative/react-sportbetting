import {applyMiddleware,createStore,compose} from 'redux'
import thunkmiddleware from 'redux-thunk'
import {AsyncStorage} from 'react-native';
import {setsportsbook,setsports} from './action/betlist'
import rootReducer from './reducer'
import {getsportsbook,getsports} from '../service/sportservice'

const middleware = []

middleware.push(thunkmiddleware)

export default function configureStore()
{
    const store = createStore(
        rootReducer,
        undefined,
        compose(applyMiddleware(...middleware))
    );
    
    getsportsbook().then(result=>{
        store.dispatch(setsportsbook(result.data))
    }).catch(err=>console.log(err))

    getsports().then(result=>{
        store.dispatch(setsports(result.data))
    }).catch(err=>console.log(err))

    return store;
}