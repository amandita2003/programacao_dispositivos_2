import React, { useState, useEffect } from "react";
import {auth, firestore} from "../firebase";
import meuestilo from "../meuestilo";
import { Proprietario } from "../model/Proprietario";
import {Text, FlatList, View, ActivityIndicator, Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ListarProprietarios = () => {
    const [loading,setLoading] = useState(true);
    const [proprietarios, setProprietarios] = useState<Proprietario[]>([]);
    const proprietarioRef = 
      firestore.collection('Usuario').doc(auth.currentUser?.uid)
      .collection('Proprietario');

    useEffect(() => {
        const subscriber = proprietarioRef
        .onSnapshot((querySnapshot) => {
            const proprietarios = [];
            querySnapshot.forEach((documentSnapshot) => {
                proprietarios.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id
                });
            });
            setProprietarios(proprietarios);
            setLoading(false);
        });
        return () => subscriber();
    }, [proprietarios])

    if (loading) {
        return <ActivityIndicator />;
    }

    const Item = ({ item }) => (
        <View style={meuestilo.item} >
            <View style={meuestilo.alinhamentoLinha}>
                <View style={meuestilo.alinhamentoColuna}>
                    <Text style={meuestilo.title}>Proprietario: {item.nome}</Text>
                </View>
            </View>
        </View>
    );
    
    const renderItem = ({ item }) => <Item item={item} />

    return (
        <SafeAreaView style={meuestilo.containerlistar}>
            <FlatList 
                data={proprietarios}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );
}

export default ListarProprietarios;