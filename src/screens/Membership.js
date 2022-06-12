import React from 'react'
import {View,Platform,StyleSheet,Text,TouchableOpacity,ScrollView} from 'react-native'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import Feather from 'react-native-vector-icons/Feather'
import {GooglePay} from 'react-native-google-pay'
import IonIcons from 'react-native-vector-icons/Ionicons'
import {PaymentRequest} from 'react-native-payments'
import {updatebalance} from '../service/alertservice'
import {useSelector,useDispatch} from 'react-redux'
import {setprofileinfo} from '../redux/action/auth'

export default function Membership({navigation})
{
    const allowedCardNetworks = ['VISA', 'MASTERCARD'];
    const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];
    const {userinfo,token} = useSelector(state=>state.auth)
    const dispatch = useDispatch()

    const payment = (amount,balance,free) => {
        
        if(Platform.OS == "android")
        {
            let requestData = {
                cardPaymentMethod: {
                    tokenizationSpecification: {
                        type: 'DIRECT',
                        publicKey:"BCR2DN6TV6A773SC"
                    },
                    allowedCardNetworks,
                    allowedCardAuthMethods,
                },
                transaction: {
                    totalPrice: amount + "",
                    totalPriceStatus: 'FINAL',
                    currencyCode: 'USD',
                },
                merchantName: 'LiveLine Alerts LLC',
            };
            GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST)
            GooglePay.isReadyToPay(allowedCardNetworks,allowedCardAuthMethods).then((ready)=>{
                console.log('ready',ready)
                if(ready)
                {
                    GooglePay.requestPayment(requestData).then((token)=>{
                        console.log('token',token)
                        updatebalance(balance,free,token).then(res=>{
                            if(res.data.success)
                            {
                                dispatch(setprofileinfo({free:res.data.user.free,balance:res.data.user.balance}))
                            }
                        })
                    })
                }
            })
        }
        else
        {
            const METHOD_DATA = [{
                supportedMethods: ['apple-pay'],
                data: {
                  merchantIdentifier: 'merchant.com.your-app.namespace',
                  supportedNetworks: ['visa', 'mastercard', 'amex'],
                  countryCode: 'US',
                  currencyCode: 'USD'
                }
              }];
              const DETAILS = {
                id: 'basic-example',
                displayItems: [
                  {
                    label: 'Movie Ticket',
                    amount: { currency: 'USD', value: amount }
                  }
                ],
                total: {
                  label: 'Merchant Name',
                  amount: { currency: 'USD', value: amount }
                }
              };

             const paymentRequest = new PaymentRequest(METHOD_DATA,DETAILS) 
             paymentRequest.canMakePayments().then(canMakePayment=>{
                if(canMakePayment)
                {
                    paymentRequest.show().then(paymentresponse=>{
                        paymentresponse.complete().then(res=>{
                            updatebalance(balance,free,token).then(res=>{
                                if(res.data.success)
                                {
                                    dispatch(setprofileinfo({free:res.data.user.free,balance:res.data.user.balance}))
                                }
                            })
                        })
                    })
                }
             })
             
        }
        
    }


    return(
        <View source={require('../assets/images/bg.png')} style={{width:wp('100%'),height:hp('100%')}}>
            <View style={style.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <IonIcons name="arrow-back" size={RFValue(22,580)} color="white"></IonIcons>
                </TouchableOpacity>
                <Text style={style.headertext}>MemberShip</Text>
                <View style={{width:RFValue(22,580)}}></View>
            </View>
            <ScrollView>
                <View style={style.container}>
                    <Text style={style.title}>Unlimited Membership</Text>
                    <View style={style.content}>
                        <View style={style.iteminfo}>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:RFValue(16,580),color:'black',fontWeight:'bold'}}>1 Month</Text>
                                <Text style={{fontSize:RFValue(14,580),color:'black'}}>24.99$</Text>
                            </View>
                            <TouchableOpacity style={[style.buy,{backgroundColor:'#C63032'}]} onPress={()=>payment(24.99,0,'+1 month')}>
                                <Feather name="shopping-cart" color="white" fontSize={RFValue(25,580)}></Feather>
                                <Text style={[style.buytext,{marginLeft:5}]}>Buy</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={style.iteminfo}>
                            <View style={{flex:1}}>
                                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{fontSize:RFValue(16,580),color:'black',fontWeight:'bold'}}>6 Months</Text>
                                    <Text style={{fontSize:RFValue(14,580),color:'black',textAlign:'center'}}>14.99$/Month</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={[style.buy,{backgroundColor:'#C63032'}]} onPress={()=>payment(89.94,0,'+6 months')}>
                                <Feather name="shopping-cart" color="white" fontSize={RFValue(25,580)}></Feather>
                                <Text style={[style.buytext,{marginLeft:5}]}>Buy</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={style.iteminfo}>
                            <View style={{flex:1}}>
                                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{fontSize:RFValue(16,580),color:'black',fontWeight:'bold'}}>Yearly</Text>
                                    <Text style={{fontSize:RFValue(14,580),color:'black'}}>88.88$</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={[style.buy,{backgroundColor:'#C63032'}]} onPress={()=>payment(88.88,0,'+1 year')}>
                                <Feather name="shopping-cart" color="white" fontSize={RFValue(25,580)}></Feather>
                                <Text style={[style.buytext,{marginLeft:5}]}>Buy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={[style.title,{marginTop:15}]}>Limited Membership</Text>
                    <View style={style.content}>
                        <View style={style.iteminfo}>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{fontSize:RFValue(16,580),color:'black',fontWeight:'bold',textAlign:'center'}}>Stack Of 15</Text>
                                <Text style={{fontSize:RFValue(14,580),color:'black'}}>9.00$</Text>
                            </View>
                            <TouchableOpacity style={[style.buy,{backgroundColor:'#C63032'}]} onPress={()=>payment(9,15,'')}>
                                <Feather name="shopping-cart" color="white" fontSize={RFValue(25,580)}></Feather>
                                <Text style={[style.buytext,{marginLeft:5}]}>Buy</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={style.iteminfo}>
                            <View style={{flex:1}}>
                                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{fontSize:RFValue(16,580),color:'black',fontWeight:'bold',textAlign:'center'}}>Stack Of 25</Text>
                                    <Text style={{fontSize:RFValue(14,580),color:'black'}}>15.00$</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={[style.buy,{backgroundColor:'#C63032'}]} onPress={()=>payment(15,25,'')}>
                                <Feather name="shopping-cart" color="white" fontSize={RFValue(25,580)}></Feather>
                                <Text style={[style.buytext,{marginLeft:5}]}>Buy</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={style.iteminfo}>
                            <View style={{flex:1}}>
                                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{fontSize:RFValue(16,580),color:'black',fontWeight:'bold',textAlign:'center'}}>Stack Of 50</Text>
                                    <Text style={{fontSize:RFValue(14,580),color:'black'}}>30.00$</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={[style.buy,{backgroundColor:'#C63032'}]} onPress={()=>payment(30,50,'')}>
                                <Feather name="shopping-cart" color="white" fontSize={RFValue(25,580)}></Feather>
                                <Text style={[style.buytext,{marginLeft:5}]}>Buy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        padding:24
    },
    header:{
        backgroundColor:'#C63032',
        padding:5,
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
    title:{
        fontSize:RFValue(16,580),
        color:'black',
        fontFamily:'Copperplate Bold'
    },
    content:{
        display:'flex',
        flexDirection:'row',
        marginTop:15
    },
    iteminfo:{
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
        marginBottom:16,
        marginRight:10,
        minHeight:200,
        flex:1
    },
    buy:{
        borderRadius:5,
        height:RFValue(30,580),
        justifyContent:'center',
        alignItems:'center',
        display:'flex',
        flexDirection:'row'
    },
    buytext:{
        color:'white',
        fontWeight:'bold',
        fontSize:RFValue(16,580)
    }
})