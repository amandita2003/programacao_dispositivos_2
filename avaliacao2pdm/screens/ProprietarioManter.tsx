import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, Pressable, Modal, TextInput, TouchableOpacity, 
         View, KeyboardAvoidingView, Image, Alert} from 'react-native';
import {auth, firestore, storage} from "../firebase";
import meuestilo from "../meuestilo";
import { Proprietario } from "../model/Proprietario";
import { FlatList } from "react-native-gesture-handler";

const ManterProprietario = (props) => {
    const [formProprietario, setFormProprietario] = useState<Partial<Proprietario>>({})
    const navigation = useNavigation();
    const [proprietarios, setProprietarios] = useState<Proprietario[]>([]);
    const [loading,setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(true);


    const proprietarioRef = firestore.collection('Usuario').doc(auth.currentUser?.uid)
                        .collection('Proprietario')

    const limparFormulario=()=>{
        setFormProprietario({});
    }

    const cancelar = () => {
        setFormProprietario({});
    }

    const salvar = async() => {        
        const proprietario = new Proprietario(formProprietario);        

        if (proprietario.id === undefined){ 
            const proprietarioRefComId = proprietarioRef.doc();
            proprietario.id = proprietarioRefComId.id;

            console.log(proprietario.id);

            proprietarioRefComId.set(proprietario.toFirestore()).then(() => {
                alert("Proprietario " + proprietario.nome + " adicionado!")
                limparFormulario();
            });
        } else {
            const proprietarioRefComId = proprietarioRef.doc(proprietario.id);
            proprietarioRefComId.update(proprietario.toFirestore())
                .then(() => {
                    alert("Proprietario " + proprietario.nome + " atualizado!")
                    limparFormulario();
                });
        }
        
        
    }

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
            setIsRefreshing(false);
        });
        return () => subscriber();
    }, [proprietarios])

    const editProprietario = async (proprietario: Proprietario) => {       
        const result = firestore.collection('Usuario').doc(auth.currentUser?.uid)
        .collection('Proprietario').doc(Proprietario.id)
            .onSnapshot(documentSnapshot => {
                const proprietario = new Proprietario(documentSnapshot.data());                
                setFormProprietario(proprietario);
                console.log(proprietario); 
            });
        return () => result();
    }

    const deleteProprietario = async(proprietario: Proprietario) => {
        Alert.alert(
            `Apagar Proprietario "${proprietario.nome}?" `,
            "Essa ação não pode ser desfeita!",
            [
                {
                    text: "Cancelar"
                },
                {
                    text: "Excluir",
                    onPress: async () => {
                        const res = await proprietarioRef.doc(proprietario.id).delete()
                        .then(() => {
                            alert("Proprietario " + proprietario.nome + " excluído!");
                            limparFormulario();
                            setIsRefreshing(true);
                        })
                    }
                }
            ]
        );
    }


    const renderProprietarios = ({ item }: { item: Proprietario}) => {
        return (
            <View style={meuestilo.item} key={item.id}>
                <Pressable 
                    onLongPress={() => deleteProprietario(item) }
                    onPress={() => editProprietario(item) }
                >
                    <View style={meuestilo.alinhamentoLinha}>
                        <View style={meuestilo.alinhamentoColuna}>
                            <Text style={meuestilo.title}>Proprietario: {item.nome}</Text>
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
                    placeholder="Proprietario"
                    style={meuestilo.input}
                    value={formProprietario.nome}
                    onChangeText={nome => setFormProprietario({
                        ...formProprietario, 
                        nome: nome
                    })}
                />
                <TextInput 
                    placeholder="Sobrenome"
                    style={meuestilo.input}
                    value={formProprietario.sobrenome}
                    onChangeText={sobrenome => setFormProprietario({
                        ...formProprietario, 
                        sobrenome: sobrenome
                    })}
                />
                <TextInput 
                    placeholder="cpf"
                    style={meuestilo.input}
                    value={formProprietario.cpf}
                    onChangeText={cpf => setFormProprietario({
                        ...formProprietario, 
                        cpf: cpf
                    })}
                />
                <TextInput 
                    placeholder="Data de nascimento"
                    style={meuestilo.input}
                    value={formProprietario.datanasc}
                    onChangeText={datanasc => setFormProprietario({
                        ...formProprietario, 
                        datanasc: datanasc
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
                data={proprietarios}
                renderItem={renderProprietarios}
                keyExtractor={item => item.id.toString()}
                refreshing={isRefreshing}
            />

        </KeyboardAvoidingView>
    );
}

export default ManterProprietario;