import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, Pressable, Modal, TextInput, TouchableOpacity, 
         View, KeyboardAvoidingView, Image, Alert} from 'react-native';
import {auth, firestore, storage} from "../firebase";
import meuestilo from "../meuestilo";
import { Vacina } from "../model/Vacina";
import { FlatList } from "react-native-gesture-handler";

const ManterVacina = (props) => {
    const [formVacina, setFormVacina] = useState<Partial<Vacina>>({})
    const navigation = useNavigation();
    const [vacinas, setVacinas] = useState<Vacina[]>([]);
    const [loading,setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(true);


    const vacinaRef = firestore.collection('Usuario').doc(auth.currentUser?.uid)
                        .collection('Vacina')

    const limparFormulario=()=>{
        setFormVacina({});
    }

    const cancelar = () => {
        setFormVacina({});
    }

    const salvar = async() => {        
        const vacina = new Vacina(formVacina);        

        if (vacina.id === undefined){ 
            const vacinaRefComId = vacinaRef.doc();
            vacina.id = vacinaRefComId.id;

            console.log(vacina.id);

            vacinaRefComId.set(vacina.toFirestore()).then(() => {
                alert("Vacina " + vacina.nome + " adicionado!")
                limparFormulario();
            });
        } else {
            const vacinaRefComId = vacinaRef.doc(vacina.id);
            vacinaRefComId.update(vacina.toFirestore())
                .then(() => {
                    alert("Vacina " + vacina.nome + " atualizado!")
                    limparFormulario();
                });
        }
        
        
    }

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
            setIsRefreshing(false);
        });
        return () => subscriber();
    }, [vacinas])

    const editVacina = async (vacina: Vacina) => {       
        const result = firestore.collection('Usuario').doc(auth.currentUser?.uid)
        .collection('Vacina').doc(Vacina.id)
            .onSnapshot(documentSnapshot => {
                const vacina = new Vacina(documentSnapshot.data());                
                setFormVacina(vacina);
                console.log(vacina); 
            });
        return () => result();
    }

    const deleteVacina = async(vacina: Vacina) => {
        Alert.alert(
            `Apagar Vacina "${vacina.nome}?" `,
            "Essa ação não pode ser desfeita!",
            [
                {
                    text: "Cancelar"
                },
                {
                    text: "Excluir",
                    onPress: async () => {
                        const res = await vacinaRef.doc(vacina.id).delete()
                        .then(() => {
                            alert("Vacina " + vacina.nome + " excluído!");
                            limparFormulario();
                            setIsRefreshing(true);
                        })
                    }
                }
            ]
        );
    }


    const renderVacinas = ({ item }: { item: Vacina}) => {
        return (
            <View style={meuestilo.item} key={item.id}>
                <Pressable 
                    onLongPress={() => deleteVacina(item) }
                    onPress={() => editVacina(item) }
                >
                    <View style={meuestilo.alinhamentoLinha}>
                        <View style={meuestilo.alinhamentoColuna}>
                            <Text style={meuestilo.title}>Vacina: {item.nome}</Text>
                        </View>
                    </View>
                </Pressable>
            </View>
        )
    }


    return(
        <KeyboardAvoidingView style={meuestilo.container}>
           

            <View style={meuestilo.inputContainer}>
                <TextInput 
                    placeholder="Vacina"
                    style={meuestilo.input}
                    value={formVacina.nome}
                    onChangeText={nome => setFormVacina({
                        ...formVacina, 
                        nome: nome
                    })}
                />
                <TextInput 
                    placeholder="Dose"
                    style={meuestilo.input}
                    value={formVacina.dose}
                    onChangeText={dose => setFormVacina({
                        ...formVacina, 
                        dose: dose
                    })}
                />
            </View>

            <View style={meuestilo.buttonContainer}>
                <TouchableOpacity onPress={cancelar} style={meuestilo.button}>
                    <Text style={meuestilo.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={salvar} style={[ meuestilo.button, meuestilo.buttonOutline ]}>
                    <Text style={meuestilo.buttonOutlineText}>Salvar</Text>
                </TouchableOpacity>
            </View>

            <FlatList 
                data={vacinas}
                renderItem={renderVacinas}
                keyExtractor={item => item.id.toString()}
                refreshing={isRefreshing}
            />

        </KeyboardAvoidingView>
    );
}

export default ManterVacina;