import React,{useState} from 'react'
import {View,StyleSheet,Text,Switch,TouchableOpacity,TextInput} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import {useDispatch,useSelector} from 'react-redux'
import {getalertparams,setalertparams,updatealertparams,deletealert} from '../service/alertservice'
import {setalert} from '../redux/action/alert'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import Dropdown from 'react-native-dropdown-picker'

export default function LimitOrderItem({alertitem,setloading})
{
    const dispatch = useDispatch()
    const {token} = useSelector(state=>state.auth)
    const [index,setindex] = useState("")
    const [data,setdata] = useState({})
    const [is_enable,set_isenable] = useState(alertitem.alert_enable == 1)

    const setalertvalue = () => {
        set_isenable(!is_enable)
        setloading(true)
        setalertparams(alertitem.id).then(res=>{
            getalertparams(token).then(res=>{
                setloading(false)
                if(res.data.success)
                {
                    dispatch(setalert(res.data.data))
                }
            }).catch(err=>setloading(false))
        }).catch(err=>setloading(false))
    }

    const getvaluelist = () => {
        let list = []
        let first = Number(alertitem.value) - 300;
        let limit = Number(alertitem.value) + 300;   
        let discount = 5;
        if(alertitem.type == 'SPREAD')
        {
            first = Number(alertitem.value) - 30
            limit = Number(alertitem.value) + 30;
            discount = 0.5;
        }
        
        while(limit > first)
        {
            list.push({label:first>0?'+' + first:"" + first,value:first})
            first += discount
        }

        return list
    }

    const getoddlist = () => {
        let list = []
        let first = Number(alertitem.odd) - 300;
        let limit = Number(alertitem.odd) + 300

        while(limit > first)
        {
            list.push({label:first>0?'+' + first:"" + first,value:first})
            first += 5
        }

        return list
    }

    const getminutes = () => {
        let list = []
        
        for(let index = 2;index<=180;index+=2)
        {
            list.push({label:index + " minutes",value:index})
        }

        return list;
    }

    const savealert = () => {
        setloading(true)
        let datainfo = {
            teams:[data.team1,data.team2],
            type:data.type,
            value:data.value,
            odd:data.odd,
            minute:data.minutes,
            team:data.team,
            commencetime:data.commencetime,
            alert_enable:data.alert_enable,
            id:data.id
        }
        updatealertparams(datainfo,token).then(res=>{
            console.log('resdata',res.data)
            getalertparams(token).then(resdata=>{
                if(resdata.data.success)
                {
                    dispatch(setalert(resdata.data.data))
                    setindex("")
                }

                setloading(false)
            }).catch(err=>setloading(false))
        }).catch(err=>console.log(err.response.data))
    }

    const closealert = () => {
        setindex("")
    }

    const deleteitem = () => {
        setloading(true)
        deletealert(alertitem.id,token).then(res=>{
            if(res.data.success)
            {
                getalertparams(token).then(resdata=>{
                    if(resdata.data.success)
                    {
                        dispatch(setalert(resdata.data.data))
                    }
                    setloading(false)
                }).catch(err=>setloading(false))
            }
        }).catch(err=>setloading(false))
    }
    
    return (
        <>
            <View style={{display:'flex',marginRight:5,marginTop:5}}>
                <TouchableOpacity style={{marginLeft:'auto'}} onPress={deleteitem}>
                    <AntDesign name="close" color="red" size={RFValue(20,580)}></AntDesign>
                </TouchableOpacity>
            </View>
            <View style={style.container}>
                <View style={style.iteminfo}>
                    <Text style={style.teaminfo}>{alertitem.team1} @ {alertitem.team2}</Text>
                    <Switch value={is_enable} onValueChange={setalertvalue}></Switch>
                </View>
                <View style={style.iteminfo}>
                    <Text style={style.text}>TEAM : {alertitem.team}</Text>
                </View>
                <View style={style.iteminfo}>
                    <View style={style.item}>
                        <Text style={style.text}>{alertitem.type}:</Text>
                        {
                            index == "value" ? (
                                <TextInput style={style.input} value={data.value + ""} onChangeText={value=>setdata({...data,value})} keyboardType="number-pad"></TextInput>
                            ):<Text style={style.text}>{alertitem.value}</Text>
                        }
                    </View>
                    <View style={{display:'flex',flexDirection:'row'}}>
                        {
                            index == 'value'?(
                                <>
                                    <TouchableOpacity style={[style.edit,{backgroundColor:'#4BD044',marginRight:15}]}>
                                        <AntDesign name="save" color="white" size={RFValue(15,580)} onPress={savealert}></AntDesign>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={style.edit}>
                                        <AntDesign name="close" color="white" size={RFValue(15,580)} onPress={closealert}></AntDesign>
                                    </TouchableOpacity>
                                </>
                                
                            ):(
                                <TouchableOpacity style={style.edit} onPress={()=>{setdata(alertitem);setindex('value');}}>
                                    <AntDesign color="white" name="edit" size={RFValue(15,580)}></AntDesign>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
                <View style={style.iteminfo}>
                    <View style={style.item}>
                        <Text style={style.text}>Odds:</Text>
                        {
                            index == 'odd'?(
                                <TextInput style={style.input} value={data.odd + ""} onChangeText={value=>setdata({...data,odd:value})} keyboardType="number-pad"></TextInput>
                            ):<Text style={style.text}>{alertitem.odd}</Text>
                        }
                    </View>
                    <View style={{display:'flex',flexDirection:'row'}}>
                        {
                            index == 'odd'?(
                                <>
                                    <TouchableOpacity style={[style.edit,{backgroundColor:'#4BD044',marginRight:15}]}>
                                        <AntDesign name="save" color="white" size={RFValue(15,580)} onPress={savealert}></AntDesign>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={style.edit}>
                                        <AntDesign name="close" color="white" size={RFValue(15,580)} onPress={closealert}></AntDesign>
                                    </TouchableOpacity>
                                </>
                                
                            ):(
                                <TouchableOpacity style={style.edit} onPress={()=>{setdata(alertitem);setindex('odd');}}>
                                    <AntDesign color="white" name="edit" size={RFValue(15,580)}></AntDesign>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
                <View style={style.iteminfo}>
                    <View style={style.item}>
                        <Text style={style.text}>Kill Limit Order:</Text>
                        {
                            index == 'minutes'?(    
                                <Dropdown
                                    items={getminutes()}
                                    defaultValue={data.minutes}
                                    style={style.dropdown}
                                    onChangeItem={item=>setdata({...data,minutes:item.value})}
                                    dropDownStyle={{zIndex:100}}
                                    containerStyle={{width:120,height:30,alignItems:'center',justifyContent:'center'}}
                                ></Dropdown>
                            ):<Text style={style.text}>{alertitem.minutes} minutes</Text>
                        }
                        
                    </View>
                    <View style={{display:'flex',flexDirection:'row'}}>
                        {
                            index == 'minutes'?(
                                <>
                                    <TouchableOpacity style={[style.edit,{backgroundColor:'#4BD044',marginRight:15}]}>
                                        <AntDesign name="save" color="white" size={RFValue(15,580)} onPress={savealert}></AntDesign>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={style.edit}>
                                        <AntDesign name="close" color="white" size={RFValue(15,580)} onPress={closealert}></AntDesign>
                                    </TouchableOpacity>
                                </>
                                
                            ):(
                                <TouchableOpacity style={style.edit} onPress={()=>{setdata(alertitem);setindex('minutes');}}>
                                    <AntDesign color="white" name="edit" size={RFValue(15,580)}></AntDesign>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
                
            </View>
        </>
    )
}

const style = StyleSheet.create({
    container:{
        borderBottomColor:'#DDD',
        borderBottomWidth:1,
        paddingTop:15,
        paddingBottom:50
    },
    teaminfo:{
        flex:1,
        fontSize:RFValue(13,580)
    },
    iteminfo:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:wp('100'),
        paddingRight:15,
        paddingLeft:15,
        paddingTop:5,
        paddingBottom:5
    },
    item:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        width:wp('60'),
        alignItems:'center',
        minHeight:30
    },
    text:{
        fontSize:RFValue(12,580)
    },
    edit:{
        padding:5,
        backgroundColor:'#C63032',
        borderRadius:15
    },
    dropdown:{
        width:120
    },
    input:{
        backgroundColor:'white',
        width:120,
        height:30,
        paddingTop:2,
        paddingBottom:2,
        borderRadius:5
    }
})