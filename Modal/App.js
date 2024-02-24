import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Modal, Button } from "react-native";

function ModalTeste() {
  const [isModalVisible, setModalVisible] = useState(false);
  const switchModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <View style={styles.container}>
      <Button title="Clique aqui" onPress={switchModal} />
      <Modal visible={isModalVisible}>
        <View style={styles.modalView}>
          <Text>Olá 5TADS</Text>
          <Button title="sair" onPress={switchModal}/>
        </View>
      </Modal>
    </View>
  );
}

export default ModalTeste;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
