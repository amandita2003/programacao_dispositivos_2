import React, {useState} from 'react'
import Modal from "react-native-modal"
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import Lista from './Lista';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalListaVisible, setModalListaVisible] = useState(false)
  const [itemLista, setItemLista] = useState({...itemLista, id:"", title:""}) 

  return(
    <View style={styles.modalview}>
     <Modal //modal da lista
    animationIn={"bounceInUp"}
    animationInTiming={1000}
    isVisible={modalListaVisible}
    onRequestClose={()=>{
    setModalVisible(!modalListaVisible)
}}
>
    <View>
    <Lista
    setModalListaVisible={setModalListaVisible}
    setItemLista={setItemLista}
    >

    </Lista>
    </View>
  </Modal>
  <Text style={styles.textstyle}>ID: {itemLista.id}</Text>
  <Text style={styles.textstyle}>Cidade: {itemLista.title}</Text>
  <Pressable onPress={()=> setModalListaVisible(true)}>
    <Text style={styles.textstyle}>Abrir Lista</Text>
  </Pressable>
  </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalview:{
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
    marginTop: 150,
    marginBottom: 150,
    marginRight: 30,
    marginLeft: 30,
    borderRadius: 10,
    fontWeight: 300,
  },
  textstyle:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
