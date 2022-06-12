import React,{useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {createStackNavigator} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {Signin,Signup,Home,Events,EventDetail,AlertParamaters,Pulse,Star,Me,Settings,History,LimitOrderAlert,Articles,Membership,ArticleInfo,About,LimitOrder} from '../screens'
import TabBar from './TabBar'
import {setnotification} from '../service/userservice'
import {getsportslist} from '../service/sportservice'
import {setbetlist} from '../redux/action/betlist'
import PushNotification from 'react-native-push-notification'
import notificationinit from '../notificationconfig'
import messaging from '@react-native-firebase/messaging'
import moment from 'moment'
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
let timer = null;
let index = 0;
const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props)=><TabBar {...props}></TabBar>}
        >
            <Tab.Screen name="Home" component={Home}></Tab.Screen>
            <Tab.Screen name="Events" component={Events}></Tab.Screen>
            <Tab.Screen name="EventDetail" component={EventDetail}></Tab.Screen>
            <Tab.Screen name="AlertParams" component={AlertParamaters}></Tab.Screen>
            <Tab.Screen name="Pulse" component={Pulse}></Tab.Screen>
            <Tab.Screen name="Star" component={Star}></Tab.Screen>
            <Tab.Screen name="Me" component={Me}></Tab.Screen>
            <Tab.Screen name="Settings" component={Settings}></Tab.Screen>
            <Tab.Screen name="History" component={History}></Tab.Screen>
            <Tab.Screen name="Alert" component={LimitOrderAlert}></Tab.Screen>
            <Tab.Screen name="Articles" component={Articles}></Tab.Screen>
            <Tab.Screen name="ArticleInfo" component={ArticleInfo}></Tab.Screen>
            <Tab.Screen name="Membership" component={Membership}></Tab.Screen>
            <Tab.Screen name="LimitOrder" component={LimitOrder}></Tab.Screen>
            <Tab.Screen name="About" component={About}></Tab.Screen>
        </Tab.Navigator>
    )
}

const Navigation = () =>
{  

    const {userinfo,token} = useSelector(state=>state.auth),
    {date} = useSelector(state=>state.betlist),
    dispatch = useDispatch();

    const alert = useSelector(state=>state.alert)
 
    const validatealert = (data) => {
        for(let item in alert)
        {
            if((alert[item].team1 == data.teams[0] && alert[item].team2 == data.teams[1]) || (alert[item].team1 == data.teams[1] && alert[item].team2 == data.teams[0]))
            {
                let index = data.teams.indexOf(alert[item].team)
                if(alert[item].commencetime == data.commence_time && userinfo.alert_enable)
                {
                    if(alert[item].type == 'MONEYLINE')
                    {
                        if(data.moneyline[index] > alert[item].value)
                        {
                            PushNotification.localNotification({
                                channelId:"sportbetting",
                                message:"MoneyLine for " + alert[item].team + " has been limited with " + data.moneyline[index] + " for game " + data.teams[0] + '@' + data.teams[1]
                            })
                        }                        
                    }
                    else if(alert[item].type == 'SPREAD')
                    {
                        if(data.spreads['points'][index] > alert[item].value)
                        {
                            PushNotification.localNotification({
                                channelId:'sportbetting',
                                message:"Spread for " + alert[item].team + " has been limited with " + data.spreads.points[index] + " for game " + data.teams[0] + '@' + data.teams[1]
                            })
                        }

                        if(data.spreads['odds'][index] > alert[item].odd)
                        {
                            PushNotification.localNotification({
                                channelId:'sportbetting',
                                message:"Spread Odd for " + alert[item].team + " has been limited with " + data.spreads.odds[index] + " for game " + data.teams[0] + '@' + data.teams[1]
                            })
                        }
                    }
                    else if(alert[item].type == 'TOTAL')
                    {
                        if(data.totals['points'][index] > alert[item].value)
                        {
                            PushNotification.localNotification({
                                channelId:'sportbetting',
                                message:"Total for " + alert[item].team + " has been limited with " + data.totals.points[index] + " for game " + data.teams[0] + '@' + data.teams[1]
                            })
                        }

                        if(data.totals['odds'][index] > alert[item].odd)
                        {
                            PushNotification.localNotification({
                                channelId:'sportbetting',
                                message:"Total Odd for " + alert[item].team + " has been limited with " + data.totals.odds[index] + " for game " + data.teams[0] + '@' + data.teams[1]
                            })
                        }
                    }
                }
            }
        }
    }

    useEffect(()=>{
        if(token)
        {
            getsportslist(token,moment(date).format('YYYY-MM-DD'),userinfo.sports_book).then(res=>{
                console.log(res.data)
                if(res.data.success)
                {
                    dispatch(setbetlist(res.data.result))
                }
            }).catch(err=>console.log('error',err))

            if(timer)
            {
                window.clearInterval(timer)
            }
            timer = window.setInterval(()=>{                
                getsportslist(token,moment(date).format('YYYY-MM-DD'),userinfo.sports_book).then(res=>{
                    if(res.data.success)
                    {
                        dispatch(setbetlist(res.data.result))
                    }
                    else
                    {
                        window.clearInterval(timer)
                    }
                }).catch(err=>console.log('err',err))
            },5000)
        }
        else
        {
            if(timer)
            {
                window.clearInterval(timer)
            }
        }

        return () => {
            if(timer)
            {
                window.clearInterval(timer)
            }
        }
    },[token,userinfo])

    const requestUserPermission = async(token) => {
        const authStatus = await messaging().requestPermission()
        const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL
        
        console.log('enabled',enabled)
        if(enabled)
        {
            getFcmToken(token)
        }
    }

    const getFcmToken = async(token)=>{
        const fcmToken = await messaging().getToken()
        if(fcmToken)
        {
            console.log("Your Firebase Token is:", fcmToken);
            setnotification(token,fcmToken)
        }
        else
        {
            console.log("Failed", "No token received");
        }
    }

    useEffect(()=>{
        if(token)
        {
            notificationinit();
            requestUserPermission(token);
        }
    },[token])
    return (
        <Stack.Navigator
             initialRouteName="Signin"
             screenOptions={{
                    gestureEnabled: false
                }}>
                <Stack.Screen
                    name="Signin"
                    component={Signin}
                    options={{header:()=>null}}
                ></Stack.Screen>
                <Stack.Screen
                    name="Signup"
                    component={Signup}
                    options={{header:()=>null}}
                ></Stack.Screen>
                <Stack.Screen
                    name="Home"
                    component={TabNavigator}
                    options={{header:()=>null}}
                ></Stack.Screen>
            </Stack.Navigator>
    )
}

export default Navigation