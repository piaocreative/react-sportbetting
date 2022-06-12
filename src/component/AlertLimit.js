import React from 'react';
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native'
// import {LineChart} from 'react-native-chart-kit'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import {LineChart} from 'react-native-svg-charts'
import {Rect,Line,Text as SvgText} from 'react-native-svg'
export default function AlertLimit({info,gameinfo,navigation,title})
{

    let index = gameinfo.teams.indexOf(info.team)
    
    const getkey = () => {
        if(info.type == 'MONEYLINE')
        {
            return 'moneyline';
        }
        else
        {
            return info.type.toLowerCase() + 's';
        }
    }

    const getright = (index) => {
        if(info.type == 'MONEYLINE')
        {
            return Math.floor(gameinfo.moneyline[index] / gameinfo.closed_moneyline[index] * 100)/100 + 'x in value'
        }
        else
        {
            return gameinfo[getkey()]['points'][index] - gameinfo['closed_' + getkey()]['points'][index] + ' in points'
        }
    }

    const getdata = () => {
        let list = []
        for(let item in gameinfo.history)
        {
            if(gameinfo.history[item][info.type.toLowerCase()])
            {   
                if(info.type == "MONEYLINE")
                {
                    list.push(Number(gameinfo.history[item][info.type.toLowerCase()][index]))
                }
                else
                {
                    list.push(Number(gameinfo.history[item][info.type.toLowerCase()].points[index]))
                }
            }
            
        }

        return list;
    }

    const getminmax = () => {
        let min =0; let max = 0;
        var list = getdata()
        for(let item in list)
        {
            if(Number(list[item]) > max)
            {
                max = list[item]
            }

            if(Number(list[item]) < min)
            {
                min = list[item]
            }
        }

        return {min,max}
    }

    const getkeys = () => {
        var list = []
        for(let item in getdata())
        {
            list.push(Number(item))
        }

        return list;
    }

    const getlabel = () => {
        var list = []

        for(let item in getkey())
        {
            list.push(item + "");
        }

        return list;
    }

    
    const getvalue = (item) => {
        console.log(item)
        console.log('min',getminmax())
        let maxvalue = Math.max(max,info.value)
        if(maxvalue - min > 0)
        {
            return Math.min(150,Math.max(0,150 - (item - min)/(maxvalue-min) * 150));
        }
        else
        {
            return 70;
        }
    }

    const getclosed = () => {
        if(info.type == 'MONEYLINE')
        {
            return gameinfo['closed_' + getkey()][index]
        }
        else
        {
            return gameinfo['closed_' + getkey()]?gameinfo['closed_' + getkey()].points[index]:0
        }
    }

    const LineRect = ({y}) => {
        return (
            <Rect
                stroke={'#C63032'}
                height={149}
                width={wp('80') - 71}
                x={70}
                y={1}
                strokeWidth={1}
            ></Rect>
        )
    }

    const ClosedLine = ({y}) => {
        return (
            <>
                <Line
                     key={'close_axios'}
                     x1={70}
                     x2={'100%'}
                     y1={y(getclosed())}
                     y2={y(getclosed())}
                     stroke={'#C63032'}
                     strokeWidth={ 1 }
                     strokeDasharray={[4,8]}
                ></Line>
                <SvgText
                    dx={0}
                    dy={y(getclosed()) + 5}
                    fill={'#C63032'}
                    stroke={'#C63032'}
                    fontSize={10}
                >
                    Close: {getclosed() >= 0?'+' + getclosed():'-' + getclosed() }
                </SvgText>
            </>
        )
    }

    const LimitLine = ({y}) => {
        return (
            <>
                <Line
                    key={'limit_axios'}
                    x1={70}
                    x2={'100%'}
                    y1={y(info.value)}
                    y2={y(info.value)}
                    stroke={'#C63032'}
                    strokeWidth={ 1 }
                ></Line>
                <SvgText
                    dx={0}
                    dy={y(info.value) + 5}
                    fill={'#C63032'}
                    stroke={'#C63032'}
                    fontSize={10}
                >
                    Limit: {info.value >= 0?'+' + info.value:'-' + info.value }
                </SvgText>
            </>
        )
    }

    const filtertype = () => {
        switch(info.type)
        {
            case 'TOTAL':
                return "Total";
            case 'MONEYLINE':
                return 'MoneyLine';
            default:
                return 'Spread'
        }
    }

    let data = getdata()
    let min = Math.min(...data,getclosed(),info.value)
    let max = Math.max(...data,getclosed(),info.value)
    console.log('gameinfo',gameinfo[getkey()])
    return (
        <>
            <Text style={[style.item,{fontSize:RFValue(14,580),padding:5,backgroundColor:'black',color:'white',textAlign:'left'}]}>MY LIMIT: {info.team}@ {info.value}</Text>
                <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#C63032',padding:5}}>
                    <Text style={[style.item,{fontSize:RFValue(14,580),color:'white',textAlign:'left'}]}>{info.type}</Text>
                    <TouchableOpacity onPress={()=>navigation.navigate('AlertParams',{type:filtertype(),eventinfo:gameinfo,title:title,amount:info.value,team:info.team})}>
                        <Text style={[style.item,{color:'white',fontSize:RFValue(14,580)}]}>EDIT</Text>
                    </TouchableOpacity>
                </View>
                
                {
                    gameinfo[getkey()] && (
                        <>
                        <View style={[style.sectionitem,{padding:5,marginTop:5}]}>
                            <View style={{paddingLeft:5,paddingRight:5,borderRightWidth:1,borderRightColor:'#C63032'}}>
                                <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>{info.type == 'TOTAL'?gameinfo.totals['position'][0]:gameinfo.teams[0]}</Text>
                                <Text style={style.item}>{info.type == 'TOTAL'?gameinfo.totals['position'][1]:gameinfo.teams[1]}</Text> 
                            </View>
                            <View style={{paddingLeft:5,paddingRight:5,borderRightWidth:1,borderRightColor:'#C63032'}}>
                                <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Close: {info.type == 'MONEYLINE'?gameinfo['closed_' + getkey()][0]:gameinfo['closed_' + getkey()]['points'][0]}</Text>
                                <Text style={style.item}>Close: {info.type == 'MONEYLINE'?gameinfo['closed_' + getkey()][1]:gameinfo['closed_' + getkey()]['points'][1]}</Text> 
                            </View>
                            <View style={{paddingLeft:5,paddingRight:5,borderRightWidth:1,borderRightColor:'#C63032'}}>
                                <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>Live: {info.type == 'MONEYLINE'?gameinfo[getkey()][0]:gameinfo[getkey()]['points'][0]}</Text>
                                <Text style={style.item}>Live: {info.type == 'MONEYLINE'?gameinfo[getkey()][1]:gameinfo[getkey()]['points'][1]}</Text> 
                            </View>
                            <View style={{paddingLeft:5,paddingRight:5,borderRightColor:'#C63032'}}>
                                <Text style={[style.item,{borderBottomWidth:1,borderBottomColor:'#C63032'}]}>{getright(0)}</Text>
                                <Text style={style.item}>{getright(1)}</Text> 
                            </View>
                        </View>
                        </>
                    )
                }
                
                <View>
                    <View style={{display:'flex',flexDirection:'row'}}>
                        <View style={{padding:10}}>
                            <LineChart
                                data={getdata()}
                                svg={{stroke:'#C63032'}}
                                yMax={max}
                                yMin={min}
                                style={{
                                    height:160,
                                    width:wp('80')
                                }}
                                contentInset={{top:40,bottom:20,left:80,right:20}}
                            >
                                <LineRect></LineRect>
                                <LimitLine/>
                                <ClosedLine/>
                            </LineChart>
                        </View>
                        
                    </View>
                </View>
        </>
    )
}

const style = StyleSheet.create({
    item:{
        fontSize:RFValue(10,580),
        color:'black',
        textAlign:'center'
    },
    sectionitem:{
        display:'flex',
        flexDirection:'row'
    }
})