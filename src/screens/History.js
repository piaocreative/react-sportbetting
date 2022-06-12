import React,{useEffect,useState} from 'react'
import {View,ScrollView,StyleSheet,TextInput,Text,TouchableOpacity,ImageBackground} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import {gethistory} from '../service/historyservice'
import {useSelector} from 'react-redux'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import moment from 'moment'
import IonIcons from 'react-native-vector-icons/Ionicons'
export default function History({navigation})
{
    const {token} = useSelector(state=>state.auth)
    const [history,sethistory] = useState([])
    useEffect(()=>{
        gethistory(token).then(res=>{
            if(res.data.success)
            {
                sethistory(res.data.history)
            }
            
        }).catch(err=>console.log(err.response.data))
    },[])
    return (
        <View style={{width:wp('100'),height:hp('100'),backgroundColor:'white'}}>
            <View style={style.container}>
                <View style={style.header}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <IonIcons name="arrow-back" size={RFValue(22,580)} color="white"></IonIcons>
                    </TouchableOpacity>
                    <Text style={style.headertxt}>My History</Text>
                    <View style={{width:RFValue(22,580)}}></View>
                </View>
                <ScrollView style={style.content}>
                    {
                        history.map((item,index)=>(
                            <View style={[style.itemcontainer,{backgroundColor:index % 2 == 0?'white':'#DDD'}]} key={index}>
                                <Text style={style.itemtext}>
                                    Limit Order Alert Placed on {item.team} {item.alerttype.toLowerCase()} {item.type} for {item.value > 0?'+' + item.value:'-'+item.value} Until {item.period} on {moment(new Date(item.created_at)).format('M/DD/YY')}
                                </Text>
                                <Text style={item.status == 'notfilled'?style.notfilled:style.filled}>
                                    {item.status == 'notfilled'?'ALERT\nNOT\nFILLED':'ALERT\nFILLED'}
                                </Text>
                            </View>
                        ))
                    }
                </ScrollView>
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
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    headertxt:{
        color:'white',
        fontSize:RFValue(18,580),
        textAlign:'center',
        fontFamily:'Copperplate Bold'
    },
    itemcontainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        borderBottomColor:'#888',
        borderBottomWidth:1,
        padding:15
    },
    itemtext:{
        flex:1,
        fontSize:RFValue(14,580),
        color:'black',
        opacity:0.6
    },
    notfilled:{
        color:'#C63032',
        fontSize:RFValue(14,580),
        textAlign:'center',
        marginLeft:10
    },
    filled:{
        color:'#425769',
        fontSize:RFValue(14,580),
        textAlign:'center',
        marginLeft:10
    }
})