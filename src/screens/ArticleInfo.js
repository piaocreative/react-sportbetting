import React from 'react'
import {View,StyleSheet,StatusBar,Text,TouchableOpacity} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import IonIcons from 'react-native-vector-icons/Ionicons'

export default function ArticleInfo({route,navigation})
{
    return (
        <View style={style.container}>
            <StatusBar backgroundColor="#C63032"></StatusBar>
            <View style={style.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <IonIcons name="arrow-back" color="white" size={RFValue(22,580)}></IonIcons>
                </TouchableOpacity>
                <Text style={style.headertxt}>{route.params.info.title}</Text>
                <View style={{width:RFValue(22,580)}}></View>
            </View>
            <View style={{flex:1,padding:25}}>
                <Text style={style.itemtext}>{route.params.info.content}</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    header:{
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:24,
        paddingRight:24,
        backgroundColor:'#C63032',
        justifyContent:'space-between',
        display:'flex',
        flexDirection:'row'
    },
    headertxt:{
        color:'white',
        fontSize:RFValue(18,580),
        textAlign:'center',
        fontFamily:'Copperplate Bold'
    },
    itemtext:{
        fontSize:RFValue(14,580),
        color:'black',
        opacity:0.6
    }
})