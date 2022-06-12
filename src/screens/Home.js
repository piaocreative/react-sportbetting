import React,{useEffect,useState} from 'react';
import {View,StyleSheet,Text,ScrollView,StatusBar,TouchableWithoutFeedback} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import {getalertparams} from '../service/alertservice'
import {setalert} from '../redux/action/alert'
import {setfavourites} from '../redux/action/favourite'
import {setwatchlist} from '../redux/action/watchlist'
import {getwatchlist,getfavourite} from '../service/watchlistservice'
import {getarticle} from '../service/historyservice'
import {useDispatch,useSelector} from 'react-redux'
import HomeAlert from '../component/HomeAlert'
import Loading from 'react-native-loading-spinner-overlay'
import Dropdown from 'react-native-dropdown-picker'
import moment from 'moment'

let controller = null
export default function Home({navigation})
{
    const {token} = useSelector(state=>state.auth)
    const {data,sportlist,success} = useSelector(state=>state.betlist)
    const [articles,setarticles] = useState([])
    const [today,settoday] = useState('today')
    const dispatch = useDispatch()
    useEffect(()=>{
        if(token)
        {
            getalertparams(token).then(res=>{
                
                if(res.data.success)
                {
                    dispatch(setalert(res.data.data))
                }
            }).catch(err=>console.log('err',err))
            
            getwatchlist(token).then(res=>{
                if(res.data.success)
                {
                    dispatch(setwatchlist(res.data.data))
                }
            }).catch(err=>console.log('err',err))

            getarticle().then(res=>{
                if(res.data.success)
                {
                    setarticles(res.data.articles)
                }
            })

            getfavourite(token).then(res=>{
                if(res.data.success)
                {
                    dispatch(setfavourites(res.data.data))
                }
            })
        }
    },[token])

    const getsportlist = () => {
        let list = []
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1)
        for(let item in sportlist)
        {
            for(let iteminfo in data[sportlist[item].title])
            {
                if((today == 'today' && new Date(data[sportlist[item].title][iteminfo].commence_time * 1000).getDate() == new Date().getDate()) || today == 'all')
                {
                    list.push({info:data[sportlist[item].title][iteminfo],sport:sportlist[item]})
                }else if((today == 'tomorrow' && new Date(data[sportlist[item].title][iteminfo].commence_time * 1000).getDate() == tomorrow.getDate()) || today == 'all')
                {
                    list.push({info:data[sportlist[item].title][iteminfo],sport:sportlist[item]})
                }
            }
        }

        return list;
    }

    
    return (
        <TouchableWithoutFeedback style={{flex:1}} onPress={()=>controller.close()}>
        <View style={{width:wp('100'),height:hp('100'),flex:1,backgroundColor:'white'}}>
            <StatusBar backgroundColor="#C63032"></StatusBar>
            <View style={{position:'absolute',zIndex:1000,right:15,top:30,minHeight:200}}>
                <Dropdown
                    defaultValue={today}
                    controller={ref=>controller = ref}
                    items={[{label:'All',value:'all'},{label:'Today',value:'today'},{label:'Tomorrow',value:'tomorrow'}]}
                    containerStyle={{width:120,height:30,alignItems:'center',justifyContent:'center'}}
                    arrowColor="white"
                    labelStyle={{color:'black',textAlign:'right'}}
                    dropDownStyle={{zIndex:1000,display:'flex',width:120}}
                    onChangeItem={item=>settoday(item.value)}
                    style={{backgroundColor:'transparent',borderWidth:0,justifyContent:'center',display:'flex',flexDirection:'row'}}
                ></Dropdown>
            </View>
            
            <View style={style.container}>
                <View style={style.section}>
                    <TouchableOpacity style={style.sectionheader} onPress={()=>navigation.navigate('Events')}>
                        <Text style={style.text}>Events</Text>
                        
                    </TouchableOpacity>
                    {
                        getsportlist().length > 0 ? (
                            <ScrollView style={{flex:1}}>
                                {
                                    getsportlist().map((item,index)=>(
                                        <HomeAlert {...item} key={index} navigation={navigation} last={index === getsportlist().length - 1}></HomeAlert>
                                    ))
                                }
                            </ScrollView>
                        ):(
                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                <Text style={style.iteminfo}>There is no game</Text>
                            </View>
                        )
                    }
                    
                </View>
                <View style={[style.section,{overflow:'hidden'}]}>
                    <View style={style.sectionheader}>
                        <Text style={style.text}>Articles</Text>
                    </View>
                    <ScrollView style={{flex:1}}>
                        <View onStartShouldSetResponder={()=>true}>
                            {
                                articles.map((item,index)=>(
                                    <TouchableOpacity style={{padding:10,backgroundColor:index % 2 == 0?'white':'#DDD'}} key={item.id} onPress={()=>navigation.navigate('ArticleInfo',{info:item})}>
                                        <Text>
                                            <Text style={style.itemheader}>{item.title}:</Text>
                                            <Text style={style.iteminfo} numberOfLines={2}>{item.content.substr(0,120)} {item.content.length > 30?'...':''}</Text>
                                            <View style={{flexDirection:'row',display:'flex',alignItems:'center',marginTop:10}}>
                                                <EvilIcons name="calendar" color="#888" size={RFValue(25,580)} style={{marginLeft:10}}></EvilIcons>
                                                <Text style={style.iteminfo}>{moment(new Date(item.created_at)).format('MM/DD/YY')}</Text>
                                            </View> 
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    </ScrollView>
                </View>
            </View>

            {
                !success && (
                    <Loading visible={true}/>
                )
            }
        </View>
        </TouchableWithoutFeedback>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        paddingTop:24,
        paddingLeft:5,
        paddingRight:5,
        marginBottom:15
    },
    section:{
        flex:1,
        marginBottom:30,
        borderColor:'#C63032',
        borderWidth:1,
        borderRadius:8,
        shadowColor:'#C63032',
        shadowOffset:{width:5,height:5},
        shadowOpacity:0.5
    },
    sectionheader:{
        backgroundColor:'#C63032',
        display:'flex',
        flexDirection:'row',
        padding:5,
        justifyContent:'space-between',
        borderTopLeftRadius:8,
        borderTopRightRadius:8
    },
    text:{
        color:'white',
        fontSize:RFValue(14,580),
        fontFamily:'Copperplate Bold'
    },
    itemheader:{
        fontSize:RFValue(16,580),
        color:'#C63032'
    },
    iteminfo:{
        fontSize:RFValue(14,580),
        color:'black'
    }
})