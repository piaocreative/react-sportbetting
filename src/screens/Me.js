import React,{useState} from 'react'
import {View,TouchableWithoutFeedback,StyleSheet,Text,TouchableOpacity,Image,AsyncStorage, Alert} from 'react-native'
import { color } from 'react-native-reanimated'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import OctIcons from 'react-native-vector-icons/Octicons'
import Dropdown from 'react-native-dropdown-picker'
import {useSelector,useDispatch} from 'react-redux'
import {logout,setprofile,setprofileinfo} from '../redux/action/auth'
import ImagePicker from 'react-native-image-crop-picker'
import {uploadprofile,setprofileservice} from '../service/userservice'
import config from '../config/config.json'
import IonIcons from 'react-native-vector-icons/Ionicons'

let controller = null;
export default function Me({navigation})
{
    const {sportsbook} = useSelector(state=>state.betlist),
    {userinfo,token} = useSelector(state=>state.auth),
    dispatch = useDispatch();

    const getsportsbook = () => {
        let sportbooklist = [];
        for(let item in sportsbook)
        {
            sportbooklist.push({label:sportsbook[item].sitename,value:sportsbook[item].sitekey})
        }

        if(userinfo.sports_book)
        {
            sportbooklist.push({value:userinfo.sports_book,label:userinfo.sports_book})
        }
        else
        {
            sportbooklist.push({value:"",label:"My Story Book"})
        }
        return sportbooklist;
    }

    const signout = () => {
        AsyncStorage.removeItem("token")
        navigation.navigate('Signin')
        dispatch(logout())
    }

    const openpicker = () => {
        ImagePicker.openPicker({
            multiple: false,
            mediaType: 'photo',
            includeExif: true,
            waitAnimationEnd: true,
            includeBase64: true,
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500
        }).then(image=>{
            uploadprofile({
                uri:image.path,
                type:image.mime,
                name:image.path.split("/").pop()
            },token).then(res=>{
                if(res.data.success)
                {
                    dispatch(setprofile(res.data.uri))
                }

            })
        }).catch(err=>console.log(err))
    }

    const updatesportsbook = (sportbook) => {
        setprofileservice({sports_book:sportbook},token).then(res=>{
            console.log(res.data);
            dispatch(setprofileinfo({sports_book:sportbook}))
        }).catch(err=>console.log(err))
    }

    const getprofileurl = (url) => {
        if(url.split('https://').length > 1 || url.split('http://').length > 1)
        {
            return url;
        }   
        else
        {
            return config.apiurl + url
        }
    }

    let free = new Date(userinfo.free) > new Date();


    return (
        <TouchableWithoutFeedback style={{width:wp('100'),height:hp('100'),backgroundColor:'white'}} onPress={()=>controller.close()}>
            <View style={style.container}>
                <View style={style.header}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <IonIcons name="arrow-back" size={RFValue(22,580)} color="white"></IonIcons>
                    </TouchableOpacity>
                    <Text style={style.headertext}>Account</Text>
                    <View style={{width:RFValue(22,580)}}></View>
                </View>
                <View style={style.content}>
                    <View style={{flexDirection:'row',display:'flex'}}>
                        <View style={{flex:1}}>
                            <View style={{display:'flex',flexDirection:'row'}}>
                                <Text style={[style.item,{marginRight:5,fontWeight:'bold'}]}>Name:</Text>
                                <Text style={style.item}>{userinfo['first_name']} {userinfo['last_name']}</Text>
                            </View>
                            
                            <View style={{flexDirection:'row',display:'flex',alignItems:'center'}}>
                                <Text style={[style.item,{marginRight:5,fontWeight:'bold'}]}>Sportsbook:</Text>
                                <Dropdown 
                                    items={
                                        getsportsbook()
                                    }
                                    controller={ref=>controller = ref}
                                    placeholder="My Story Book" 
                                    placeholderStyle={{color:'black'}} 
                                    labelProps={{style:{color:'black',fontSize:RFValue(10,580)}}}
                                    style={{borderWidth:0,width:wp('30'),color:'black',justifyContent:'space-between'}}
                                    itemStyle={{color:'black',fontSize:RFValue(16,580),justifyContent:'flex-start'}}
                                    defaultValue={userinfo.sports_book?userinfo.sports_book:""}
                                    onChangeItem={item=>updatesportsbook(item.value)}
                                    baseColor="black"
                                    containerStyle={{width:wp('30'),height:30}}></Dropdown>
                            </View>
                            <View style={{flexDirection:'row',display:'flex',alignItems:'center',marginTop:15}}>
                                <Text style={[style.item,{marginRight:5,fontWeight:'bold'}]}>Balance:</Text>
                                <TouchableOpacity><Text style={[style.item,{fontSize:RFValue(12,580)}]}>{free?'Unlimited':userinfo.balance} Limit Order Alerts</Text></TouchableOpacity>
                                <TouchableOpacity style={{marginLeft:10}} onPress={()=>navigation.navigate('Membership')}>
                                    <Text style={{color:'blue',fontSize:RFValue(12,580)}}>Get More</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity style={style.image} onPress={openpicker}>
                            <Image source={userinfo.profile?{uri:getprofileurl(userinfo.profile)}:require('../assets/images/profile.png')} style={style.image}></Image>
                        </TouchableOpacity>
                    </View>
                    {
                        userinfo.referal_username && (
                            <View>
                                <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                                    <Text style={[style.item,{fontWeight:'bold'}]}>
                                        Referral Username :
                                    </Text>
                                    <Text style={style.item}>{userinfo.referal_username}</Text>
                                </View>
                                
                            </View>
                        )
                    }
                    
                    <View style={style.section}>
                        <View style={style.sectionitem}>
                            <View style={{flex:1,paddingBottom:5,borderBottomColor:'#888',borderBottomWidth:1}}>
                                <Text style={[style.item,{color:'#888'}]}>
                                    My Current LiveLine Limit Orders
                                </Text>
                            </View>
                            
                            <TouchableOpacity style={style.righticon} onPress={()=>navigation.navigate('Alert')}>
                                <OctIcons name="chevron-right" color="#C63032" size={RFValue(15,580)}></OctIcons>
                            </TouchableOpacity>
                        </View>
                        <View style={style.sectionitem}>
                            <View style={{flex:1,paddingBottom:5,borderBottomColor:'#888',borderBottomWidth:1}}>
                                <Text style={[style.item,{color:'#888'}]}>
                                    My LiveLine Limits
                                </Text>
                            </View>
                            
                            <TouchableOpacity style={style.righticon} onPress={()=>navigation.navigate('LimitOrder')}>
                                <OctIcons name="chevron-right" color="#C63032" size={RFValue(15,580)}></OctIcons>
                            </TouchableOpacity>
                        </View>
                        <View style={style.sectionitem}>
                            <View style={{flex:1,paddingBottom:5,borderBottomColor:'#888',borderBottomWidth:1}}>
                                <Text style={[style.item,{color:'#888'}]}>
                                    My History
                                </Text>
                            </View>
                            
                            <TouchableOpacity style={style.righticon} onPress={()=>navigation.navigate('History')}>
                                <OctIcons name="chevron-right" color="#C63032" size={RFValue(15,580)}></OctIcons>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={style.section}>
                        <View style={style.sectionitem}>
                            <View style={{flex:1,paddingBottom:5,borderBottomColor:'#888',borderBottomWidth:1}}>
                                <Text style={[style.item,{color:'#888'}]}>
                                    Settings
                                </Text>
                            </View>
                            
                            <TouchableOpacity style={style.righticon} onPress={()=>navigation.navigate('Settings')}>
                                <OctIcons name="chevron-right" color="#C63032" size={RFValue(15,580)}></OctIcons>
                            </TouchableOpacity>
                        </View>
                        <View style={style.sectionitem}>
                            <View style={{flex:1,paddingBottom:5,borderBottomColor:'#888',borderBottomWidth:1}}>
                                <Text style={[style.item,{color:'#888'}]}>
                                    Help
                                </Text>
                            </View>
                            
                            <TouchableOpacity style={style.righticon} onPress={()=>navigation.navigate('Articles')}>
                                <OctIcons name="chevron-right" color="#C63032" size={RFValue(15,580)}></OctIcons>
                            </TouchableOpacity>
                        </View>
                        <View style={style.sectionitem}>
                            <View style={{flex:1,paddingBottom:5,borderBottomColor:'#888',borderBottomWidth:1}}>
                                <Text style={[style.item,{color:'#888'}]}>
                                    About
                                </Text>
                            </View>
                            
                            <TouchableOpacity style={style.righticon} onPress={()=>navigation.navigate('About')}>
                                <OctIcons name="chevron-right" color="#C63032" size={RFValue(15,580)}></OctIcons>
                            </TouchableOpacity>
                        </View>
                        <View style={style.sectionitem}>
                            <View style={{flex:1,paddingBottom:5,borderBottomColor:'#888',borderBottomWidth:1}}>
                                <Text style={[style.item,{color:'#888'}]}>
                                    Logout
                                </Text>
                            </View>
                            
                            <TouchableOpacity style={style.righticon} onPress={signout}>
                                <OctIcons name="chevron-right" color="#C63032" size={RFValue(15,580)}></OctIcons>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    header:{
        backgroundColor:'#C63032',
        paddingBottom:5,
        paddingLeft:24,
        paddingRight:24,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    headertext:{
        color:'white',
        fontSize:RFValue(18,580),
        textAlign:'center',
        fontFamily:'Copperplate Bold'
    },
    content:{
        padding:24
    },
    item:{
        fontSize:RFValue(12,580),
        color:'black'
    },
    image:{
        width:wp('15'),
        height:wp('15'),
        borderRadius:20
    },
    section:{
        padding:5,
        borderRadius:5,
        marginTop:15
    },
    sectionitem:{
        display:'flex',
        flexDirection:'row',
        marginBottom:5,
        alignItems:'center'
    },
    righticon:{
        width:RFValue(22,580),
        height:RFValue(22,580),
        backgroundColor:'white',
        borderRadius:RFValue(15,580),
        borderColor:'#C63032',
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        marginLeft:10
    }
})