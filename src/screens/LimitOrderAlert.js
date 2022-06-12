import React from 'react'
import {View,StyleSheet,ScrollView,Text,TouchableOpacity} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {useSelector} from 'react-redux'
import LimitAlert from '../component/LimitOrder'

export default function LimitOrderAlert({navigation})
{
    const {data} = useSelector(state=>state.betlist)
    const alert = useSelector(state=>state.alert)
    const {userinfo} = useSelector(state=>state.auth)

    const getsportlist = () => {
        var list = []
        for(let item in alert)
        {
            if(alert[item].sportsbook == userinfo.sports_book)
            {
                for(let itemdata in data)
                {
                    let enable = false;
                    for(let iteminfo in data[itemdata])
                    {
                        if(alert[item].team1 == data[itemdata][iteminfo].teams[0] && alert[item].team2 == data[itemdata][iteminfo].teams[1] && alert[item].commencetime == data[itemdata][iteminfo].commence_time)
                        {
                            list.push({alert:alert[item],data:data[itemdata][iteminfo]})
                            enable = true;
                            break;
                        }
                    }

                    if(enable)
                    {
                        break;
                    }
                    
                }
            }
            
        }

        return list;
    }
    
    let sportlist = getsportlist()
    return (
        <View source={require('../assets/images/bg.png')} style={{width:wp('100'),height:hp('100')}}>
            <View style={style.container}>
                <View style={style.header}>
                    <TouchableOpacity style={{backgroundColor:'white',width:wp('8'),height:wp('8'),display:'flex',justifyContent:'center',alignItems:'center',marginLeft:5}} onPress={()=>navigation.navigate('Me')}>
                        <FontAwesome name="user-circle-o" size={RFValue(22,580)} color="black"></FontAwesome>
                    </TouchableOpacity>
                    <Text style={style.headertxt}>My Limit Order Alerts</Text>
                    <TouchableOpacity style={{width:RFValue(25,580)}}></TouchableOpacity>
                </View>
                {
                    sportlist.length > 0 ? (
                        <ScrollView style={{flex:1}}>
                            <View style={{marginBottom:98}}>
                            {
                                sportlist.map((item,index)=>(
                                    <LimitAlert key={index} alertinfo={item.alert} sportdata={item.data}></LimitAlert>
                                ))
                            }
                            </View>
                        </ScrollView>
                    ):(
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:RFValue(14,580),color:'black'}}>There are no limit alerts</Text>
                        </View>
                    )
                }
            </View>
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
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row'
    },
    headertxt:{
        fontSize:RFValue(15,580),
        color:'white',
        fontFamily:'Copperplate Bold'
    },
    content:{
        display:'flex',
        flexDirection:'row',
        padding:15
    },
    paramtext:{
        textDecorationColor:'#888',
        color:'#888',
        fontSize:RFValue(16,580),
        textDecorationLine:'underline'
    },
    paramcontent:{
        color:'#888',
        fontSize:RFValue(14,580)
    }
})