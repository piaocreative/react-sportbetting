import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native'
import IonIcons from 'react-native-vector-icons/Ionicons'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'


export default function Watchlist({info,favourite = false,onshowgraph})
{
    let indexteam = info.teams.indexOf(info.home_team);

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

        list.push(<Text style={[style.headeritem,{borderRightWidth:0}]}>{info.scoreboard.score?info.scoreboard.score.home:0}</Text>)

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

        list.push(<Text style={[style.headeritem,{borderRightWidth:0}]}>{info.scoreboard.score?info.scoreboard.score.away:0}</Text>)

        return list;
    }

    const getquote = () => {
        let list = []
        for(let index = 1;index<=quotecount;index++)
        {
            list.push(<Text style={style.headeritem}>{'Q' + index}</Text>)
        }

        list.push(<Text style={[style.headeritem,{borderRightWidth:0}]}>T</Text>)

        return list;
    }

    
    return (
        <View style={{flexDirection:'row',display:'flex',marginBottom:15}}>
            <View style={{flex:1,borderWidth:3,borderColor:'#C63032',marginLeft:10,borderRadius:8}}> 
                <View style={{marginTop:10,flexDirection:'row'}}>
                    <Text style={[style.item,{textAlign:'center',fontSize:RFValue(12,580),fontWeight:'bold',marginLeft:10,color:'#C63032',flex:1}]}>{info.teams[0]}({indexteam == 0?'home':'away'}) @ {info.teams[1]}({indexteam == 1?'home':'away'})</Text>
                    {
                        info.status == 'in progress' && (
                            <View style={{marginRight:5,marginLeft:5}}>
                                <Text style={[style.item,{fontSize:RFValue(12,580),color:'#C63032'}]}>Time: {info.scoreboard.periodTimeRemaining}({info.scoreboard.currentPeriod}Q)</Text>
                            </View>
                        )
                    }
                </View>
                <View style={[style.sectionitem,{marginTop:15}]}>
                    <View style={{flex:1,marginLeft:15,marginRight:15,marginBottom:5}}>
                        <View>
                            <View style={{display:'flex',flexDirection:'row'}}>
                                <View style={{flex:1}}></View>
                                {getquote()}
                            </View>
                            <View style={{display:'flex',flexDirection:'row'}}>
                                <Text style={{flex:1,fontSize:RFValue(10,580),color:'black',textAlign:'center'}}>{indexteam == 0?'Home':'Away'}</Text>
                                {indexteam == 0?gethomeperiod():getawayperiod()}
                            </View>
                            <View style={{display:'flex',flexDirection:'row'}}>
                                <Text style={{flex:1,fontSize:RFValue(10,580),color:'black',textAlign:'center'}}>{indexteam == 1?'Home':'Away'}</Text>
                                {indexteam == 1?getawayperiod():gethomeperiod()}
                            </View>
                        </View>
                    </View>
                    
                </View>
                <Text style={[style.item,{fontSize:RFValue(14,580),padding:5,backgroundColor:'#C63032',color:'white',textAlign:'left'}]}>Spread</Text>
                <View style={[style.sectionitem,{padding:5,marginTop:5}]}>
                    <View style={{borderRightWidth:1,flex:2,borderRightColor:'#C63032'}}>
                        <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Close: {info.closed_spreads?info.closed_spreads['points'][0]:'-'}</Text>
                        <Text style={style.item}>Close: {info.closed_spreads?info.closed_spreads['points'][1]:'-'}</Text> 
                    </View>
                    <View style={{borderRightWidth:1,flex:2,borderRightColor:'#C63032'}}>
                        <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Live: {info.spreads?info.spreads['points'][0]:'-'}</Text>
                        <Text style={style.item}>Live: {info.spreads?info.spreads['points'][1]:'-'}</Text> 
                    </View>
                    <View style={{flex:3}}>
                        <View style={{display:'flex',flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#C63032',justifyContent:'flex-end',alignItems:'center'}}>
                            <Text style={[style.item,{}]}>{info.spreads?info.spreads['points'][0] - info.closed_spreads['points'][0]:'-'} in Value</Text>
                            {
                                (info.spreads && info.status == 'in progress') && (
                                    <TouchableOpacity style={style.btn_graph} onPress={()=>onshowgraph(info,info.teams[0],'spread')}><Text style={style.btn_text}>Graph</Text></TouchableOpacity>
                                )
                            }
                            
                        </View>
                        <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                            <Text style={[style.item,{}]}>{info.spreads?info.spreads['points'][1] - info.closed_spreads['points'][1]:'-'} in Value</Text>
                            {
                                (info.spreads && info.status == 'in progress') && (
                                    <TouchableOpacity style={style.btn_graph} onPress={()=>onshowgraph(info,info.teams[1],'spread')}><Text style={style.btn_text}>Graph</Text></TouchableOpacity>
                                )
                            }
                            
                        </View>
                    </View>
                </View>
                <Text style={[style.item,{fontSize:RFValue(14,580),padding:5,backgroundColor:'#C63032',color:'white',textAlign:'left'}]}>MoneyLine</Text>
                <View style={[style.sectionitem,{padding:5,marginTop:5}]}>
                    <View style={{borderRightWidth:1,flex:2,borderRightColor:'#C63032'}}>
                        <Text style={[style.item,{borderBottomWidth:1,textAlign:'center',borderBottomColor:'#C63032'}]}>Close: {info.closed_moneyline?info.closed_moneyline[0]:'-'}</Text>
                        <Text style={[style.item,{textAlign:'center'}]}>Close: {info.closed_moneyline?info.closed_moneyline[1]:'-'}</Text> 
                    </View>
                    <View style={{borderRightWidth:1,flex:2,borderRightColor:'#C63032'}}>
                        <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Live: {info.moneyline?info.moneyline[0]:'-'}</Text>
                        <Text style={style.item}>Live: {info.moneyline?info.moneyline[1]:'-'}</Text> 
                    </View>
                    <View style={{flex:3}}>
                        <View style={{display:'flex',flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#C63032',justifyContent:'flex-end',alignItems:'center'}}>
                            <Text style={[style.item,{}]}>{info.moneyline?Math.floor(info.moneyline[0] / info.closed_moneyline[0] * 100)/100:'-'}x in Value</Text>
                            {
                                (info.moneyline && info.status == 'in progress') && (
                                    <TouchableOpacity style={style.btn_graph} onPress={()=>onshowgraph(info,info.teams[0],'moneyline')}><Text style={style.btn_text}>Graph</Text></TouchableOpacity>
                                )   
                            }
                            
                        </View>
                        <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                            <Text style={[style.item,{}]}>{info.moneyline?Math.floor(info.moneyline[1] / info.closed_moneyline[1] * 100)/100:'-'}x in Value</Text>
                            {
                                (info.moneyline && info.status == 'in progress') && (
                                    <TouchableOpacity style={style.btn_graph} onPress={()=>onshowgraph(info,info.teams[1],'moneyline')}><Text style={style.btn_text}>Graph</Text></TouchableOpacity>
                                )
                            }
                            
                        </View>
                    </View>
                </View>
                <Text style={[style.item,{fontSize:RFValue(14,580),padding:5,backgroundColor:'#C63032',color:'white',textAlign:'left'}]}>Total</Text>
                <View style={[style.sectionitem,{padding:5,marginTop:5}]}>
                    <View style={{borderRightWidth:1,borderRightColor:'#C63032',flex:2}}>
                        <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Close: {info.closed_totals?info.closed_totals['points'][0]:'-'}</Text>
                        <Text style={style.item}>Close: {info.closed_totals?info.closed_totals['points'][1]:'-'}</Text> 
                    </View>
                    <View style={{borderRightWidth:1,borderRightColor:'#C63032',flex:2}}>
                        <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Live: {info.totals?info.totals['points'][0]:'-'}</Text>
                        <Text style={style.item}>Live: {info.totals?info.totals['points'][1]:'-'}</Text> 
                    </View>
                    <View style={{flex:3}}>
                        <View style={{display:'flex',flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#C63032',justifyContent:'flex-end',alignItems:'center'}}>
                            <Text style={[style.item,{}]}>{info.totals?info.totals['points'][0] - info.closed_totals['points'][0]:'-'} in Value</Text>
                            {
                                (info.totals && info.status == 'in progress') && (
                                    <TouchableOpacity style={style.btn_graph} onPress={()=>onshowgraph(info,info.teams[0],'total')}><Text style={style.btn_text}>Graph</Text></TouchableOpacity>
                                )
                            }
                        </View>
                        <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                            <Text style={[style.item,{}]}>{info.totals?info.totals['points'][1] - info.closed_totals['points'][1]:'-'} in Value</Text>
                            {
                                (info.totals && info.status == 'in progress') && (
                                    <TouchableOpacity style={style.btn_graph} onPress={()=>onshowgraph(info,info.teams[1],'total')}><Text style={style.btn_text}>Graph</Text></TouchableOpacity>
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
        fontSize:RFValue(8,580),
        color:'white',
        textTransform:'uppercase'
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