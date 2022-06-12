import React,{useState} from 'react'
import {View,StyleSheet,ScrollView,TouchableOpacity,Text} from 'react-native'
import {useSelector} from 'react-redux'
import Loading from 'react-native-loading-spinner-overlay'
import LimitOrderItem from '../component/LimitOrderItem'
import {RFValue} from 'react-native-responsive-fontsize'
import IonIcons from 'react-native-vector-icons/Ionicons'

export default function LimitOrder({navigation})
{
    const alert = useSelector(state=>state.alert)
    const [loading,setloading] = useState(false)
    const {data} = useSelector(state=>state.betlist)
    const {userinfo} = useSelector(state=>state.auth)

    const filter = () => {
        var list = []
        for(let item in alert)
        {  
            if(alert[item].sportsbook == userinfo.sports_book)
            {
                var enable = false;
                for(let itemdata in data)
                {
                    for(let iteminfo in data[itemdata])
                    {
                        if(data[itemdata][iteminfo].teams[0] == alert[item].team1 && data[itemdata][iteminfo].teams[1] == alert[item].team2 && data[itemdata][iteminfo].commence_time == alert[item].commencetime)
                        {
                            list.push(alert[item])
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

    

    let items = filter()
    return (
        <View style={style.container}>
            <View style={style.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <IonIcons name="arrow-back" size={RFValue(22,580)} color="white"></IonIcons>
                </TouchableOpacity>
                <Text style={style.headertxt}>LiveLine Limits</Text>
                <View style={{width:RFValue(22,580)}}></View>
            </View>
            {
                items.length > 0?(
                    <ScrollView style={style.container}>
                        {
                            items.map((item,index)=>(
                                <LimitOrderItem alertitem={item} key={index} setloading={setloading}></LimitOrderItem>
                            ))
                        }
                    </ScrollView>
                ):(
                    <View style={[style.container,{justifyContent:'center',alignItems:'center'}]}>
                        <Text>There is no alert limit</Text>
                    </View>
                )
            }
            
            <Loading visible={loading}></Loading>
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
        fontSize:RFValue(18,580),
        color:'white',
        fontFamily:'Copperplate Bold'
    }
})