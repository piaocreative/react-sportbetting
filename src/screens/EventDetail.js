import React,{useState,useEffect} from 'react'
import {View,ScrollView,StyleSheet,Text,TouchableOpacity,TextInput,KeyboardAvoidingView} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {useSelector,useDispatch} from 'react-redux'

export default function EventDetail({navigation,route})
{
    const info = route.params.eventinfo;
    const title = route.params.title;
    const {userinfo} = useSelector(state=>state.auth)
    const {sportsbook} = useSelector(state=>state.betlist)
    const [eventinfo,seteventinfo] = useState(info)

    const getsportsbook = () => {
        for(let item in sportsbook)
        {
            if(sportsbook[item].sitekey == userinfo.sports_book)
            {
                return sportsbook[item].sitename;
            }
        }
    }
    
    useEffect(()=>{
        seteventinfo(info)
    },[info])
    
    return (
        <KeyboardAvoidingView style={{flex:1,backgroundColor:'white'}} behavior="height">
            <View style={style.container}>
                <View style={style.header}>
                    <Text style={style.headertext}>{info.teams[0]} @ {info.teams[1]}</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{padding:24,marginBottom:90}}>
                        <View style={style.section}>
                            <View style={style.sectionheader}>
                                <Text style={style.text}>SPREAD</Text>
                                <TouchableOpacity style={[style.btn,{backgroundColor:'white',borderWidth:1,borderColor:'#C63032'}]}>
                                    <Text style={[style.btntext,{color:'#C63032'}]}>{getsportsbook()}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={style.sectioncontent}>
                                <View style={[style.sectionitem,{borderBottomWidth:0}]}>
                                    <View style={{display:'flex',flexDirection:'row',alignItems:'center',flex:1}}>
                                        <Text style={style.text}>{info.teams[0]}</Text>
                                        <Text style={style.input}>{eventinfo.spreads?eventinfo.spreads['points'][0] > 0?'+' + eventinfo.spreads['points'][0] + "":eventinfo.spreads['points'][0] + "":'-'}</Text>
                                    </View>
                                    <TouchableOpacity style={[style.btn,{width:wp('42')}]} onPress={()=>navigation.navigate('AlertParams',{type:'Spread',amount:eventinfo.spreads?eventinfo.spreads['points'][0]:0,eventinfo:eventinfo,title,team:info.teams[0]})}>
                                        <Text style={[style.btntext,{fontFamily:'Copperplate Bold'}]}>SET SPREAD LIMIT ORDER/ALERT</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[style.sectionitem,{borderBottomWidth:0}]}>
                                    <View style={{display:'flex',flexDirection:'row',flex:1,alignItems:'center'}}>
                                        <Text style={style.text}>{info.teams[1]}</Text>
                                        <TextInput style={style.input} value={eventinfo.spreads?eventinfo.spreads['points'][1] > 0?'+' + eventinfo.spreads['points'][1]:eventinfo.spreads['points'][1] + "":'-'} editable={false}></TextInput>
                                    </View>
                                    <TouchableOpacity style={[style.btn,{width:wp('42')}]} onPress={()=>navigation.navigate('AlertParams',{type:'Spread',amount:eventinfo.spreads?eventinfo.spreads['points'][1]:0,eventinfo:eventinfo,title,team:info.teams[1]})}>
                                        <Text style={[style.btntext,{fontFamily:'Copperplate Bold'}]}>SET SPREAD LIMIT ORDER/ALERT</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={style.section}>
                            <View style={style.sectionheader}>
                                <Text style={style.text}>TOTAL</Text>
                                <TouchableOpacity style={[style.btn,{backgroundColor:'white',borderWidth:1,borderColor:'#C63032'}]}>
                                    <Text style={[style.btntext,{color:'#C63032'}]}>{getsportsbook()}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={style.sectioncontent}>
                                <View style={[style.sectionitem,{borderBottomWidth:0}]}>
                                    <View style={{display:'flex',flexDirection:'row',alignItems:'center',flex:1}}>
                                        <Text style={style.text}>Over</Text>
                                        <TextInput style={style.input} value={eventinfo.totals?eventinfo.totals['points'][0] > 0?'+' + eventinfo.totals['points'][0]:eventinfo.totals['points'][0] + "":'-'} editable={false}></TextInput>
                                    </View>
                                    <TouchableOpacity style={[style.btn,{width:wp('42')}]} onPress={()=>navigation.navigate('AlertParams',{type:'Total',amount:eventinfo.totals?eventinfo.totals['points'][0]:0,eventinfo:eventinfo,title,team:info.teams[0]})}>
                                        <Text style={[style.btntext,{fontFamily:'Copperplate Bold'}]}>SET TOTAL LIMIT ORDER/ALERT</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[style.sectionitem,{borderBottomWidth:0}]}>
                                    <View style={{display:'flex',flexDirection:'row',alignItems:'center',flex:1}}>
                                        <Text style={style.text}>Under</Text>
                                        <TextInput style={style.input} value={eventinfo.totals?eventinfo.totals.points[1]>0?'+' + eventinfo.totals.points[1]:eventinfo.totals.points[1] + "":'-'} editable={false}></TextInput>
                                    </View>
                                    <TouchableOpacity style={[style.btn,{width:wp('42')}]} onPress={()=>navigation.navigate('AlertParams',{type:'Total',amount:eventinfo.totals?eventinfo.totals['points'][1]:0,eventinfo:eventinfo,title,team:info.teams[1]})}>
                                        <Text style={[style.btntext,{fontFamily:'Copperplate Bold'}]}>SET TOTAL LIMIT ORDER/ALERT</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={style.section}>
                            <View style={style.sectionheader}>
                                <Text style={style.text}>MONEYLINE</Text>
                                <TouchableOpacity style={[style.btn,{backgroundColor:'white',borderWidth:1,borderColor:'#C63032'}]}>
                                    <Text style={[style.btntext,{color:'#C63032'}]}>{getsportsbook()}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={style.sectioncontent}>
                                <View style={[style.sectionitem,{borderBottomWidth:0}]}>
                                    <View style={{display:'flex',flexDirection:'row',alignItems:'center',flex:1}}>
                                        <Text style={style.text}>{info.teams[0]}</Text>
                                        <TextInput style={style.input} value={eventinfo.moneyline?eventinfo.moneyline[0]>0?'+' + eventinfo.moneyline[0]:eventinfo.moneyline[0] + "":'-'} editable={false}></TextInput>
                                    </View>
                                    <TouchableOpacity style={[style.btn,{width:wp('42')}]} onPress={()=>navigation.navigate('AlertParams',{type:'MoneyLine',amount:eventinfo.moneyline?eventinfo.moneyline[0]:0,eventinfo:eventinfo,title,team:info.teams[0]})}>
                                        <Text style={[style.btntext,{fontFamily:'Copperplate Bold'}]}>SET ML LIMIT ORDER/ALERT</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[style.sectionitem,{borderBottomWidth:0}]}>
                                    <View style={{display:'flex',flexDirection:'row',flex:1,alignItems:'center'}}>
                                        <Text style={style.text}>{info.teams[1]}</Text>
                                        <TextInput style={style.input}  value={eventinfo.moneyline?eventinfo.moneyline[1] > 0?'+' + eventinfo.moneyline[1]:eventinfo.moneyline[1] + "":'-'} editable={false}></TextInput>
                                    </View>
                                    <TouchableOpacity style={[style.btn,{width:wp('42')}]} onPress={()=>navigation.navigate('AlertParams',{type:'MoneyLine',amount:eventinfo.moneyline?eventinfo.moneyline[1]:0,eventinfo:eventinfo,title,team:info.teams[0]})}>
                                        <Text style={[style.btntext,{fontFamily:'Copperplate Bold'}]}>SET ML LIMIT ORDER/ALERT</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                
            </View>
        </KeyboardAvoidingView>
    )
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    header:{
        display:'flex',
        alignItems:'center',
        backgroundColor:'#C63032',
        padding:5
    },
    headertext:{
        fontSize:RFValue(13,580),
        color:'white',
        textAlign:'center',
        fontFamily:'Copperplate Bold'
    },
    section:{
        marginBottom:30,
        backgroundColor:'white',
        borderColor:'#C63032',
        borderWidth:1,
        borderRadius:8,
        shadowColor:'#C63032',
        shadowOffset:{width:5,height:5},
        shadowOpacity:0.5,
        elevation:5,
        zIndex:100
    },
    sectionheader:{
        padding:2,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomColor:'#C63032',
        borderBottomWidth:1
    },
    text:{
        fontSize:RFValue(11,580),
        color:'black',
        flex:1
    },
    btn:{
        backgroundColor:'#C63032',
        paddingLeft:15,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
        borderRadius:5,
        display:'flex',
        marginLeft:20
    },
    btntext:{
        color:'white',
        fontSize:RFValue(10,580),
        textAlign:'center'
    },
    sectioncontent:{
        padding:2
    },
    sectionitem:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        padding:2,
        borderBottomColor:'#C63032',
        borderBottomWidth:1,
        alignItems:'center'
    },
    input:{
        padding:5,
        width:50,
        borderColor:'#C63032',
        borderWidth:1,
        borderRadius:5,
        marginLeft:10,
        marginRight:10,
        width:wp('12'),
        textAlign:'center',
        color:'black',
        height:30
    }
})