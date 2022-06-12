import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,TextInput,KeyboardAvoidingView,ScrollView,CheckBox,ImageBackground, Alert, TouchableHighlightBase} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFPercentage,RFValue} from 'react-native-responsive-fontsize'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Dropdown from 'react-native-dropdown-picker'
import {connect} from 'react-redux'
import {register} from '../service/userservice'
import AlertElement from '../component/AlertElement'
import Loading from 'react-native-loading-spinner-overlay'

class Signup extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            checked:false,
            sports_book:"fanduel",
            first_name:"",
            last_name:"",
            password:"",
            confirm_pass:"",
            resident:"",
            email:"",
            phonenumber:"",
            username:"",
            referal_username:"",
            error:{},
            errormessage:"",
            loading:false
        }
    }

    getsportsbook = () => {
        const {sportsbook} = this.props.betlist
        let sportbooklist = [];
        for(let item in sportsbook)
        {
            sportbooklist.push({label:sportsbook[item].sitename,value:sportsbook[item].sitekey})
        }
        return sportbooklist;
    }

    checkvalid = () => {
        let userinfo = this.state
        let error = {};
        for(let item in userinfo)
        {
            if(item == 'referal_username' || item == 'error' || item == "errormessage" || item == 'loading')
            {
                continue;
            }

            if(!userinfo[item])
            {
                if(item != 'checked')
                {
                    error[item] = "Required"
                }
                else
                {
                    error['terms'] = "You must agree to terms and conditions";
                }
            }
        }
        
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(userinfo.password != userinfo.confirm_pass)
        {
            error['password'] = "Password and Confirm Password must be same"
        }
        else if(!re.test(userinfo.email.toLowerCase()))
        {
            error['email'] = "You must input valid email"
        }

        this.setState({
            error:error
        })
        return Object.keys(error).length  ==  0
    }

    submit = () => {
        if(this.checkvalid())
        {
            let userinfo = {
                email:this.state.email,
                first_name:this.state.first_name,
                last_name:this.state.last_name,
                username:this.state.username,
                password:this.state.password,
                state_residence:this.state.resident,
                phone_number:this.state.phonenumber,
                sports_book:this.state.sports_book,
                referal_username:this.state.referal_username
            }

            this.setState({
                loading:true
            })
            register(userinfo).then(res=>{
                if(res.data.success)
                {
                    this.props.navigation.navigate('Signin')
                }
                else
                {
                    this.setState({
                        errormessage:res.data.message
                    })
                    
                }

                this.setState({loading:false})
            }).catch(err=>this.setState({loading:false}))
        }
    }

    render()
    {
        

        return (
            <View style={{width:wp('100'),height:hp('100'),backgroundColor:'white'}}>
                <KeyboardAvoidingView style={style.container} behavior="padding">
                    <ScrollView>
                        <View style={style.content}>
                            <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                                <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                                    <MaterialCommunityIcons name="arrow-left" color="black" size={RFValue(25,580)}></MaterialCommunityIcons>
                                </TouchableOpacity>
                                <Text style={style.title}>Account Setup</Text>
                                <TouchableOpacity style={{width:RFValue(25,580)}}></TouchableOpacity>
                            </View>
                            
                            <View style={{marginTop:20}}>
                                <View style={{flexDirection:'row'}}>
                                    <View style={{flex:1,marginRight:10}}>
                                        <View style={style.inputcontainer}>
                                            <TextInput placeholder="First Name" placeholderTextColor="#CCC" style={style.input} onChangeText={value=>this.setState({first_name:value})}></TextInput>
                                        </View>
                                        {
                                            this.state.error.first_name && (
                                                <Text style={style.error}>{this.state.error.first_name}</Text>
                                            )
                                        }
                                    </View>
                                    <View style={{flex:1}}>
                                        <View style={style.inputcontainer}>
                                            <TextInput placeholder="Last Name" placeholderTextColor="#CCC" style={[style.input,{marginLeft:15}]} onChangeText={value=>this.setState({last_name:value})}></TextInput>
                                        </View>
                                        {
                                            this.state.error.last_name && (
                                                <Text style={style.error}>{this.state.error.last_name}</Text>
                                            )
                                        }
                                    </View>
                                    
                                </View>
                                <View style={{marginTop:10}}>
                                    <View style={style.inputcontainer}>
                                        <AntDesign name="user" color="#A2A2A2" size={RFValue(25,580)}></AntDesign>
                                        <TextInput placeholder="User Name" placeholderTextColor="#CCC" style={style.input} onChangeText={value=>this.setState({username:value})}></TextInput>
                                    </View>
                                    {
                                        this.state.error.username && (
                                            <Text style={style.error}>{this.state.error.username}</Text>
                                        )
                                    }
                                </View>
                                <View style={{marginTop:10}}>
                                    <View style={style.inputcontainer}>
                                        <AntDesign name="user" color="#A2A2A2" size={RFValue(25,580)}></AntDesign>
                                        <TextInput placeholder="Referral UserName (Optional)" placeholderTextColor="#CCC" style={style.input} onChangeText={value=>this.setState({referal_username:value})}></TextInput>
                                    </View>
                                </View>
                                <View style={{marginTop:10}}>
                                    <View style={style.inputcontainer}>
                                        <AntDesign name="mail" color="#A2A2A2" size={RFValue(25,580)}></AntDesign>
                                        <TextInput placeholder="Email" placeholderTextColor="#CCC" style={style.input} onChangeText={value=>this.setState({email:value})}></TextInput>
                                    </View>
                                    {
                                        this.state.error.email && (
                                            <Text style={style.error}>{this.state.error.email}</Text>
                                        )
                                    }
                                </View>
                                <View style={{marginTop:10}}>
                                    <View style={style.inputcontainer}>
                                        <AntDesign name="lock" color="#A2A2A2" size={RFValue(25,580)}></AntDesign>
                                        <TextInput placeholder="Password" secureTextEntry={true} placeholderTextColor="#CCC" style={style.input} onChangeText={value=>this.setState({password:value})}></TextInput>
                                    </View>
                                    {
                                        this.state.error.password && (
                                            <Text style={style.error}>{this.state.error.password}</Text>
                                        )
                                    }
                                </View>
                                <View style={{marginTop:10}}>
                                    <View style={style.inputcontainer}>
                                        <AntDesign name="lock" color="#A2A2A2" size={RFValue(25,580)}></AntDesign>
                                        <TextInput placeholder="Retype Password" secureTextEntry={true} placeholderTextColor="#CCC" style={style.input}  onChangeText={value=>this.setState({confirm_pass:value})}></TextInput>
                                    </View>
                                    {
                                        this.state.error.confirm_pass && (
                                            <Text style={style.error}>{this.state.error.confirm_pass}</Text>
                                        )
                                    }
                                </View>
                                <View style={{marginTop:10}}>
                                    <View style={style.inputcontainer}>
                                        <TextInput placeholder="State Of Resident" placeholderTextColor="#CCC" style={style.input} onChangeText={value=>this.setState({resident:value})}></TextInput>
                                    </View>
                                    {
                                        this.state.error.resident && (
                                            <Text style={style.error}>{this.state.error.resident}</Text>
                                        )
                                    }
                                </View>
                                <View style={{marginTop:10}}>
                                    <View style={style.inputcontainer}>
                                        <Feather name="phone" color="#A2A2A2" size={RFValue(25,580)}></Feather>
                                        <TextInput placeholder="Phone Number" placeholderTextColor="#CCC" keyboardType="number-pad" style={style.input} onChangeText={value=>this.setState({phonenumber:value})}></TextInput>
                                    </View>
                                    {
                                        this.state.error.phonenumber && (
                                            <Text style={style.error}>{this.state.error.phonenumber}</Text>
                                        )
                                    }
                                </View>
                                <View style={{marginTop:10,minHeight:50}}>
                                    <Dropdown 
                                    items={
                                        this.getsportsbook()
                                    }
                                    placeholder="My SportsBook" 
                                    placeholderStyle={{color:'#CCC'}} 
                                    style={{borderWidth:1,flex:1,borderColor:'#C63032'}}
                                    defaultValue={this.state.sports_book}
                                    onChangeItem={item=>this.setState({
                                        sports_book:item.value
                                    })}
                                    zIndex={100}
                                    itemStyle={{justifyContent:'flex-start'}}
                                    containerStyle={{flex:1,height:50}}></Dropdown>
                                    {/* <View style={style.inputcontainer}>
                                        <TextInput placeholder="My Story Book" placeholderTextColor="#CCC" style={style.input}></TextInput>
                                    </View> */}
                                </View>
                                <View style={{marginTop:10,flexDirection:'row'}}>
                                    <CheckBox value={this.state.checked} onValueChange={checked=>this.setState({checked})} style={{borderColor:'#C63032'}}></CheckBox>
                                    <Text style={style.text}>I agree to letting liveline call options and notifications to my phone</Text>
                                </View>
                                {
                                    this.state.error.terms && (
                                        <Text style={style.error}>{this.state.error.terms}</Text>
                                    )
                                }
                                <View style={{marginTop:10}}>
                                    <TouchableOpacity style={style.buttoncontainer} onPress={this.submit}>
                                        <View style={{width:RFValue(25,580)}}></View>
                                        <Text style={style.buttontext}>Submit</Text>
                                        <MaterialIcons name="arrow-right-alt" color="white" size={RFValue(25,580)}></MaterialIcons>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        
                    </ScrollView>
                    <AlertElement error={this.state.errormessage} seterror={()=>this.setState({errormessage:""})}></AlertElement>
                    <Loading visible={this.state.loading} textContent={'Submiting ... '} textStyle={{color:'white'}}></Loading>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const mapstatetoprops = (state) => ({
    betlist:state.betlist
})

export default connect(mapstatetoprops)(Signup)

const style = StyleSheet.create({
    container:{
        flex:1
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
        borderRadius:5,
        alignItems:'center',
        marginTop:30,
        display:'flex',
        justifyContent:'space-between',
        flexDirection:'row'
    },
    buttontext:{
        color:'white',
        fontSize:RFValue(16,580),
        textTransform:'uppercase'
    },
    input:{
        borderColor:'#C63032',
        borderWidth:1,
        padding:15,
        fontSize:RFValue(16,580),
        borderRadius:5,
        flex:1
    },
    go:{
        borderRadius:30,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#C63032',
        padding:10
    },
    text:{
        color:'#C63032',
        fontSize:RFValue(14,580),
        textAlign:'center'
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
        flex:1,
        borderWidth:1,
        borderColor:'#C63032'
    },
    input:{
        fontSize:RFValue(16,580),
        marginLeft:15,
        flex:1
    },
    error:{
        color:'red'
    }
})

