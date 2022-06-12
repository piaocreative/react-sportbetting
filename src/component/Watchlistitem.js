import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native'
import IonIcons from 'react-native-vector-icons/Ionicons'
import {LineChart} from 'react-native-chart-kit'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import AlertLimit from '../component/AlertLimit'

export default function WatchlistItem({info,favourite = false,navigation})
{
    let index = info.teams.indexOf(info.home_team);
    let quotecount = 4;
    
    if(info.title == 'NHL')
    {
        quotecount = 3;
    }
    else if(info.title == 'MLB')
    {
        quotecount = 9;
    }

    const gethomeperiod = () => {
        let list = [];
        for(let index = 1;index<=quotecount;index++)
        {
            if(info.scoreboard.score && info.scoreboard.score.homePeriods[index - 1])
            {
                list.push(<Text style={style.headeritem}>{info.scoreboard.score.homePeriods[index - 1]}</Text>)
            }
            else
            {
                list.push(<Text style={style.headeritem}>-</Text>)
            }
        }

        list.push(<Text style={[style.headeritem,{borderRightWidth:0}]}>{info.scoreboard.score?info.scoreboard.score.home:'0'}</Text>)

        return list;
    }

    const getawayperiod = () => {
        let list = [];
        for(let index = 1;index<=quotecount;index++)
        {
            if(info.scoreboard.score && info.scoreboard.score.awayPeriods[index - 1])
            {
                list.push(<Text style={style.headeritem}>{info.scoreboard.score.awayPeriods[index - 1]}</Text>)
            }
            else
            {
                list.push(<Text style={style.headeritem}>-</Text>)
            }
        }

        list.push(<Text style={[style.headeritem,{borderRightWidth:0}]}>{info.scoreboard.score?info.scoreboard.score.away:'0'}</Text>)

        return list;
    }

    const getquote = () => {
        let list = []
        for(let index = 1;index<=quotecount;index++)
        {
            list.push(<Text style={style.headeritem}>{'Q' + index}</Text>)
        }
        list.push(<Text style={[style.headeritem,{borderRightWidth:0}]}>T</Text>)
        return list
    }

    return (
        <View style={{flexDirection:'row',display:'flex',marginBottom:15}}>
            <View style={{flex:1,borderWidth:3,borderColor:'#C63032',marginLeft:10,borderRadius:8}}>
                <View style={{marginTop:10,flexDirection:'row'}}>
                    <Text style={[style.item,{textAlign:'center',fontSize:RFValue(12,580),fontWeight:'bold',marginLeft:10,color:'#C63032',flex:1}]}>{info.teams[0]}({index == 0?'home':'away'}) @ {info.teams[1]}({index == 1?'home':'away'})</Text>
                    {
                        info.status == 'in progress' && (
                            <View style={{marginRight:5,marginLeft:5}}>
                                <Text style={[style.item,{fontSize:RFValue(12,580),color:'#C63032'}]}>Time: {info.scoreboard.periodTimeRemaining}({info.scoreboard.currentPeriod}Q)</Text>
                            </View>
                        )
                    }
                </View>
                <View style={[style.sectionitem,{marginTop:15}]}>
                    <View style={{marginLeft:15,marginRight:15,flex:1,marginBottom:5}}>
                        <View>
                            <View style={{display:'flex',flexDirection:'row'}}>
                                <View style={{flex:1}}></View>
                                {getquote()}
                            </View>
                            <View style={{display:'flex',flexDirection:'row'}}>
                                <Text style={{flex:1,fontSize:RFValue(10,580),color:'black',textAlign:'center'}}>{index == 0?'Home':'Away'}</Text>
                                {gethomeperiod()}
                            </View>
                            <View style={{display:'flex',flexDirection:'row'}}>
                                <Text style={{flex:1,fontSize:RFValue(10,580),color:'black',textAlign:'center'}}>{index == 1?'Home':'Away'}</Text>
                                {getawayperiod()}
                            </View>
                        </View>
                    </View>
                    
                </View>
                {
                    info.alert.map((item)=>(
                        <AlertLimit info={item} gameinfo={info} navigation={navigation} title={info.title}></AlertLimit>
                    ))
                }
                
                
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    headeritem:{
        width:wp('6'),
        textAlign:'center',
        color:'black',
        fontSize:RFValue(10,580),
        borderRightColor:'black',
        borderBottomColor:'black',
        borderBottomWidth:1,
        borderRightWidth:1,
        flex:1
    },
    item:{
        fontSize:RFValue(10,580),
        color:'black',
        textAlign:'center'
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
    sectionitem:{
        display:'flex',
        flexDirection:'row'
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
    }
})