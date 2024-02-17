import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';

const Exemplo = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  }
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  }
  const handleConfirm = (date) => {
    console.warn("a data é: ", date.toLocaleString("pt-BR"));
    hideDatePicker(); 
  }
  const getDataAtual = () => {
    var data = new Date()
    data.setDate(data.getDate() + 1);
    return data;
  }
  const getDataMax = () => {
    var data = new Date()
    data.setDate(data.getDate() + 20);
    return data;
  }

  return (
    <View style={styles.container}> 
    <Button title="Selecionar data" onPress={showDatePicker}/>
    <DateTimePicker
      isVisible={isDatePickerVisible}
      mode="datetime"
      onConfirm={handleConfirm}
      onCancel={hideDatePicker}
      //deixa agendar no mínimo um dia de antecedencia e no maximo 20 dias
      minimumDate={getDataAtual()}
      maximumDate={getDataMax()}
    />
    </View>
  )
}



export default Exemplo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
});
