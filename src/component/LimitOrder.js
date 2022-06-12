import React from 'react'
import {LineChart} from 'react-native-svg-charts'
import {Line,Rect,Text as SvgText} from 'react-native-svg'
import Entypo from 'react-native-vector-icons/Entypo'
import {View,Text,StyleSheet,Image} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'

export default function LimitOrder({alertinfo,sportdata})
{
    let index = sportdata.teams.indexOf(alertinfo.team)
    const HorizontalLine = ({y}) => {
        return (
            <>
                <Line
                    key={'limit_axios'}
                    x1={70}
                    x2={'100%'}
                    y1={y(alertinfo.value)}
                    y2={y(alertinfo.value)}
                    stroke={'#C63032'}
                    strokeWidth={ 1 }
                ></Line>
                <SvgText
                    dx={0}
                    dy={y(alertinfo.value) + 5}
                    fill={'#C63032'}
                    stroke={'#C63032'}
                    fontSize={10}
                >
                    Limit: {alertinfo.value >= 0?'+' + alertinfo.value:'-' + alertinfo.value }
                </SvgText>
            </>
        )
    }

    const CloseLine = ({y}) => {
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

    const RectLine = ({y}) => {
        return (
            <Rect
                stroke={'#C63032'}
                height={199}
                width={wp('80') - 71}
                x={70}
                y={1}
                strokeWidth={1}
            ></Rect>
        )
    }

    const getdata = () => {
        let list = []

        for(let item in sportdata.history)
        {
            if(sportdata.history[item][alertinfo.type.toLowerCase()])
            {
                if(alertinfo.type == "MONEYLINE")
                {
                    list.push(Number(sportdata.history[item][alertinfo.type.toLowerCase()][index]))
                }
                else
                {
                    list.push(Number(sportdata.history[item][alertinfo.type.toLowerCase()].points[index]))
                }
            }
            
        }

        return list
    }

    const getclosed = () => {
        
        if(alertinfo.type == 'MONEYLINE')
        {
            return sportdata.closed_moneyline?sportdata.closed_moneyline[index]:0;
        }
        else
        {
            return sportdata['closed_' + alertinfo.type.toLowerCase() + 's']?sportdata['closed_' + alertinfo.type.toLowerCase() + 's'].points[index]:0
        }
    }
    

    let data = getdata()

    let min = Math.min(...data)
    let max = Math.max(...data)
    min = Math.min(min,getclosed(),alertinfo.value)
    max = Math.max(max,getclosed(),alertinfo.value)
    
    return (
        <View style={style.content}>
            <Image source={require('../assets/images/logo.png')} style={{width:25,height:44}}></Image>
            <View style={{marginLeft:5,flex:1,backgroundColor:'#DDD',padding:5}}>
                <View style={{flexDirection:'row',display:'flex'}}>
                    <View style={{flex:1}}>
                        <Text style={style.paramtext}>Paramaters: </Text>
                        <Text style={style.paramcontent}>
                            Type: {alertinfo.type}
                        </Text>
                        <Text style={style.paramcontent}>
                            Limit: {alertinfo.value}
                        </Text>
                        <Text style={style.paramcontent}>
                            OddLimit: {alertinfo.odd}
                        </Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={style.paramtext}>Live: </Text>
                        <Text style={style.paramcontent}>
                            {sportdata.teams[0]} @ {sportdata.teams[1]}
                        </Text>
                    </View>
                </View>
                <View style={{alignItems:'center',marginTop:5}}>
                    
                    <LineChart
                        svg={{stroke:'#C63032'}}
                        data={data}
                        style={{
                            backgroundColor:'#DDD',
                            height:200,
                            width:wp('80')
                        }}
                        yMax={max}
                        yMin={min}
                        contentInset={{top:40,bottom:20,left:80,right:20}}
                    >
                        <HorizontalLine/>
                        <CloseLine/>
                        <RectLine/>
                        <SvgText dx={80} dy={25} fontSize='15' stroke='#C63032' fill="#C63032" textDecoration="underline">{alertinfo.team} {alertinfo.type.toLowerCase()}:</SvgText>
                    </LineChart>
                </View>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    content:{
        display:'flex',
        flexDirection:'row',
        padding:15
    },
    paramtext:{
        textDecorationColor:'#888',
        color:'#888',
        fontSize:RFValue(13,580),
        textDecorationLine:'underline'
    },
    paramcontent:{
        color:'#888',
        fontSize:RFValue(11,580)
    }
})