import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View, StyleSheet, FlatList, Text, Pressable, } from "react-native";
import { auth, firestore } from "../firebase";
import meuestilo from "../meuestilo";
import { Proprietario } from "../model/Proprietario";


export const EscolheProprietario = (props) => {
    const [loading, setLoading] = useState(true); 
    const [proprietarios, setProprietarios] = useState<Proprietario[]>([]); // Initial empty array
    const [isRefreshing, setIsRefreshing] = useState(true)

//  const racaRef = firestore.collection('Raca');
    const proprietarioRef = firestore.collection('Usuario').doc(auth.currentUser?.uid)
                        .collection('Proprietario');

    useEffect(() => {
        const subscriber = proprietarioRef
            .onSnapshot((querySnapshot) => {
                const proprietarios = [];
                querySnapshot.forEach((documentSnapshot) => {
                    proprietarios.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setProprietarios(proprietarios);
                setLoading(false);
            });
        return () => subscriber();
    }, [proprietarios]);


    if (loading) {
        return <ActivityIndicator />;
    }

    const closeModal = (bool, item) => {
        console.log(item)
        props.setModalProprietarioVisible(bool);
        props.setProprietario(item);
    }

    const renderProprietario = ({ item }: { item: Proprietario }) => {
        return <View style={styles.itemCard} key={item.id}>
            <Pressable
                style={({ pressed }) => [{ backgroundColor: pressed ? '#f1f1f1' : 'transparent' }, styles.listItem]}
                onLongPress={() => { closeModal(false, item) }}
                //onLongPress={() => deleteTipoUsuario(item)}
                //onPress={() => { editTipoUsuario(item) }}
                onPress={() => { closeModal(false, item) }}
            >
                {/* <Image source={{ uri: item.imageUri }} style={styles.itemImage} /> */}
                <View>
                    <Text>ID: {item.id}</Text>
                    <Text>Nome: {item.nome}</Text>
                    <Text>Sobrenome: {item.sobrenome}</Text>
                    <Text>CPF: {item.cpf}</Text>
                    <Text>Data de nascimento: {item.datanasc}</Text>
                </View>
            </Pressable>
        </View>
    }




    return (
        <SafeAreaView style={meuestilo.containerlistar}>
            <FlatList
                data={proprietarios}
                renderItem={renderProprietario}
                keyExtractor={(item) => item.id}
                refreshing={isRefreshing}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    emptyList: {
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontSize: 16
    },
    itemCard: {
        backgroundColor: '#fff',
        shadowColor: '#222222',
        shadowOffset: { height: 1, width: 1 },
    },
    itemImage: {
        width: 64,
        height: 64,
        marginLeft: 10,
        marginRight: 15,
        backgroundColor: '#eee'
    }
})


