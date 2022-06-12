import React,{useState} from 'react';
import {View,StyleSheet,Text,TouchableOpacity,ScrollView,Image,TouchableWithoutFeedback,SafeAreaView,TextInput} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {useSelector,useDispatch} from 'react-redux'
import EventInfo from '../component/EventInfo'
import config from '../config/config.json'
import {createwatchlist,getwatchlist} from '../service/watchlistservice'
import {setwatchlist} from '../redux/action/watchlist'
import Dropdown from 'react-native-dropdown-picker'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

let controller = null;
export default function Events({navigation})
{
    const dispatch = useDispatch()
    const {data,sportlist} = useSelector(state=>state.betlist)
    const {token} = useSelector(state=>state.auth)
    const [today,settoday] = useState('today')
    const [search,setsearch] = useState("")

    const filtersportlist = () => {
        let list = [];
        for(let item in sportlist)
        {
            if(filter(sportlist[item].title).length > 0)
            {
                list.push(sportlist[item]);
            }
        }

        return list;
    }

    const filter = (sporttitle) => {
        var list = []
        var now = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1)
        for(let item in data[sporttitle])
        {
            if(!search || data[sporttitle][item].teams[0].toLowerCase().includes(search.toLowerCase()) || data[sporttitle][item].teams[1].toLowerCase().includes(search.toLowerCase()))
            {   
                if((today == 'today' && new Date(data[sporttitle][item].commence_time * 1000).getDate() == now.getDate()) || today == 'all')
                {
                    list.push(data[sporttitle][item])
                }
                else if(today == 'tomorrow' && new Date(data[sporttitle][item].commence_time * 1000).getDate() == tomorrow.getDate())
                {
                    list.push(data[sporttitle][item])
                }
            }
        }

        return list;
    }

    const alertdetail = (info,title) => {
        createwatchlist(token,info.teams).then(res=>{
            if(res.data.success)
            {
                getwatchlist(token).then(res=>{
                    if(res.data.success)
                    {
                        dispatch(setwatchlist(res.data.data))
                    }
                })
                navigation.navigate("EventDetail",{eventinfo:info,title:title})
            }
        })
    }

    let list = filtersportlist()

    return (
        <TouchableWithoutFeedback style={{flex:1}} onPress={()=>{if(controller){controller.close()}}}>
        <View style={{flex:1,backgroundColor:'white'}}>
            {/* <StatusBar backgroundColor="#C63032"></StatusBar> */}
            <View style={{position:'absolute',right:0,top:40}}>
                <Dropdown 
                    defaultValue={today}
                    controller={ref=>controller = ref}
                    onChangeItem={item=>settoday(item.value)}
                    dropDownStyle={{zIndex:1000}}
                    items={[{value:'all',label:'All'},{value:"today",label:'Today'},{value:'tomorrow',label:'Tomorrow'}]}
                    containerStyle={{width:125,height:50}}
                    arrowColor="white"
                    labelStyle={{color:'black',fontFamily:'Copperplate Regular'}}
                    style={{justifyContent:'space-between',backgroundColor:'transparent',borderWidth:0,zIndex:1000,alignItems:'center'}}
                    itemStyle={{justifyContent:'flex-start',height:30,color:'black'}}
                ></Dropdown>
            </View>
            
            <SafeAreaView style={style.container}>
                <View style={{display:'flex',flexDirection:'row',backgroundColor:'#C63032',alignItems:'center'}}>
                    <TouchableOpacity style={{backgroundColor:'white',width:wp('8'),height:wp('8'),display:'flex',justifyContent:'center',alignItems:'center',marginLeft:5}} onPress={()=>navigation.navigate('Me')}>
                        <FontAwesome name="user-circle-o" size={RFValue(22,580)} color="black"></FontAwesome>
                    </TouchableOpacity>
                    <View style={{width:wp('50'),display:'flex',alignItems:'center',flexDirection:'row',borderWidth:1,borderRadius:5,borderColor:'white',height:40,marginLeft:'auto'}}>
                        <TextInput style={{flex:1,color:'white',padding:5}} placeholder="Search" placeholderTextColor="white" value={search} onChangeText={text=>setsearch(text)}></TextInput>
                        <TouchableOpacity>
                            <EvilIcons name="search" color="white" size={RFValue(20,580)}></EvilIcons>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={style.header}>
                    <TouchableOpacity>
                        <Text style={style.lefttext}>Events</Text>
                    </TouchableOpacity>
                    {/* <Picker
                        selectedValue={today}
                        style={{width:150,height:30,color:'white'}}
                        onValueChange={(itemValue, itemIndex)=>settoday(itemValue)}
                    >
                        <Picker.Item label="Today" value="today"></Picker.Item>
                        <Picker.Item label="Tomorrow" value="tomorrow"></Picker.Item>
                    </Picker> */}
                    
                    {/* <TouchableOpacity style={style.button}>
                        <Text style={style.buttontext}>Today</Text>
                        <IonIcons name="ios-caret-down-circle-outline" color="white" size={RFValue(15,580)}></IonIcons>
                    </TouchableOpacity> */}
                </View>
                <View style={{flex:1}}>
                    <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>
                        <View style={{marginBottom:98,marginTop:15}} onStartShouldSetResponder={()=>true}>
                            {
                                list.length > 0?list.map((item)=>{
                                    return (
                                        <>
                                            <View style={{paddingLeft:5,display:'flex',flexDirection:'row'}}>
                                                <Text style={style.title}>{item.title}</Text>
                                            </View>
                                            <View style={style.section}>
                                                {
                                                filter(item.title).map((info)=>{
                                                        return <EventInfo info={info} onpress={()=>alertdetail(info,item.title)}></EventInfo>
                                                    })
                                                }
                                            </View> 
                                        </>
                                    )
                                }):(
                                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                        <Text style={style.iteminfo}>There is no game</Text>
                                    </View>
                                )
                            }
                        </View>
                        
                    </ScrollView>
                </View>
            </SafeAreaView>
            
        </View>
        </TouchableWithoutFeedback>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        display:'flex',
        flexDirection:'column',
        zIndex:-1
    },
    header:{
        display:'flex',
        flexDirection:'row',
        padding:5,
        justifyContent:'space-between',
        backgroundColor:'#C63032',
        alignItems:'center',
        width:wp('100'),
        minHeight:50,
    },
    headertext:{
        fontSize:RFValue(18,580),
        color:'white',
        fontWeight:'bold'
    },
    lefttext:{
        fontSize:RFValue(16,580),
        color:'white',
        fontFamily:'Copperplate Bold'
    },
    button:{
        backgroundColor:'#C63032',
        borderRadius:5,
        padding:5,
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    buttontext:{
        color:'white',
        fontSize:RFValue(15,580),
        marginRight:5
    },
    section:{
        padding:5,
        marginBottom:20
    },
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
        fontSize:RFValue(11,580),
        color:'black',
        textAlign:'center'
    },
    title:{
        fontSize:RFValue(14,580),
        color:'#C63032',
        fontWeight:'bold'
    },
    column:{
        display:'flex',
        flexDirection:'row'
    },
    tableheader:{
        fontSize:RFValue(9,580),
        color:'black',
        fontWeight:'bold',
        textTransform:'uppercase'
    },
    cellitem:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    iteminfo:{
        fontSize:RFValue(14,580),
        color:'black'
    }
})