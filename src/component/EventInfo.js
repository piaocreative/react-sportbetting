import React from 'react'
import {View,StyleSheet,TouchableOpacity,Text} from 'react-native'
import moment from 'moment'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {RFValue} from 'react-native-responsive-fontsize'
export default function EventInfo({info,onpress})
{
    return (
        <View style={style.team}>
            <Text style={style.cell}>{}
                {moment(new Date(info.commence_time * 1000)).format('hh:mm a')}
            </Text>
            <View style={{flex:1,marginLeft:5,marginRight:5,borderLeftColor:'#C63032',borderLeftWidth:1}}>
                <View style={[style.column,{borderBottomColor:'#C63032',borderBottomWidth:1}]}>
                    <View style={[style.cellitem,{flex:2}]}>
                        <Text style={style.tableheader}>Team</Text>
                    </View>
                    <View style={style.cellitem}>
                        <Text style={style.tableheader}>Spread</Text>
                    </View>
                    <View style={style.cellitem}>
                        <Text style={style.tableheader}>Total</Text>
                    </View>
                    <View style={[style.cellitem,{borderRightWidth:1,borderRightColor:'#C63032'}]}>
                        <Text style={style.tableheader}>Money line</Text>
                    </View>
                </View>
                <View style={style.column}>
                    <View style={[style.cellitem,{flex:2}]}>
                        <Text style={style.cell}>{info.teams[0]}</Text>
                    </View>
                    <View style={style.cellitem}>
                        <Text style={style.cell}>{info.spreads?info.spreads['points'][0]:'-'}</Text>
                    </View>
                    <View style={style.cellitem}>
                        <Text style={style.cell}>{info.totals?info.totals['points'][0]:'-'}</Text>
                    </View>
                    <View style={[style.cellitem,{borderRightWidth:1,borderRightColor:'#C63032'}]}>
                        <Text style={style.cell}>{info.moneyline?info.moneyline[0]:'-'}</Text>
                    </View>
                </View>
                <View style={[style.column,{borderBottomWidth:0}]}>
                    <View style={[style.cellitem,{flex:2}]}>
                        <Text style={style.cell}>{info.teams[1]}</Text>
                    </View>
                    <View style={style.cellitem}>
                        <Text style={style.cell}>{info.spreads?info.spreads['points'][1]:'-'}</Text>
                    </View>
                    <View style={style.cellitem}>
                        <Text style={style.cell}>{info.totals?info.totals['points'][1]:'-'}</Text>
                    </View>
                    <View style={[style.cellitem,{borderRightWidth:1,borderRightColor:'#C63032'}]}>
                        <Text style={style.cell}>{info.moneyline?info.moneyline[1]:'-'}</Text>
                    </View>
                </View>
            </View>
            <View style={{padding:2,zIndex:1100}}>
                <TouchableOpacity onPress={onpress}>
                    <AntDesign color="#C63032" size={RFValue(20,580)} name="rightcircle"></AntDesign>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    team:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:5,
        backgroundColor:'white',
        borderColor:'#C63032',
        borderWidth:1
    },
    cell:{
        fontSize:RFValue(8,580),
        color:'black',
        textAlign:'center'
    },
    title:{
        fontSize:RFValue(16,580),
        color:'#C63032',
        fontWeight:'bold'
    },
    column:{
        display:'flex',
        flexDirection:'row'
    },
    tableheader:{
        fontSize:RFValue(8,580),
        color:'black',
        fontWeight:'bold',
        textTransform:'uppercase'
    },
    cellitem:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})