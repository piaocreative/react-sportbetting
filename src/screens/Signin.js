import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,KeyboardAvoidingView,ScrollView,AsyncStorage,Platform} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFPercentage,RFValue} from 'react-native-responsive-fontsize'
import {appleAuth,appleAuthAndroid} from '@invertase/react-native-apple-authentication'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {signin,getuser,social_login} from '../service/userservice'
import {connect} from 'react-redux'
import config from '../config/config.json'
import {GoogleSignin,statusCodes} from '@react-native-community/google-signin'
import {setuserdata} from '../redux/action/auth'
import AlertElement from '../component/AlertElement'
import Loading from 'react-native-loading-spinner-overlay'
import {LoginManager,AccessToken,GraphRequest,GraphRequestManager} from 'react-native-fbsdk'
import 'react-native-get-random-values'
import {v4 as uuid} from 'uuid'

class Signin extends React.Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            username:"",
            password:"",
            error:"",
            loading:true,
            apploading:false
        }
    }

    initfacebook = async()=>{
        try
        {
            await Facebook.initializeAsync(config.facebookappid)
        }
        catch(e)
        {
            console.log(e)
        }
    }

   componentWillMount()
   {
       console.log(this.props.auth);
       let self = this;
       AsyncStorage.getItem("token").then(value=>{
           if(value)
           {
               getuser(value).then(userinfo=>{
                    if(userinfo.data.success)
                    {
                        self.props.dispatch(setuserdata(value,userinfo.data.userinfo))
                        self.props.navigation.navigate('Home');
                    }

                    this.setState({loading:false})
               }).catch(err=>this.setState({loading:false}))
           }
           else
           {
               this.setState({loading:false})
           }
       })

       GoogleSignin.hasPlayServices()

       GoogleSignin.configure({
           webClientId:config.webclientid,
           offlineAccess:false
       })


   }

   googlesignin = async() => {
       try{
            let self = this;
            await GoogleSignin.hasPlayServices()
            const userinfo = await GoogleSignin.signIn()

            let signininfo = {
                profile:userinfo.user.photo,
                username:userinfo.user.name.trim(),
                email:userinfo.user.email,
                first_name:userinfo.user.familyName,
                last_name:userinfo.user.givenName,
                provider:'GOOGLE'
            }

            social_login(signininfo).then(res=>{
                if(res.data.success)
                {
                    AsyncStorage.setItem("token",res.data.token)
                    getuser(res.data.token).then(userinfo=>{
                        self.props.dispatch(setuserdata(res.data.token,userinfo.data.userinfo))
                        self.props.navigation.navigate('Home')
                    })
                    
                }
                else
                {
                    this.setState({
                        error:res.data.message
                    })
                }
            })
       }
       catch(e)
       {
           console.log(e.message)
           if(e.code == statusCodes.SIGN_IN_CANCELLED)
           {
           }
       }
   }

   facebooklogin = async() => {
     try{
        let self = this;
        LoginManager.logInWithPermissions(['public_profile']).then(login=>{
            if(login.isCancelled)
            {
                console.log('login cancelled')
            }
            else
            {
                AccessToken.getCurrentAccessToken().then(data=>{
                    const accesstoken = data.accessToken.toString()
                    const profilerequest = new GraphRequest('/me',{token:accesstoken,parameters:{fields:{string:'id,name,email,first_name,last_name,photo'}}},(error,user)=>{
                        if(error)
                        {
                            console.log('logininfo',error)
                        }
                        else
                        {
                            console.log(user)
                            let signininfo = {
                                profile:user.photo,
                                username:user.name,
                                email:user.email,
                                first_name:user.first_name,
                                last_name:user.last_name,
                                provider:'FACEBOOK'
                            }

                            social_login(signininfo).then(res=>{
                                if(res.data.success)
                                {
                                    AsyncStorage.setItem("token",res.data.token)
                                    getuser(res.data.token).then(userinfo=>{
                                        self.props.dispatch(setuserdata(res.data.token,userinfo.data.userinfo))
                                        self.props.navigation.navigate('Home')
                                    })
                                }
                            })
                        }
                    })
                    new GraphRequestManager().addRequest(profilerequest).start()
                })
            }
        })
     }
     catch(e)
     {
         console.log(e.message)
     }
   }

   applelogin = async() => {
        let self = this;

        if(Platform.OS == "ios")
        {
            const appauthrequest = await appleAuth.performRequest({
                requestedOperation:appleAuth.Operation.LOGIN,
                requestedScopes:[appleAuth.Scope.EMAIL,appleAuth.Scope.FULL_NAME]
            })

            const credentialstate = await appleAuth.getCredentialStateForUser(appauthrequest.user)

            if(credentialstate == appleAuth.State.AUTHORIZED)
            {
                console.log(appauthrequest.user)
                let signininfo = {
                    email:appauthrequest.user.email,
                    username:appauthrequest.user.name,
                    first_name:appauthrequest.user.name.split(' ')[0],
                    last_name:appauthrequest.user.name.split(' ')[1],
                    provider:'APPLE'
                }

                social_login(signininfo).then(res=>{
                    if(res.data.success)
                    {
                        AsyncStorage.setItem("token",res.data.token)
                        getuser(res.data.token).then(userinfo=>{
                            self.props.dispatch(setuserdata(res.data.token,userinfo.data.userinfo))
                            self.props.navigation.navigate('Home')
                        })
                        
                    }
                    else
                    {
                        this.setState({
                            error:res.data.message
                        })
                    }
                })
            }
        }
        else
        {
            const rawnonce = uuid()
            const state = uuid()

            appleAuthAndroid.configure({
                clientId:"com.org.livelineactive",
                redirectUri:'https://liveline.com/auth/callback',
                responseType:appleAuthAndroid.ResponseType.ALL,
                scope:appleAuthAndroid.Scope.ALL,
                nonce:rawnonce,
                state
            })

            const response = await appleAuthAndroid.signIn()

            if(response.code == appleAuth.State.AUTHORIZED)
            {
                let signininfo = {
                    email:response.user.email,
                    username:response.user.name,
                    first_name:response.user.name.split(' ')[0],
                    last_name:response.user.name.split(' ')[1],
                    provider:'APPLE'
                }

                social_login(signininfo).then(res=>{
                    if(res.data.success)
                    {
                        AsyncStorage.setItem("token",res.data.token)
                        getuser(res.data.token).then(userinfo=>{
                            self.props.dispatch(setuserdata(res.data.token,userinfo.data.userinfo))
                            self.props.navigation.navigate('Home')
                        })
                        
                    }
                    else
                    {
                        this.setState({
                            error:res.data.message
                        })
                    }
                })
            }
            console.log('response',response)
        }
   }
   

    signin = () => {
        let {username,password} = this.state
        let self = this;
        
        signin(username,password).then(res=>{
            console.log(res.data)
            if(res.data.success)
            {
                AsyncStorage.setItem("token",res.data.token);
                getuser(res.data.token).then(userinfo=>{
                    if(userinfo.data.success)
                    {
                        self.props.dispatch(setuserdata(res.data.token,userinfo.data.userinfo));
                        self.props.navigation.navigate('Home')
                    }
                }).catch(err=>console.log(err))
            }
            else
            {
                this.setState({
                    error:res.data.message
                })
            }
        }).catch(err=>console.log(err))
    }

    render()
    {
        return this.state.loading?<Loading visible={true}></Loading>:(
                <View style={{width:wp('100'),height:hp('100'),backgroundColor:'white'}}>
                    <KeyboardAvoidingView style={style.container} behavior="padding">
                        <ScrollView>
                            <View style={style.content}>
                                <View>
                                    <Text style={[style.title,{marginBottom:15}]}>
                                        Log Into Your Account 
                                    </Text>
                                    <View style={style.inputcontainer}>
                                        <Feather name="user" size={RFValue(25,580)} color="#A2A2A2"></Feather>
                                        <TextInput placeholder="Username/Email" placeholderTextColor="#DDD" style={style.input} onChangeText={(value)=>this.setState({username:value})}></TextInput>
                                    </View>
                                    <View style={[style.inputcontainer,{marginTop:10}]}>
                                        <Feather name="lock" size={RFValue(25,580)} color="#A2A2A2"></Feather>
                                        <TextInput placeholder="Password" secureTextEntry={true} placeholderTextColor="#DDD" style={style.input} onChangeText={(value)=>this.setState({password:value})}></TextInput>
                                    </View>
                                    <View style={{marginTop:10,alignItems:'center'}}>
                                        <TouchableOpacity style={style.go} onPress={this.signin}>
                                            <Text style={style.buttontext}>Go</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{marginTop:20}}>
                                    <TouchableOpacity style={[style.buttoncontainer,{backgroundColor:'#F34336'}]} onPress={this.googlesignin}>
                                        <Text style={style.buttontext}>Login With Google </Text>
                                        <AntDesign name="google" color="white" size={RFValue(25,580)} style={{marginLeft:10}}></AntDesign>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[style.buttoncontainer,{backgroundColor:'#3D5C9E'}]} onPress={this.facebooklogin}>
                                        <Text style={style.buttontext}>Login With FaceBook</Text>
                                        <EvilIcons name="sc-facebook" color="white" size={RFValue(30,580)} style={{marginLeft:10}}></EvilIcons>
                                    </TouchableOpacity>
                                    {
                                        (Platform.OS == "ios" || appleAuthAndroid.isSupported) && (
                                            <TouchableOpacity style={style.buttoncontainer} onPress={this.applelogin}>
                                                <Text style={style.buttontext}>Login With Apple</Text>
                                                <AntDesign name="apple1" color="white" size={RFValue(25,580)} style={{marginLeft:10}}></AntDesign>
                                            </TouchableOpacity>
                                        )
                                    }
                                    
                                    <Text style={[style.title,{marginTop:20}]}>Don't Have an Account</Text>
                                    <TouchableOpacity style={style.buttoncontainer} onPress={()=>this.props.navigation.navigate('Signup')}>
                                        <Text style={style.buttontext}>Create Account With Email</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                        </ScrollView>
                        <Loading visible={this.state.apploading}></Loading>
                        <AlertElement error={this.state.error} seterror={()=>this.setState({error:""})}></AlertElement>
                    </KeyboardAvoidingView>
                </View>
        )
    }
}

const mapstatetoprops = (state) => ({
    auth:state.auth
})

export default connect(mapstatetoprops)(Signin)

const style = StyleSheet.create({
    container:{
        width:wp('100%'),
        height:hp('100%')
    },
    content:{
      flex:1,
      padding:24,
      marginBottom:24
    },
    title:{
        color:'#C63032',
        fontSize:RFValue(18,580),
        fontWeight:'bold',
        textAlign:'center',
        textTransform:"uppercase"
    },
    buttoncontainer:{
        backgroundColor:'#C63032',
        width:wp('100%') - 48,
        padding:15,
        borderRadius:15,
        alignItems:'center',
        marginTop:30,
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
    },
    buttontext:{
        color:'white',
        fontSize:RFValue(16,580)
    },
    input:{
        borderColor:'#C63032',
        borderWidth:1,
        padding:15,
        fontSize:RFValue(16,580),
        borderRadius:5
    },
    go:{
        borderRadius:30,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#F34336',
        padding:10,
        paddingLeft:20,
        paddingRight:20
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
        paddingTop:5,
        paddingBottom:5,
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
})