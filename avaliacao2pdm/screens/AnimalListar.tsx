import React, { useState, useEffect } from "react";
import {auth, firestore} from "../firebase";
import meuestilo from "../meuestilo";
import { Animal } from "../model/Animal";
import {Text, FlatList, View, ActivityIndicator, Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ListarAnimais = () => {
    const [loading,setLoading] = useState(true);
    const [animais, setAnimais] = useState<Animal[]>([]);
    const animalRef = 
      firestore.collection('Usuario').doc(auth.currentUser?.uid)
      .collection('Animal');

    useEffect(() => {
        const subscriber = animalRef
        .onSnapshot((querySnapshot) => {
            const animais = [];
            querySnapshot.forEach((documentSnapshot) => {
                animais.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id
                });
            });
            setAnimais(animais);
            setLoading(false);
        });
        return () => subscriber();
    }, [animais])

    if (loading) {
        return <ActivityIndicator />;
    }

    const Item = ({ item }) => (
        <View style={meuestilo.item} >
            <View style={meuestilo.alinhamentoLinha}>
                <Image style={{ height: 80, width: 80, borderRadius: 10 }} source={{ uri: item.urlfoto}} />

                <View style={meuestilo.alinhamentoColuna}>
                    <Text style={meuestilo.title}>Nome: {item.nome}</Text>
                    <Text style={meuestilo.title}>Especie: {item.especie}</Text>
                    <Text style={meuestilo.title}>Sexo: {item.sexo}</Text>
                    <Text style={meuestilo.title}>Data Nasc: {item.datanasc}</Text>
                </View>
            </View>
        </View>
    );
    
    const renderItem = ({ item }) => <Item item={item} />

    return (
        <SafeAreaView style={meuestilo.containerlistar}>
            <FlatList 
                data={animais}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );







}

export default ListarAnimais;