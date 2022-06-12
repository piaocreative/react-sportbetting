import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native'
import {RFValue} from 'react-native-responsive-fontsize'
import Modal from 'react-native-modal'

export default function AlertElement({error,seterror})
{
    return (
        <Modal isVisible={error != ""} onBackdropPress={()=>seterror("")}>
            <View style={style.modalinside}>
                <Text style={style.text}>{error}</Text>
                <TouchableOpacity style={style.btn} onPress={()=>seterror("")}>
                    <Text style={style.btntext}>OK</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const style = StyleSheet.create({
    modalinside:{
        backgroundColor:'white',
        borderRadius:10,
        padding:15,
        alignItems:'center'
    },
    text:{
        fontSize:RFValue(16,580),
        color:'#333',
        textAlign:'center'
    },
    btn:{
        backgroundColor:'#C63032',
        paddingLeft:15,
        paddingRight:15,
        paddingTop:5,
        paddingBottom:5,
        marginTop:15,
        borderRadius:5
    },
    btntext:{
        color:'white',
        fontSize:RFValue(14,580)
    }
})