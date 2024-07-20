import React, { useState, useEffect } from "react";
import {auth, firestore} from "../firebase";
import meuestilo from "../meuestilo";
import { Vacina } from "../model/Vacina";
import {Text, FlatList, View, ActivityIndicator, Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ListarVacinas = () => {
    const [loading,setLoading] = useState(true);
    const [vacinas, setVacinas] = useState<Vacina[]>([]);
    const vacinaRef = 
      firestore.collection('Usuario').doc(auth.currentUser?.uid)
      .collection('Vacina');

    useEffect(() => {
        const subscriber = vacinaRef
        .onSnapshot((querySnapshot) => {
            const vacinas = [];
            querySnapshot.forEach((documentSnapshot) => {
                vacinas.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id
                });
            });
            setVacinas(vacinas);
            setLoading(false);
        });
        return () => subscriber();
    }, [vacinas])

    if (loading) {
        return <ActivityIndicator />;
    }

    const Item = ({ item }) => (
        <View style={meuestilo.item} >
            <View style={meuestilo.alinhamentoLinha}>
                <View style={meuestilo.alinhamentoColuna}>
                    <Text style={meuestilo.title}>Vacina: {item.nome}</Text>
                </View>
            </View>
        </View>
    );
    
    const renderItem = ({ item }) => <Item item={item} />

    return (
        <SafeAreaView style={meuestilo.containerlistar}>
            <FlatList 
                data={racas}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );
}

export default ListarVacinas;