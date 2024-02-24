import React, {useState} from "react"
import Modal from "react-native-modal";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

function Modal2() {
  const [isModalVisible, setModalVisible] = useState(false)
  const switchModal = () => {
    setModalVisible(!isModalVisible);
  }
  return (
    <View style={styles.container}>
      <Button title="Clique aqui" onPress={switchModal} />
      <Modal isVisible={isModalVisible}
      animationIn={"zoomInUp"}
      animationInTiming={1000}
    
      >
        <View style={styles.modalView}>
          <Text>Olá 5TADS</Text>
          <Button title="sair" onPress={switchModal}/>
        </View>
      </Modal>
    </View>
  );
}

export default Modal2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFB6C1",
    marginTop: 60,
    marginRight: 60,
    marginLeft: 60,
    marginBottom: 60,
    borderRadius: 20,

  },
});
