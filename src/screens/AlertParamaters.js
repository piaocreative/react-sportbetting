import React,{useState,useEffect,useRef} from 'react'
import {View,ScrollView,StyleSheet,Text,TouchableWithoutFeedback, KeyboardAvoidingView, TouchableOpacity,TextInput} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Dropdown from 'react-native-dropdown-picker'
import {updatealertparams,getalertparams} from '../service/alertservice'
import {setprofileinfo} from '../redux/action/auth'
import {setalert} from '../redux/action/alert'
import {useSelector,useDispatch} from 'react-redux'
import AlertElement from '../component/AlertElement'
import Loading from 'react-native-loading-spinner-overlay'
import Modal from 'react-native-modal'

let controller1 = null;
let controller2 = null;
let controller3 = null;
export default function AlertParamaters({navigation,route})
{
    const dispatch = useDispatch()
    const type = route.params.type
    const amount = route.params.amount
    const eventinfo = route.params.eventinfo
    const team = route.params.team
    const title = route.params.title
    
    const {token} = useSelector(state=>state.auth)
    const alertparams = useSelector(state=>state.alert)
    const [error,seterror] = useState("")
    const [success,setsuccess] = useState(false)
    const [loading,setloading] = useState(false)


    const getoddlist = () => {
        let key = type.toLowerCase() + 's'
        let index = eventinfo.teams.indexOf(team)

        let oddamount = eventinfo[key]?eventinfo[key].odds[index]:0
        let valueamount = 5
        let list = []
        let item = oddamount - 300
        while(item < oddamount + 300)
        {
            list.push({label:item>=0?'+' + item:''+item,value:item})
            item += valueamount
        }

        if(!state)
        {
            return list;
        }

        var enable = false;
        for(let item in list)
        {
            if(list[item].value == state.odd)
            {
                enable = true;
                break;
            }
        }

        if(!enable)
        {
            list.push({label:state.odd >= 0?'+' + state.odd:"" + state.odd,value:state.odd})
        }

        return list
    }

    const getalerts = () => {
        for(let item in alertparams)
        {
            if((alertparams[item].team1 == eventinfo.teams[0] && alertparams[item].team2 == eventinfo.teams[1]) || (alertparams[item].team1 == eventinfo.teams[1] && alertparams[item].team2 == eventinfo.teams[0]))
            {
                console.log(eventinfo.teams)
                if(alertparams[item].commencetime == eventinfo.commence_time && alertparams[item].team == team)
                {
                    return {
                        value:alertparams[item].value,
                        odd:alertparams[item].odd,
                        minutes:alertparams[item].minutes
                    }
                }
            }
        }

        return false;
    }

    const getminutes = () => {
        var list = []
        for(let index = 2;index<180;index+=2)
        {
            list.push({label:index + " mins",value:index})
        }

        return list;
    }


    const [state,setstate] = useState(getalerts()?getalerts():{
        value:'',
        odd:'',
        minutes:2
    })

    useEffect(()=>{
        setstate(getalerts()?getalerts():{
            value:'',
            odd:'',
            minutes:2
        })
    },[team,type])

    const updatealert = () => {
        let alertinfo = {
            value:state.value,
            odd:type == 'MoneyLine'?0:state.odd,
            minute:state.minutes,
            team,
            commencetime:eventinfo.commence_time,
            type:type.toUpperCase(),
            teams:eventinfo.teams
        }
        
        setloading(true)
        updatealertparams(alertinfo,token).then(res=>{
            if(res.data.success)
            {
                // Alert.alert('You have successfully set the alert paramaters')
                dispatch(setprofileinfo({balance:res.data.balance}))
                getalertparams(token).then(res=>{
                    if(res.data.success)
                    {
                        setloading(false)
                        setsuccess(true)
                        dispatch(setalert(res.data.data))
                    }
                }).catch(err=>console.log(err))
            }
            else
            {
                setloading(false)
                seterror(res.data.message)
            }
        }).catch(err=>console.log(err.response))

    }

    const close = () => {
        if(controller1)
        {
            controller1.close()
        }

        if(controller2)
        {
            controller2.close()
        }

        if(controller3)
        {
            controller3.close()
        }
    }



    return (
        <TouchableWithoutFeedback onPress={close}>
        <KeyboardAvoidingView style={{width:wp('100'),height:hp('100')}} behavior="padding">
            <ScrollView style={style.container}>
                <View style={style.headercolumn}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <AntDesign name="arrowleft" color="white" size={RFValue(25,580)}></AntDesign>
                    </TouchableOpacity>
                    <Text style={style.columntext}>Alert Paramaters</Text>
                    <View style={{width:RFValue(25,580)}}></View>
                </View>
                <View style={{padding:24}}>
                    <View style={{marginTop:10}}>
                        <Text style={style.itemtext}><Text style={{fontWeight:'bold',color:'black'}}>SPORT:</Text> {title}</Text>
                        <Text style={style.itemtext}><Text style={{fontWeight:'bold',color:'black'}}>EVENT:</Text> {eventinfo.teams[0]} @ {eventinfo.teams[1]}</Text>
                        <Text style={style.itemtext}><Text style={{fontWeight:'bold',color:'black'}}>Team:</Text> {team}</Text>
                        <Text style={style.itemtext}><Text style={{fontWeight:'bold',color:'black'}}>Wager Type:</Text> {type}</Text>
                    </View>
                    <View style={[style.header,{marginTop:15,borderColor:'#C63032',flex:1,borderWidth:1}]}>
                        <Text style={[style.headertext,{color:'#C63032',textTransform:'none',backgroundColor:'white'}]}>Limits & Constraints</Text>
                    </View>
                    <View style={[style.header,{marginTop:10,borderColor:'#C63032',borderWidth:1,alignItems:'stretch',backgroundColor:'white'}]}>
                        <Text style={[style.headertext,{borderBottomColor:'#888',borderBottomWidth:1,color:'#888',textTransform:'none',textAlign:'center'}]}>{type} Now: {amount>0?'+'+amount:amount}</Text>
                        <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,justifyContent:'space-between',minHeight:40}}>
                            <Text style={style.text}>Alert me when {type} hits: </Text>
                            <TextInput style={style.input} keyboardType="number-pad" value={state.value + ""} onChangeText={value=>setstate({...state,value:value})}></TextInput>
                            {/* <Dropdown 
                                items={
                                    gettypelist()
                                }
                                controller={ref=>controller1 = ref}
                                placeholder="My Story Book" 
                                placeholderStyle={{color:'black'}} 
                                labelProps={{style:{color:'black'}}}
                                style={{borderWidth:1,justifyContent:'space-between',width:100,zIndex:100,elevation:100}}
                                itemStyle={{color:'black',fontSize:RFValue(16,580)}}
                                defaultValue={state.value}
                                zIndex={6000}
                                onChangeItem={item=>setstate({...state,value:item.value})}
                                dropDownStyle={{zIndex:110,elevation:100}}
                                containerStyle={{height:40}}></Dropdown> */}
                            {/* <TextInput style={{borderBottomColor:'black',borderBottomWidth:1,width:80,paddingBottom:0,flex:1}}></TextInput> */}
                        </View>
                        {
                            type != 'MoneyLine' && (
                                <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,justifyContent:'space-between',minHeight:40}}>
                                    <Text style={style.text}>Alert me when Juice hits: </Text>
                                    <TextInput style={style.input} keyboardType="number-pad" value={state.odd + ""} onChangeText={value=>setstate({...state,odd:value})}></TextInput>
                                    {/* <TextInput style={{borderBottomColor:'black',borderBottomWidth:1,width:80,paddingBottom:0,flex:1}}></TextInput> */}
                                </View>
                            )
                        }
                        {/* <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:10}}>
                            <Text style={style.text}>Set Value/Odds Limiter: </Text>
                            <TextInput style={{borderBottomColor:'black',borderBottomWidth:1,width:80,paddingBottom:0,flex:1}}></TextInput>
                        </View> */}
                        <View style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,marginBottom:10,justifyContent:'space-between',flex:1}}>
                            <Text style={style.text}>Kill Limit Order Alert After: </Text>
                            <Dropdown 
                                items={
                                    getminutes()
                                }
                                controller = {ref=>controller3 = ref}
                                placeholder="My Story Book" 
                                placeholderStyle={{color:'black'}} 
                                labelProps={{style:{color:'black'}}}
                                style={{borderWidth:1,color:'black',justifyContent:'space-between',width:100,zIndex:100,elevation:100}}
                                itemStyle={{color:'black',fontSize:RFValue(18,580)}}
                                defaultValue={state.minutes}
                                baseColor="black"
                                zIndex={3000}
                                onChangeItem={item=>setstate({...state,minutes:item.value})}
                                dropDownStyle={{zIndex:110,elevation:100,height:100}}
                                containerStyle={{height:40}}></Dropdown>
                            {/* <TextInput style={{borderBottomColor:'black',borderBottomWidth:1,width:80,paddingBottom:0,flex:1}}></TextInput> */}
                        </View>
                        <TouchableOpacity style={style.btncontainer} onPress={updatealert}>
                            <Text style={style.btntext}>Submit Live Limit Order Alert</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </ScrollView>
            <Modal isVisible={success} onBackdropPress={()=>setsuccess(false)}>
                <View style={style.modalinside}>
                    <Text style={style.modaltext}>Alert Locked In</Text>
                    <View style={{flexDirection:'row',display:'flex',justifyContent:'space-around',width:wp('100')-100}}>
                        <TouchableOpacity style={style.btn} onPress={()=>setsuccess(false)}>
                            <Text style={style.btntextinfo}>EDIT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.btn} onPress={()=>{setsuccess(false);navigation.goBack()}}>
                            <Text style={[style.btntextinfo,{color:'#1CB100'}]}>DONE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <AlertElement error={error} seterror={seterror}></AlertElement>
            {
                loading && (
                    <Loading visible={true}></Loading>
                )
            }
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    headercolumn:{
        backgroundColor:'#C63032',
        display:'flex', 
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding:5
    },
    columntext:{
        color:'white',
        fontSize:RFValue(18,580),
        fontFamily:'Copperplate Bold',
        textAlign:'center',
        flex:1
    },  
    header:{
        justifyContent:'center',
        padding:5,
        flex:1,
        alignItems:'center',
        borderRadius:8
    },
    headertext:{
        fontSize:RFValue(14,580),
        color:'#C63032',
        fontFamily:'Copperplate Bold'
    },
    itemtext:{
        color:'#888',
        fontSize:RFValue(14,580)
    },
    num:{
        width:RFValue(20,580),
        color:"#C63032",
        borderRadius:10,
        fontSize:RFValue(14,580),
        fontWeight:'bold',
        borderColor:'#C63032',
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        textAlign:'center'
    },
    text:{
        fontSize:RFValue(12,580),
        color:'black',
        marginLeft:5,
        flex:1
    },
    btncontainer:{
        borderRadius:5,
        padding:15,
        justifyContent:'center',
        alignItems:'center',
        marginTop:35,
        display:'flex',
        alignSelf:'center',
        flexDirection:'row',
        backgroundColor:'black'
    },
    btntext:{
        color:'white',
        fontSize:RFValue(12,580),
        fontWeight:'bold',
        textTransform:'uppercase',
        textAlign:'center'
    },
    modalinside:{
        backgroundColor:'white',
        borderRadius:10,
        padding:15,
        alignItems:'center'
    },
    modaltext:{
        fontSize:RFValue(16,580),
        color:'#333',
        textAlign:'center',
        fontFamily:'Copperplate Bold'
    },
    btn:{
        backgroundColor:'black',
        paddingLeft:15,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
        marginTop:15,
        borderRadius:5
    },
    btntextinfo:{
        color:'#ED210C',
        fontSize:RFValue(14,580)
    },
    input:{
        borderRadius:5,
        color:'#777',
        backgroundColor:'white',
        borderWidth:1,
        borderColor:'white',
        justifyContent:'space-between',
        width:100,
        zIndex:100,
        elevation:100,
        paddingTop:5,
        paddingBottom:5
    }
})