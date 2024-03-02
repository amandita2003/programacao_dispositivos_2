 import React, {useState} from "react";
import Modal from "react-native-modal";
import { Button, StyleSheet, Text, View, Image } from 'react-native';

function Modal2() {
  const [isModalVisible, setModalVisibleSucess] = useState(false);
  const [isModalVisiblee, setModalVisibleAtencao] = useState(false);
  const [isModalVisibleee, setModalVisibleAdve] = useState(false);

  const switchModalSucesso = () => {
    setModalVisibleSucess(!isModalVisible);
  };
  const switchModalAttention = () => {
    setModalVisibleAtencao(!isModalVisiblee);
  };
  const switchModalAdv = () => {
    setModalVisibleAdve(!isModalVisibleee);
  };

  return (
    <View style={styles.container}>
      <Button title="Sucesso" onPress={switchModalSucesso} />
      <Modal 
        isVisible={isModalVisible}
        animationIn={"bounceInUp"}
        animationInTiming={1000}
        backdropColor="black"
      >
        <View style={styles.modalview}>
          <Image source={require('./assets/mark2.gif')} style={styles.gifstyle}/>
          <Text>Sucesso</Text>
          <Button title="Voltar" onPress={switchModalSucesso} />
        </View>
      </Modal>
      <Button title="Atenção" onPress={switchModalAttention} />
      <Modal 
        isVisible={isModalVisiblee}
        animationIn={"bounceInUp"}
        animationInTiming={1000}
        backdropColor="black"
      >
        <View style={styles.modalview}>
          <Image source={require('./assets/attention.gif')} style={styles.gifstyle}/>
          <Text>Atenção</Text>
          <Button title="Voltar" onPress={switchModalAttention} />
        </View>
      </Modal>
      <Button title="Advertência" onPress={switchModalAdv} />
      <Modal 
        isVisible={isModalVisibleee}
        animationIn={"bounceInUp"}
        animationInTiming={1000}
        backdropColor="black"
      >
        <View style={styles.modalview}>
          <Image source={require('./assets/x.gif')} style={styles.gifstyle}/>
          <Text>Advertência</Text>
          <Button title="Voltar" onPress={switchModalAdv} />
        </View>
      </Modal>
      </View>
      
  )

}

export default Modal2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#836FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalview: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      marginTop: 150,
      marginBottom: 150,
      marginRight: 30,
      marginLeft: 30,
      borderRadius: 10,
      
  },
  gifstyle:{
    width: 130,
    height: 130,
  }
});
