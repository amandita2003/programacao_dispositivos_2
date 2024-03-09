import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";

const DATA = [
  {
    id: "4301602",
    title: "Bagé",
  },
  {
    id: "4304358",
    title: "Candiota",
  },
  {
    id: "4300034",
    title: "Aceguá",
  },
];

const Item = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.container}>{item.title}</Text>
  </TouchableOpacity>
);

const Lista = (props) => {
  const [selectedId, setSelectedId] = useState("");
  const closeModal = (bool, item) => {
    props.setModalListaVisible(bool);
    props.setItemLista(item);
  };

  const renderItem = ({ item }) => {
    return <Item item={item} onPress={() => closeModal(false, item)} />;
  };
  return (
    <SafeAreaView>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} //pega o id do item
        extraData={selectedId} //pega os dados além do id
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    marginTop: 80,
    marginBottom: 80,
    marginRight: 30,
    marginLeft: 30,
    borderRadius: 10,
    fontWeight: "bold",
    fontSize: 21,
  },
});
export default Lista;
