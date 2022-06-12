import React from 'react'
import {View,StyleSheet,TouchableOpacity} from 'react-native'
import TabIcon from './TabIcon'
export default function TabBar({navigation,state})
{
    const {index,routes} = state;
    const isactive = (routename) => {
        let enable = false;
        routes.map((routeitem,routeindex)=>{
            if(routeitem.name == routename && routeindex == index)
            {
                enable = true;
            }
        })

        return enable;
    }
    return (
        <View style={style.container}>
            <TouchableOpacity style={isactive('Home')?style.tabactive:style.tabitem} onPress={()=>navigation.navigate('Home')}>
                <TabIcon name="Home" enable={isactive('Home')}></TabIcon>
            </TouchableOpacity>
            <TouchableOpacity style={isactive('Pulse')?style.tabactive:style.tabitem} onPress={()=>navigation.navigate('Pulse')}>
                <TabIcon name="Pulse" enable={isactive('Pulse')}></TabIcon>
            </TouchableOpacity>
            <TouchableOpacity style={isactive('Star')?style.tabactive:style.tabitem} onPress={()=>navigation.navigate('Star')}>
                <TabIcon name="Star" enable={isactive('Star')}></TabIcon>
            </TouchableOpacity>
            <TouchableOpacity style={isactive('Alert')?[style.tabactive,{borderRightWidth:0}]:[style.tabitem,{borderRightWidth:0}]} onPress={()=>navigation.navigate('Alert')}>
                <TabIcon name="Me" enable={isactive('Alert')}></TabIcon>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flexDirection:'row'
    },
    tabitem:{
        backgroundColor:'#C63032',
        padding:15,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderRightColor:'white',
        borderRightWidth:1,
        borderTopColor:'#C63032',
        borderTopWidth:1
    },
    tabactive:{
        backgroundColor:'white',
        padding:15,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderRightColor:'white',
        borderRightWidth:1,
        borderTopColor:'#C63032',
        borderTopWidth:1
    }
})