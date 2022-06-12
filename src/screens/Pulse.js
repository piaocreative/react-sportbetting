import React,{useState} from 'react';
import {View,ScrollView,StyleSheet,Text,TouchableOpacity,KeyboardAvoidingView,ImageBackground} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import IonIcons from 'react-native-vector-icons/Ionicons'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import PulseItem from '../component/PulseItem'
import {useSelector} from 'react-redux'
import Graph from '../component/Graph'
import Loading from 'react-native-loading-spinner-overlay'

export default function Pulse({navigation})
{
    const {sportlist,data} = useSelector(state=>state.betlist)
    const favourites = useSelector(state=>state.favourite)
    const [game,setgame] = useState({game:null,team:null,type:null})
    const [loading,setloading] = useState(false)
    const filtersportlist = () => {
        let list = [];

        for(let item in sportlist)
        {
            if(getsportlist(sportlist[item].title).length > 0)
            {
                list.push(sportlist[item]);
            }
        }

        return list;
    }

    const getsportlist = (title) => {
        var list = [];
        for(let item in data[title])
        {
            if(data[title][item].status == 'in progress')
            {
                list.push(data[title][item])
            }
        }

        return list;
    }

    const getfavourite = (teams) => {
        for(let item in favourites)
        {
            if(favourites[item]['team1'] == teams[0] && favourites[item]['team2'] == teams[1])
            {
                return true;
            }
        }

        return false;
    }

    let filterlist = filtersportlist()

    return(
        <View style={{flex:1,backgroundColor:'white'}}>
            <View style={style.container}>
                {
                    filterlist.length > 0 ? (
                        <ScrollView behavior="padding" style={{flex:1}}>
                            <View style={{padding:5}}>
                                {
                                    filterlist.map((item)=>(
                                    <>
                                        <View style={{padding:5,backgroundColor:'#C63032'}}>
                                            <Text style={style.title}>{item.title}</Text>
                                        </View>
                                        {
                                            getsportlist(item.title).map((info,index)=>(
                                                <PulseItem info={info} key={index} title={item.title} onshowgraph={(game,team,type)=>setgame({game:game,team,type})} favourite={getfavourite(info.teams)} setloading={setloading}></PulseItem>
                                            ))
                                        }
                                    </>
                                    ))
                                }
                                
                            </View>
                        </ScrollView>
                    ):(
                        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                            <Text style={style.error}>There is no running sports</Text>
                        </View>
                    )
                }
                
                <Loading visible={loading}></Loading>
                <Graph info={game.game} isopen={game.game != null} setopen={()=>setgame({game:null,team:null})} team={game.team} type={game.type}></Graph>
            </View>
            </View>

    )
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    title:{
        color:'white',
        fontSize:RFValue(15,580),
        textAlign:'center',
        fontFamily:'Copperplate Bold'
    },
    section:{
        marginBottom:20,
        borderColor:'#C63032',
        borderWidth:1
    },
    sectionitem:{
        display:'flex',
        flexDirection:'row',
        backgroundColor:'white',
        padding:5,
        borderBottomColor:'#C63032',
        borderBottomWidth:1
    },
    item:{
        fontSize:RFValue(11,580),
        color:'black',
        textAlign:'center'
    },
    favbtn:{
        width:RFValue(30,580),
        height:RFValue(30,580),
        backgroundColor:'#C63032',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:30,
        borderColor:'#C63032',
        borderWidth:1
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
    },
    error:{
        fontSize:RFValue(12,580)
    }
})