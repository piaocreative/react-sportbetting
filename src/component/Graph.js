import React from 'react'
import Modal from 'react-native-modal'
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native'
import {LineChart} from 'react-native-chart-kit'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'
import {RFValue} from 'react-native-responsive-fontsize'
import AntDesign from 'react-native-vector-icons/AntDesign'


export default function Graph({info,isopen,setopen,team,type})
{
    const gethistory = () => {
        let index = info.teams.indexOf(team)
        let list = [];

        for(let item in info.history)
        {
            if(info.history[item][type])
            {
                if(type == 'moneyline')
                {
                    list.push(Number(info.history[item].moneyline[index]))
                }
                else
                {
                    list.push(Number(info.history[item][type].points[index]))
                }    
            }
        }

        return list
    }

    const getlabel = () => {
        let history = gethistory();
        let list = []
        for(let item in history)
        {
            list.push(item)
        }

        return list;
    }

    const getkeys = () => {
        let history = gethistory();
        let list = []
        for(let item in history)
        {
            list.push(Number(item))
        }

        return list;
    }

    
    
  
    return (
        <Modal 
            isVisible={isopen}
            onBackdropPress={()=>setopen()}
        >
            {
                info && (
                    <View style={style.container}>
                        <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <View style={{marginRight:15}}></View>
                            <Text style={[style.title,{flex:1}]}>{team}</Text>
                            <TouchableOpacity onPress={()=>setopen()} style={{marginLeft:15}}>
                                <AntDesign name="close" size={RFValue(25,580)}></AntDesign>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1,marginTop:15}}>
                            <LineChart
                                width={wp('80')}
                                height={hp('50')}
                                data={{
                                    labels:getlabel(),
                                    datasets:[
                                        {data:gethistory()}
                                    ]
                                }}
                                chartConfig={{
                                    color:()=>'#C63032',
                                    backgroundColor:()=>'white',
                                    backgroundGradientFrom:'white',
                                    backgroundGradientTo:'white',
                                    style:{
                                        backgroundColor:'#DDD',
                                        borderWidth:1,
                                        borderColor:'#C63032'
                                    },
                                    labelColor:()=>'black',
                                    strokeWidth:1
                                }}
                                withInnerLines={false}
                                withOuterLines={true}
                                bezier
                                fromZero={true}
                                withVerticalLabels={false}
                                withHorizontalLabels={true}
                                hidePointsAtIndex={getkeys()}
                            ></LineChart>
                        </View>
                    </View>
                )
            }
        </Modal>
    )
}

const style = StyleSheet.create({
    container:{
        backgroundColor:'white',
        padding:15,
        height:hp('70')
    },
    title:{
        color:'#333',
        fontSize:RFValue(14,580),
        textAlign:'center',
        fontWeight:'bold'
    }
})