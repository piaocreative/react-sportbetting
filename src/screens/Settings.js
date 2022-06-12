import React,{useState,useEffect} from 'react'
import {View,ScrollView,StyleSheet,TextInput,Text,TouchableOpacity,KeyboardAvoidingView,Switch,Alert} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import Fontiso from 'react-native-vector-icons/Fontisto'
import Modal from 'react-native-modal'
import {setprofileinfo} from '../redux/action/auth'
import {setprofileservice} from '../service/userservice'
import {useSelector,useDispatch} from 'react-redux'
import AlertElement from '../component/AlertElement'
import IonIcons from 'react-native-vector-icons/Ionicons'
export default function Settings({navigation})
{
    const {userinfo,token} = useSelector(state=>state.auth)
    const [field,setfield] = useState("")
    const [error,seterror] = useState("")
    const [info,setinfo] = useState([])
    const [placeholder,setplaceholder] = useState([])
    const dispatch = useDispatch()
    const gettitle = () => {
        switch(field)
        {
            case 'fullname':
                return "Change FirstName and LastName";
            case 'username':
                return 'Change UserName';
            case 'email':
                return 'Change Email';
            case 'phone_number':
                return 'Change Phone Number';
            case 'state_residence':
                return 'Change State Of Residence';
        }
    }

    useEffect(()=>{
        switch(field)
        {
            case 'fullname':
                setplaceholder(['First Name','Last Name'])
                setinfo([userinfo.first_name,userinfo.last_name])
                break;
            case 'username':
                setplaceholder(['User Name'])
                setinfo([userinfo.username])
                break
            case 'email':
                setplaceholder(['Email Address'])
                setinfo([userinfo.email])
                break
            case 'phone_number':
                setplaceholder(['Phone Number'])
                setinfo([userinfo.phone_number])
                break;
            case 'state_residence':
                setplaceholder(['State Of Residence'])
                setinfo([userinfo.state_residence])
                break
            default:
                setinfo([])
        }
    },[field])

    const save = () => {
        let user = {}
        if(field == 'fullname')
        {
            user = {first_name:info[0],last_name:info[1]}
        }
        else
        {
            user[field] = info[0]
        }

        setprofileservice(user,token).then(res=>{
            if(res.data.success)
            {
                dispatch(setprofileinfo(user))
                setfield("")
            }
            else
            {
                seterror(res.data.message)
            }
        }).catch(err=>console.log(err.response.data))
    }

    const setvalue = (value) => {
        dispatch(setprofileinfo({alert_enable:value}))
        setprofileservice({alert_enable:value},token)
    }

    return (
        <KeyboardAvoidingView style={style.container} behavior="height">
        <View style={style.container}>
            <View style={style.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <IonIcons name="arrow-back" color="white" size={RFValue(22,580)}></IonIcons>
                </TouchableOpacity>
                <Text style={style.headertxt}>Settings</Text>
                <View style={{width:RFValue(22,580)}}></View>
            </View>
            <ScrollView>
                <View style={style.content}>
                    <View style={style.inputcontainer}>
                        <Text style={{fontSize:RFValue(12,580),fontWeight:'bold',color:'#333'}}>Name:</Text>
                        <Text style={{flex:1,fontSize:RFValue(12,580),color:'#333',marginLeft:10}}>{userinfo.first_name} {userinfo.last_name}</Text>
                        <TouchableOpacity style={style.editbtn} onPress={()=>setfield("fullname")}>
                            <Feather name="edit" color="white" size={RFValue(12,580)}></Feather>
                        </TouchableOpacity>
                    </View>
                    <View style={style.inputcontainer}>
                        <Text style={{fontSize:RFValue(12,580),fontWeight:'bold',color:'#333'}}>User Name:</Text>
                        <Text style={{flex:1,fontSize:RFValue(12,580),color:'#333'}}>{userinfo.username}</Text>
                        <TouchableOpacity style={style.editbtn} onPress={()=>setfield("username")}>
                            <Feather name="edit" color="white" size={RFValue(12,580)}></Feather>
                        </TouchableOpacity>
                    </View>
                    <View style={style.inputcontainer}>
                        <Text style={{fontSize:RFValue(12,580),fontWeight:'bold',color:'#333'}}>Email:</Text>
                        <Text style={{flex:1,fontSize:RFValue(12,580),color:'#333',marginLeft:10,marginRight:10}}>{userinfo.email}</Text>
                        <TouchableOpacity style={style.editbtn} onPress={()=>setfield('email')}>
                            <Feather name="edit" color="white" size={RFValue(12,580)}></Feather>
                        </TouchableOpacity>
                    </View>
                    <View style={style.inputcontainer}>
                        <Text style={{fontSize:RFValue(12,580),fontWeight:'bold',color:'#333'}}>Phone Number: </Text>
                        <Text style={{flex:1,fontSize:RFValue(12,580),color:'#333',marginLeft:10,marginRight:10}}>{userinfo.phone_number}</Text>
                        <TouchableOpacity style={style.editbtn} onPress={()=>setfield("phone_number")}>
                            <Feather name="edit" color="white" size={RFValue(12,580)}></Feather>
                        </TouchableOpacity>
                    </View>
                    <View style={style.inputcontainer}>
                        <Text style={{fontSize:RFValue(12,580),fontWeight:'bold',color:'#333'}}>State Of Resident: </Text>
                        <Text style={{flex:1,fontSize:RFValue(12,580),color:'#333',marginLeft:10}}>{userinfo.state_residence}</Text>
                        <TouchableOpacity style={style.editbtn} onPress={()=>setfield("state_residence")}>
                            <Feather name="edit" color="white" size={RFValue(12,580)}></Feather>
                        </TouchableOpacity>
                    </View>
                    <View style={{borderColor:'#C63032',borderWidth:1,borderRadius:5,padding:5}}>
                        <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={style.itemtext}>Dual Alerts</Text>
                            <Switch value={userinfo.alert_enable == '1'} onValueChange={value=>setvalue(value)}/>
                        </View>
                        <View style={{display:'flex',flexDirection:'row'}}>
                            <TouchableOpacity style={style.btn}>
                                <AntDesign name="infocirlceo" color="#C63032" size={RFValue(16,580)}></AntDesign>
                            </TouchableOpacity>
                            <Text style={[style.itemtext,{marginLeft:5}]}>
                                Never miss Alerts- when alert is {'\n'}triggered, two notifications will be sent within 35 seconds
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <Modal isVisible={field != ""} onBackdropPress={()=>setfield("")}>
                <View style={style.modalinside}>
                    <Text style={style.modaltitle}>{gettitle()}</Text>
                    <View style={{marginTop:15}}>
                        <View>
                            <TextInput style={[style.inputcontainer,{fontSize:RFValue(14,580)}]} placeholder={placeholder[0]} placeholderTextColor="#333" value={info[0] + ""} onChangeText={value=>setinfo(info[1] != undefined?[value,info[1]]:[value])}></TextInput>
                        </View>
                        {
                            field == 'fullname' && (
                                <View style={{marginTop:5}}>
                                    <TextInput style={[style.inputcontainer,{fontSize:RFValue(14,580)}]} placeholder={placeholder[1]} placeholderTextColor="#333" value={info[1] + ""} onChangeText={value=>setinfo([info[0],value])}></TextInput>
                                </View>
                            )
                        }
                    </View>
                    <View style={{marginTop:5}}>
                        <TouchableOpacity style={style.savebtn} onPress={save}>
                            <Text style={{color:'white',fontSize:RFValue(14,580)}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <AlertElement error={error} seterror={seterror}></AlertElement>
        </View>
        </KeyboardAvoidingView>
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
    content:{
        padding:24
    },
    itemtext:{
        fontSize:RFValue(14,580),
        color:'black',
        flex:1
    },
    edittxt:{
        fontSize:RFValue(16,580),
        color:'white'
    },
    editbtn:{
        width:RFValue(25,580),
        height:RFValue(25,580),
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#C63032',
        borderRadius:30
    },
    btn:{
        width:RFValue(22,580),
        height:RFValue(22,580),
        borderRadius:RFValue(11,580),
        borderColor:'#C63032',
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center'
    },
    inputcontainer:{
        display:'flex',
        flexDirection:'row',
        backgroundColor:'white',
        shadowColor:'black',
        shadowOpacity:0.16,
        shadowRadius:5,
        shadowOffset:{
            height:3,
            width:0
        },
        borderRadius:5,
        elevation:10,
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:15,
        paddingRight:15,
        alignItems:'center',
        marginBottom:16,
        marginLeft:10,
        marginRight:10
    },
    input:{
        fontSize:RFValue(16,580),
        marginLeft:15,
        flex:1
    },
    modalinside:{
        backgroundColor:'white',
        borderRadius:5,
        padding:24
    },
    modaltitle:{
        textAlign:'center',
        fontSize:RFValue(16,580),
        color:'black'
    },
    row:{
        display:'flex',
        flexDirection:'row'
    },
    savebtn:{
        padding:8,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#C63032',
        marginLeft:10,
        marginRight:10
    }
})