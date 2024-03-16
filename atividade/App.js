import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import Lista from "./Lista";

const Tab = createBottomTabNavigator();
const instanciar = () => {
  alert("Login concluído");
};

export default function App() {
  
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Login"
          component={HomeScreen}
          options={{
            tabBarIcon: () => <Icon name="person" size={30} color="black" />,
          }}
        />
        <Tab.Screen
          name="Formulário"
          component={Formulario}
          options={{
            tabBarIcon: () => (
              <Icon name="list-circle" size={30} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Flatlist"
          component={Flatlist}
          options={{
            tabBarIcon: () => (
              <Icon name="list-outline" size={30} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
function HomeScreen() {
  const [isModalVisiblee, setModalVisiblee] = useState(false);
  const switchModal2 = () => {
    setModalVisiblee(!isModalVisiblee);
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={styles.texto}>Tela de login</Text>
      <TextInput style={styles.input} placeholder="E-mail"></TextInput>
      <TextInput style={styles.input} placeholder="Senha"></TextInput>
      <Button title="Entrar" onPress={switchModal2} />
      <Modal
        isVisible={isModalVisiblee}
        animationIn={"zoomInUp"}
        animationInTiming={1000}
        style={styles.modalView}
      >
        <Text>Login concluído</Text>
        <Button title="sair" onPress={switchModal2}/>
      </Modal>
    </View>
  );
}
function Formulario() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    console.warn("a data é: ", date.toLocaleString("pt-BR"));
    hideDatePicker();
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const switchModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Nome"></TextInput>
      <TextInput style={styles.input} placeholder="Federação"></TextInput>
      <Button title="Selecionar data" onPress={showDatePicker} />
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <Button title="Salvar" onPress={switchModal} />
      <Modal
        isVisible={isModalVisible}
        animationIn={"zoomInUp"}
        animationInTiming={1000}
        style={styles.modalView}
      >
        <Text>Salvo com sucesso</Text>
        <Button title="sair" onPress={switchModal}/>
      </Modal>
    </View>
  );
}
function Flatlist() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalListaVisible, setModalListaVisible] = useState(false);
  const [itemLista, setItemLista] = useState({
    ...itemLista,
    id: "",
    title: "",
  });
  return (
    <View style={styles.modalview}>
      <Modal //modal da lista
        animationIn={"bounceInUp"}
        animationInTiming={1000}
        isVisible={modalListaVisible}
        onRequestClose={() => {
          setModalVisible(!modalListaVisible);
        }}
      >
        <View>
          <Lista
            setModalListaVisible={setModalListaVisible}
            setItemLista={setItemLista}
          ></Lista>
        </View>
      </Modal>
      <Text style={styles.flatstyle}>ID: {itemLista.id}</Text>
      <Text style={styles.flatstyle}>Cidade: {itemLista.title}</Text>
      <Button title="Abrir lista" onPress={() => setModalListaVisible(true)}>
        <Text style={styles.flatstyle}>Abrir Lista</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  texto: {
    fontStyle: "normal",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#f06292",
    paddingVertical: 1,
    paddingHorizontal: 1,
    marginTop: 2,
    height: 40,
    borderRadius: 8,
    minWidth: 300,
  },
  flatstyle: {
    color: "purple",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 60,
    marginRight: 60,
    marginLeft: 60,
    marginBottom: 60,

  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFB6C1",
    marginTop: 70,
    marginRight: 70,
    marginLeft: 70,
    marginBottom: 70,
    borderRadius: 20,

  },
});
