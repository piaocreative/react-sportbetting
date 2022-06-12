import React,{useState} from 'react'
import {View,ScrollView,StyleSheet,Text,Image,TouchableOpacity,TouchableWithoutFeedback} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import {RFValue} from 'react-native-responsive-fontsize'
import IonIcons from 'react-native-vector-icons/Ionicons'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Dropdown from 'react-native-dropdown-picker'
import {useDispatch,useSelector} from 'react-redux'
import WatchlistItem from '../component/Watchlistitem'
import Watchlist from '../component/Watchlist'
import Graph from '../component/Graph'
import config from '../config/config.json'

let controller = null
export default function Star({navigation})
{
    const {data,sportlist} = useSelector(state=>state.betlist)
    const alert = useSelector(state=>state.alert)
    const watchlistinfo = useSelector(state=>state.watchlist)
    const [game,setgame] = useState({game:null,team:null,type:null})
    const favourites = useSelector(state=>state.favourite)
    const [active,setactive] = useState('watchlist')
    const [today,settoday] = useState('all')
    const {userinfo} = useSelector(state=>state.auth)
    
    const getsportlist = () => {
        let list = [{label:'All',value:'all'}]
        for(let item in sportlist)
        {
            list.push({label:sportlist[item].title,value:sportlist[item].title})
        }

        return list
    }
    
    const getbettlinglist = () => {
        let list = [];

        for(let item in data)
        {
            if(item == today || today == 'all')
            {
                for(let itemlist in data[item])
                {
                    if(active == 'favourite')
                    {
                        for(let iteminfo in favourites)
                        {
                            if(data[item][itemlist].teams[0] == favourites[iteminfo]['team1'] && data[item][itemlist].teams[1] == favourites[iteminfo]['team2'])
                            {
                                data[item][itemlist].alert = get_alert(data[item][itemlist])
                                data[item][itemlist].title = item
                                list.push(data[item][itemlist])
                                break;
                            }
                        }
                    }
                    else
                    {
                        for(let iteminfo in watchlistinfo)
                        {
                            if(data[item][itemlist].teams[0] == watchlistinfo[iteminfo]['team1'] && data[item][itemlist].teams[1] == watchlistinfo[iteminfo]['team2'])
                            {
                                data[item][itemlist].alert = get_alert(data[item][itemlist])
                                data[item][itemlist].title = item
                                list.push(data[item][itemlist])
                                break;
                            }
                        }
                    }
                }
            }
            
        }

        return list
    }


    const get_alert = (data) => {
        var list = [];
        for(let item in alert)
        {
            if(alert[item].sportsbook == userinfo.sports_book)
            {
                if(alert[item].team1 == data.teams[0] && alert[item].team2 == data.teams[1])
                {
                    if(data.commence_time == alert[item].commencetime)
                    {
                        list.push(alert[item])
                    }    
                }
            }
        }

        return list;
    }

    let datalist = getbettlinglist();

   return (
       <TouchableWithoutFeedback style={{width:wp('100'),height:hp('100'),backgroundColor:'#111111'}} onPress={()=>controller.close()}>
        <View style={{width:wp('100'),height:hp('100'),backgroundColor:'lightgrey'}}>
            <View style={{flexDirection:'row',display:'flex',width:wp('100'),backgroundColor:'#C63032',padding:1}}>
                <TouchableOpacity style={{padding:5,backgroundColor:active != 'watchlist'?'#C63032':'white',flex:1}} onPress={()=>setactive('watchlist')}>
                    <Text style={[style.header,{color:active == 'watchlist'?'#C63032':'white'}]}>WatchList</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{padding:5,backgroundColor:active != 'favourite'?'#C63032':'white',flex:1}} onPress={()=>setactive('favourite')}>
                    <Text style={[style.header,{color:active == 'favourite'?'#C63032':'white'}]}>Favourite</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Dropdown
                    items={getsportlist()}
                    onChangeItem={item=>settoday(item.value)}
                    controller = {ref=>controller = ref}
                    defaultValue={today}
                    containerStyle={{width:120,height:50,flexDirection:'row-reverse'}}
                    style={{justifyContent:'space-between',backgroundColor:'transparent',borderWidth:0,zIndex:1000}}
                    labelStyle={{color:'black',textAlign:'center'}}
                    itemStyle={{flexDirection:'row-reverse',justifyContent:'center'}}
                ></Dropdown>
            </View>
            {
                datalist.length > 0 ? (
                    <View style={{flex:1}}>
                            <ScrollView style={style.container}>
                                <View style={{marginBottom:45,marginBottom:100}} onStartShouldSetResponder={()=>true}>
                                    <View style={{padding:5}}>
                                        {
                                            datalist.map((item,index)=>{
                                                if(item.alert.length > 0){
                                                    return (
                                                        <WatchlistItem info={item} key={index} favourite={active == 'favourite'} navigation={navigation}></WatchlistItem>
                                                    )
                                                }else
                                                {
                                                    return (
                                                        <Watchlist info={item} key={index} onshowgraph={(info,team,type)=>setgame({game:info,team,type})} favourite={active == 'favourite'}></Watchlist>
                                                    )
                                                }

                                            })
                                        }
                                    </View>
                                </View>
                            </ScrollView>
                    </View>
                )
            :(
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:'black',fontSize:RFValue(14,580)}}>There is no game</Text>
                </View>
            )
            }
            
            <Graph info={game.game} isopen={game.game != null} setopen={()=>setgame({game:null,team:null})} team={game.team} type={game.type}></Graph>
        </View>
       </TouchableWithoutFeedback>
   ) 
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    header:{
        fontSize:RFValue(18,580),
        color:'white',
        textAlign:'center'
    },
    sectionitem:{
        display:'flex',
        flexDirection:'row',
        backgroundColor:'white'
    },
    item:{
        fontSize:RFValue(10,580),
        color:'black',
        textAlign:'center'
    },
    favbtn:{
        width:RFValue(30,580),
        height:RFValue(30,580),
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:30,
        borderColor:'#C63032',
        borderWidth:1
    },
    number:{
        fontSize:RFValue(16,580),
        color:'#304031',
        marginRight:5
    },
    headeritem:{
        width:wp('7'),
        textAlign:'center',
        color:'black',
        fontSize:RFValue(12,580),
        borderRightColor:'black',
        borderBottomColor:'black',
        borderBottomWidth:1,
        borderRightWidth:1
    },
    btn_graph:{
        backgroundColor:'#C63032',
        paddingLeft:3,
        paddingRight:3,
        paddingTop:1,
        paddingBottom:1,
        borderRadius:5,
        marginLeft:2,
        marginBottom:1
    },
    btn_text:{
        fontSize:RFValue(10,580),
        color:'white'
    }
})