import React from 'react'
import {View,StyleSheet,TouchableOpacity,Text,ScrollView} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'

export default function About({navigation})
{
    return (
        <View style={{width:wp('100'),height:hp('100')}}>
            <View style={style.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <AntDesign name="arrowleft" color="white" size={RFValue(25,580)}></AntDesign>
                </TouchableOpacity>
                <Text style={style.headertext}>About</Text>
                <TouchableOpacity style={{width:RFValue(25,580)}}></TouchableOpacity>
            </View>
            <ScrollView style={style.container}>
                <View>
                    <Text></Text>
                </View>
                
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    header:{ 
        backgroundColor:'#C63032',
        padding:5,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    headertext:{
        color:'white',
        textAlign:'center',
        fontSize:RFValue(18,580),
        fontFamily:'Copperplate Bold'
    },
    itemheader:{
        fontSize:RFValue(16,580),
        color:'#C63032'
    },
    iteminfo:{
        fontSize:RFValue(14,580),
        color:'black'
    }
})