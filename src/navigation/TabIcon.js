import React from 'react'
import {View,StyleSheet, Image,Text} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize'
import Entypo from 'react-native-vector-icons/Entypo'

export default function TabIcon({name,enable})
{
    const getcomponent = () => {
        switch(name)
        {
            case 'Home':
                return <FontAwesome name="home" size={RFValue(30,580)} color={enable?"#C63032":"white"}></FontAwesome>
            case 'Pulse':
                return <IonIcons name="pulse" size={RFValue(30,580)} color={enable?"#C63032":"white"}></IonIcons>
            case 'Star':
                return <Entypo name="star" size={RFValue(30,580)} color={enable?"#C63032":"white"}></Entypo>
            default:
                return enable?
                    <Image source={require('../assets/images/activelogo.png')} style={{width:RFValue(20,580),height:RFValue(30,580)}}></Image>
                    :<Image source={require('../assets/images/appicon.png')} style={{width:RFValue(20,580),height:RFValue(30,580)}}></Image>
        }
    }
    return getcomponent()
}

const style = StyleSheet.create({
    textitem:{
        fontSize:RFValue(30,580),
        fontWeight:'bold',
        color:'white'
    }
})