import React,{useState} from 'react'

import {View,TouchableOpacity,Text,StyleSheet} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import Graph from '../component/Graph'
import IonIcons from 'react-native-vector-icons/Ionicons'
import {setfavourite,getfavourite} from '../service/watchlistservice'
import {setfavourites} from '../redux/action/favourite'
import {useDispatch,useSelector} from 'react-redux'
export default function PulseItem({info,onshowgraph,favourite,setloading,title})
{  
    let quotecount = 4;
    if(title == 'NHL')
    {
        quotecount = 3;
    }
    else if(title == 'MLB')
    {
        quotecount = 9;
    }

    const dispatch = useDispatch()
    const {token} = useSelector(state=>state.auth)
    const getscoreitems = (scoreperiods,keyprefix) => {
        let scorelist = []

        for(let index = 0;index<quotecount;index++)
        {
            if(scoreperiods && scoreperiods[index])
            {
                scorelist.push(<Text style={style.headeritem} key={index + keyprefix}>{scoreperiods[index]}</Text>)
            }
            else
            {
                scorelist.push(<Text style={style.headeritem} key={index + keyprefix}>-</Text>)
            }
        }
        

        return scorelist
    }

    const favouriteinfo = (isfavourite) => {
        console.log(isfavourite)
        setloading(true)
        setfavourite(token,info.teams,isfavourite).then(res=>{
            console.log(res.data)
            
            if(res.data.success)
            {
                getfavourite(token).then(res=>{
                    if(res.data.success)
                    {
                        dispatch(setfavourites(res.data.data))
                        setloading(false)
                    }
                })
            }
            else{
                setloading(false)
            }
        }).catch(err=>setloading(false))
    }

    const getmoneylinevalue = (close,live) => {
        if(close != 0)
        {
            if(live < 0)
            {
                return -Math.floor(close/live * 100)/100;
            }
            else if(live > 0)
            {
                return Math.floor(live / close * 100)/100;
            }
        }
        else
        {
            return 0;
        }
        
    }

    const getquote = () => {
        let list = []
        for(let index = 1;index<=quotecount;index++)
        {
            list.push(<Text style={style.headeritem}>{'Q'+index}</Text>)
        }
        list.push(<Text style={[style.headeritem,{borderRightWidth:0}]}>T</Text>)
        return list
    }

    let index = info.teams.indexOf(info.home_team);
    return (
        <View style={style.section}>
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
           <View style={[style.sectionitem,{borderBottomColor:'#C63032',borderBottomWidth:1}]}>
                <View style={{flex:1,marginLeft:15,marginRight:15}}>
                    <View>
                        <View style={{display:'flex',flexDirection:'row'}}>
                            <View style={{flex:1}}></View>
                            {getquote()}
                        </View>
                        <View style={{display:'flex',flexDirection:'row'}}>
                            <Text style={{flex:1,fontSize:RFValue(10,580),color:'black',textAlign:'center'}}>{index == 0?'Home':'Away'}</Text>
                            {
                                index == 0?getscoreitems(info.scoreboard.score?info.scoreboard.score.homePeriods:[],info.teams[0]):getscoreitems(info.scoreboard.score?info.scoreboard.score.awayPeriods:[],info.teams[0])
                            }
                            <Text style={[style.headeritem,{borderRightWidth:0}]}>{info.scoreboard.score?info.scoreboard.score.away:'0'}</Text>
                        </View>
                        <View style={{display:'flex',flexDirection:'row'}}>
                            <Text style={{flex:1,fontSize:RFValue(10,580),color:'black',textAlign:'center'}}>{index == 1?'Home':'Away'}</Text>
                            {
                                index == 1?getscoreitems(info.scoreboard.score?info.scoreboard.score.awayPeriods:[],info.teams[0]):getscoreitems(info.scoreboard.score?info.scoreboard.score.homePeriods:[],info.teams[1])
                            }
                            <Text style={[style.headeritem,{borderRightWidth:0}]}>{info.scoreboard.score?info.scoreboard.score.home:'0'}</Text>
                        </View>
                    </View>
                </View>
                
                
                <View style={{borderLeftColor:'#C63032',borderLeftWidth:1,justifyContent:'center',padding:5}}>
                    <TouchableOpacity style={[style.favbtn,{backgroundColor:favourite?'white':'#C63032'}]} onPress={()=>favouriteinfo(!favourite)}>
                        <IonIcons name="star" color={favourite?"#C63032":"white"} size={RFValue(20,580)}></IonIcons>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={{padding:5}}>
                <Text style={[style.item,{fontSize :RFValue(12,580),textAlign:'left',backgroundColor:'#C63032',color:'white',padding:2}]}>SPREAD</Text>
                <View style={[style.sectionitem,{padding:5}]}>
                    <View style={{flex:2,borderRightWidth:1,borderRightColor:'#C63032'}}>
                    <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Close: {info.closed_spreads != undefined?info.closed_spreads['points'][0]:'-'}</Text>

                    <Text style={style.item}>Close: {info.closed_spreads != undefined?info.closed_spreads['points'][1]:'-'}</Text> 
                    </View>
                    <View style={{flex:2,borderRightWidth:1,borderRightColor:'#C63032'}}>
                    <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Live: {info.spreads  != undefined?info.spreads['points'][0]:'-'}</Text>
                    <Text style={style.item}>Live: {info.spreads != undefined?info.spreads['points'][1]:'-'}</Text> 
                    </View>
                    <View style={{flex:3}}>
                        <View style={{display:'flex',flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#C63032',alignItems:'center',justifyContent:'flex-end'}}>
                            <Text style={[style.item,{}]}>{info.spreads != undefined?info.spreads['points'][0] - info.closed_spreads['points'][0]:'-'} in Value</Text>
                            {
                                info.spreads && (
                                    <TouchableOpacity style={style.btn_graph}><Text style={style.btn_text} onPress={()=>onshowgraph(info,info.teams[0],'spread')}>Graph</Text></TouchableOpacity>
                                )
                            }
                        </View>
                        <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <Text style={style.item}>{info.spreads != undefined?info.spreads['points'][1] - info.closed_spreads['points'][1]:'-'}  in Value</Text> 
                            {
                                info.spreads && (
                                    <TouchableOpacity style={[style.btn_graph,{marginTop:1}]} onPress={()=>onshowgraph(info,info.teams[1],'spread')}><Text style={style.btn_text}>Graph</Text></TouchableOpacity>
                                )
                            }
                            
                        </View>
                    </View>
                </View>
                <Text style={[style.item,{marginTop:15,fontSize:RFValue(12,580),textAlign:'left',backgroundColor:'#C63032',color:'white',padding:2}]}>MONEYLINE</Text>
                <View style={[style.sectionitem,{padding:5}]}>
                    <View style={{flex:2,borderRightWidth:1,borderRightColor:'#C63032'}}>
                    <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Close: {info.closed_moneyline != undefined?info.closed_moneyline[0]:'-'}</Text>
                    <Text style={[style.item,{textAlign:'center'}]}>Close: {info.closed_moneyline != undefined?info.closed_moneyline[1]:'-'}</Text> 
                    </View>
                    <View style={{flex:2,borderRightWidth:1,borderRightColor:'#C63032'}}>
                    <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Live: {info.moneyline != undefined?info.moneyline[0]:'-'}</Text>
                    <Text style={style.item}>Live: {info.moneyline != undefined?info.moneyline[1]:'-'}</Text> 
                    </View>
                    <View style={{flex:3}}>
                        <View style={{display:'flex',flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#C63032',alignItems:'center',justifyContent:'flex-end'}}>
                            <Text style={[style.item,{}]}>{info.moneyline != undefined?getmoneylinevalue(info.closed_moneyline[0],info.moneyline[0]):'-'}x in Value</Text>
                            {
                                info.moneyline && (
                                    <TouchableOpacity style={style.btn_graph} onPress={()=>onshowgraph(info,info.teams[0],'moneyline')}><Text style={style.btn_text}>Graph</Text></TouchableOpacity>
                                )
                            }
                            
                        </View>
                        <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <Text style={style.item}>{info.moneyline != undefined?getmoneylinevalue(info.closed_moneyline[1],info.moneyline[1]):'-'}x in Value</Text> 
                            {
                                info.moneyline && (
                                    <TouchableOpacity style={[style.btn_graph,{marginTop:1}]} onPress={()=>onshowgraph(info,info.teams[1],'moneyline')}><Text style={style.btn_text}>Graph</Text></TouchableOpacity>
                                )
                            }
                            
                        </View> 
                    </View>
                </View>
                <Text style={[style.item,{marginTop:15,fontSize:RFValue(12,580),textAlign:'left',backgroundColor:'#C63032',color:'white',padding:2}]}>TOTAL</Text>
                <View style={[style.sectionitem,{padding:5,borderBottomWidth:0}]}>
                    <View style={{flex:2,borderRightWidth:1,borderRightColor:'#C63032'}}>
                    <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Close: {info.closed_totals  != undefined?info.closed_totals['points'][0]:'-'}</Text>
                    <Text style={style.item}>Close: {info.closed_totals != undefined?info.closed_totals['points'][1]:'-'}</Text> 
                    </View>
                    <View style={{flex:2,borderRightWidth:1,borderRightColor:'#C63032'}}>
                    <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Live: {info.totals  != undefined?info.totals['points'][0]:'-'}</Text>
                    <Text style={style.item}>Live: {info.totals?info.totals['points'][1]:'-'}</Text> 
                    </View>
                    <View style={{flex:3}}>
                        <View style={{display:'flex',flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#C63032',alignItems:'center',justifyContent:'flex-end'}}>
                            <Text style={[style.item]}>{info.totals?info.totals['points'][0] - info.closed_totals['points'][0]:'-'} in Value</Text>
                            {
                                info.totals && (
                                    <TouchableOpacity style={style.btn_graph} onPress={()=>onshowgraph(info,info.teams[0],'total')}><Text style={style.btn_text}>Graph</Text></TouchableOpacity>
                                )
                            }
                            
                        </View>
                        <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                            <Text style={style.item}>{info.totals?info.totals['points'][1] - info.closed_totals['points'][1]:'-'} in Value</Text> 
                            {
                                info.totals && (
                                    <TouchableOpacity style={[style.btn_graph,{marginTop:1}]} onPress={()=>onshowgraph(info,info.teams[1],'total')}><Text style={style.btn_text}>Graph</Text></TouchableOpacity>
                                )
                            }
                            
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
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
        fontSize:RFValue(10,580),
        color:'black',
        textAlign:'center',
        paddingLeft:2,
        paddingRight:2
    },
    favbtn:{
        width:RFValue(25,580),
        height:RFValue(25,580),
        backgroundColor:'#C63032',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:30,
        borderColor:'#C63032',
        borderWidth:1
    },
    headeritem:{
        flex:1,
        textAlign:'center',
        color:'black',
        fontSize:RFValue(8,580),
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
        fontSize:RFValue(9,580),
        color:'white',
        textTransform:'uppercase'
    }
})