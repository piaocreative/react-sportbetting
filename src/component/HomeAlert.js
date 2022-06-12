import React from 'react'
import {TouchableOpacity,StyleSheet,Text, View,Image} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import moment from 'moment'
import config from '../config/config.json'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {createwatchlist,getwatchlist} from '../service/watchlistservice'
import {setwatchlist} from '../redux/action/watchlist'
import {useSelector,useDispatch} from 'react-redux'

export default function HomeAlert({info,sport,navigation,last})
{
    const dispatch = useDispatch()
    const {token} = useSelector(state=>state.auth)
    const alertdetail = () => {
        createwatchlist(token,info.teams).then(res=>{
            if(res.data.success)
            {
                getwatchlist(token).then(res=>{
                    if(res.data.success)
                    {
                        dispatch(setwatchlist(res.data.data))
                    }
                })
                navigation.navigate('EventDetail',{eventinfo:info,title:sport.title})
            }
        }).catch(err=>console.log(err.response.data))
    }

    return (
        <TouchableOpacity style={[style.container,{borderBottomColor:last?'white':'#333'}]} onPress={()=>alertdetail()}>
            <View style={{display:'flex',flexDirection:'row',marginRight:15,alignItems:'center'}}>
                <Text style={[style.teams,{marginRight:0}]}>{sport.title}</Text>
            </View>
            <Text style={[style.teams,{flex:1}]}>{info.teams[0]} : {info.teams[1]}</Text>
            <Text style={style.teams}>{moment(new Date(info.commence_time * 1000)).format('hh:mm A')}</Text>
        </TouchableOpacity>
    )
}


const style = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'row',
        flex:1,
        alignItems:'center',
        justifyContent:'space-between',
        padding:5,
        borderBottomColor:'#333',
        borderBottomWidth:1
    },
    teams:{
        color:'#333',
        fontSize:RFValue(12,580),
        marginRight:15,
        textAlign:'center'
    }
})