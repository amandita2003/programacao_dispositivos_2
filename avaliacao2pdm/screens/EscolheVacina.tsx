import React, { useState, useEffect } from "react";
import { ActivityIndicator, SafeAreaView, View, StyleSheet, FlatList, Text, Pressable, } from "react-native";
import { auth, firestore } from "../firebase";
import meuestilo from "../meuestilo";
import { Vacina } from "../model/Vacina";


export const EscolheVacina = (props) => {
    const [loading, setLoading] = useState(true); // Set loading to true
    const [vacinas, setVacinas] = useState<Vacina[]>([]); // Initial empty array
    const [isRefreshing, setIsRefreshing] = useState(true)

//  const racaRef = firestore.collection('Raca');
    const vacinaRef = firestore.collection('Usuario').doc(auth.currentUser?.uid)
                        .collection('Vacina');

    useEffect(() => {
        const subscriber = vacinaRef
            .onSnapshot((querySnapshot) => {
                const vacinas = [];
                querySnapshot.forEach((documentSnapshot) => {
                    vacinas.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });
                setVacinas(vacinas);
                setLoading(false);
            });
        return () => subscriber();
    }, [vacinas]);


    if (loading) {
        return <ActivityIndicator />;
    }

    const closeModal = (bool, item) => {
        console.log(item)
        props.setModalVacinaVisible(bool);
        props.setVacina(item);
    }

    const renderVacina = ({ item }: { item: Vacina }) => {
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
                    <Text>Vacina: {item.nome}</Text>
                    <Text>Dose: {item.dose}</Text>
                </View>
            </Pressable>
        </View>
    }




    return (
        <SafeAreaView style={meuestilo.containerlistar}>
            <FlatList
                data={vacinas}
                renderItem={renderVacina}
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


