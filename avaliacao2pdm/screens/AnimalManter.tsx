import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, Pressable, Modal, TextInput, TouchableOpacity, 
         View, KeyboardAvoidingView, Image, Alert} from 'react-native';
import {auth, firestore, storage} from "../firebase";
import meuestilo from "../meuestilo";
import { Animal } from "../model/Animal";
import * as ImagePicker from "expo-image-picker";
import { uploadBytes } from "firebase/storage";
import { FlatList, ScrollView } from "react-native-gesture-handler";

import { EscolheVacina } from "./EscolheVacina";
import { Vacina } from "../model/Vacina";
import { Proprietario } from "../model/Proprietario";
import { EscolheProprietario } from "./EscolheProprietario";

const ManterAnimal = (props) => {
    const [formAnimal, setFormAnimal] = useState<Partial<Animal>>({})
    const navigation = useNavigation();
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [loading,setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(true);

    const [formVacina, setFormVacina] = useState<Partial<Vacina>>({});
    const [modalVacinaVisible, setModalVacinaVisible] = useState(false);
    const racaRef = firestore.collection('Usuario').doc(auth.currentUser?.uid)
                        .collection('Vacina');

    const [pickerImagePath, setPickerImagePath] = useState('');

    const AnimalRef = firestore.collection('Usuario').doc(auth.currentUser?.uid)
                        .collection('Animal')
    const [formProprietario, setFormProprietario] = useState<Partial<Proprietario>>({});
    const [modalProprietarioVisible, setModalProprietarioVisible] = useState(false);
    const proprietarioRef = firestore.collection('Usuario').doc(auth.currentUser?.uid)
                                .collection('Proprietario');

    const limparFormulario=()=>{
        setFormAnimal({});
        setPickerImagePath('');
    }

    const cancelar = () => {
        setFormAnimal({});
        setPickerImagePath('');
    }

    const setVacina = async(item) => {
        const doc = await racaRef.doc(item.id).get();
        const vacina = new Vacina(doc.data());
        setFormVacina(vacina);
        setFormAnimal({...formAnimal, vacina: vacina.toFirestore() });
    }
    const setProprietario = async(item) => {
        const doc = await proprietarioRef.doc(item.id).get();
        const proprietario = new Proprietario(doc.data());
        setFormProprietario(proprietario);
        setFormAnimal({...formAnimal, proprietario: proprietario.toFirestore() });
    }

    const salvar = async() => {        
        const animal = new Animal(formAnimal);

        console.log(animal.id);

        if (animal.id === undefined){
            const animalRefComId = AnimalRef.doc();
            animal.id = animalRefComId.id;

            animalRefComId.set(animal.toFirestore()).then(() => {
                alert("animal " + animal.nome + " adicionado!")
                limparFormulario();
            });
        } else {
            const animalRefComId = AnimalRef.doc(animal.id);
            animalRefComId.update(animal.toFirestore())
                .then(() => {
                    alert("animal " + animal.nome + " atualizado!")
                    limparFormulario();
                });
        }
        
        
    }

    const escolheFoto = () => {
        Alert.alert(
            "Titulo",
            "Mensagem",
            [
                {
                    text: "Tirar foto",
                    onPress: () => openCamera(),
                    style: "default",
                },
                {
                    text: "Abrir galeria",
                    onPress: () => showImagePicker(),
                    style: "cancel",                    
                }
            ],
            {
                cancelable: true,
                onDismiss: () => { }
            }
        );
    }

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false){
            alert("Permissão recusada!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();
        //console.log(result);

        enviarImagem(result);
    }

    const showImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false){
            alert("Permissão de acesso a galeria recusada!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1
        });
        //console.log(result);
        enviarImagem(result);
    }

    const enviarImagem = async (result) =>{
        if(!result.canceled){
            setPickerImagePath(result.assets[0].uri);
            const uploadUri = result.assets[0].uri;
            let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
            const extension = filename.split('.').pop();
            const name = filename.split('.').slice(0, -1).join('.');

            const ref = storage.ref(`imagens/${name}.${extension}`);
            console.log(ref);

            const img = await fetch(result.assets[0].uri);
            const bytes = await img.blob();
            const fbResult = await uploadBytes(ref, bytes);

            const Download = await storage.ref(fbResult.metadata.fullPath).getDownloadURL();
            setFormAnimal({... formAnimal, urlfoto: Download});
        }
    }

    useEffect(() => {
        if(loading){
            const subscriber = AnimalRef
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
                setIsRefreshing(false);
            });
            return () => subscriber();
        }
        
    }, [animais])

    const editAnimal = async (animal: Animal) => {       
        const result = firestore.collection('Usuario').doc(auth.currentUser?.uid)
        .collection('Animal').doc(animal.id)
            .onSnapshot(documentSnapshot => {
                const animal = new Animal(documentSnapshot.data());                
                setFormAnimal(animal);
                console.log(animal); 
            });
        return () => result();
    }

    const deleteAnimal = async(animal: Animal) => {
        Alert.alert(
            `Apagar animal "${animal.nome}?" `,
            "Essa ação não pode ser desfeita!",
            [
                {
                    text: "Cancelar"
                },
                {
                    text: "Excluir",
                    onPress: async () => {
                        const res = await animalRef.doc(animal.id).delete()
                        .then(() => {
                            alert("animal " + animal.nome + " excluído!");
                            limparFormulario();
                            setIsRefreshing(true);
                        })
                    }
                }
            ]
        );
    }


    const renderAnimais = ({ item }: { item: Animal}) => {
        return (
            <View style={meuestilo.item} key={item.id}>
                <Pressable 
                    onLongPress={() => deleteAnimal(item) }
                    onPress={() => editAnimal(item) }
                >
                    <View style={meuestilo.alinhamentoLinha}>
                        <Image style={{ height: 80, width: 80, borderRadius: 100, marginRight:10 }} source={{ uri: item.urlfoto}} />

                        <View style={meuestilo.alinhamentoColuna}>
                            <Text style={meuestilo.title}>Nome: {item.nome}</Text>
                            <Text style={meuestilo.title}>Sexo: {item.sexo}</Text>
                            <Text style={meuestilo.title}>Data Nasc: {item.datanasc}</Text>
                        </View>
                    </View>
                </Pressable>
            </View>
        )
    }


    return(
    <ScrollView>
        <KeyboardAvoidingView style={meuestilo.container}>
            <Pressable onPress={() => escolheFoto()}>
                {pickerImagePath !== "" && (
                    <Image source={{ uri: pickerImagePath }} 
                        style={meuestilo.imagem} />
                )}
                {pickerImagePath === "" && (
                    <Image source={require("../assets/camera.jpg")} 
                        style={meuestilo.imagem} />
                )}
            </Pressable>

            <View style={meuestilo.inputContainer}>
                <TextInput pickerImagePath
                    placeholder="Nome"
                    style={meuestilo.input}

                    value={formAnimal.nome}
                    onChangeText={nome => setFormAnimal({
                        ...formAnimal, 
                        nome: nome
                    })}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVacinaVisible}
                    onRequestClose={() =>{
                        Alert.alert("Fechar modal");
                        setModalVacinaVisible(!modalVacinaVisible);
                    }}>
                    <View style={meuestilo.centeredView}>
                        <View style={meuestilo.modalView}>
                            <EscolheVacina 
                                setModalVacinaVisible={setModalVacinaVisible}
                                setVacina={setVacina}    
                            />
                        </View>
                    </View>
                    
                 </Modal>
                <Pressable 
                    style={[meuestilo.buttonModal, meuestilo.buttonOpen]}
                    onPress={() => setModalVacinaVisible(true)}        
                >
                    <Text style={meuestilo.textStyle}>
                        Vacina: {formAnimal.vacina?.nome}
                    </Text>
                </Pressable>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalProprietarioVisible}
                    onRequestClose={() =>{
                        Alert.alert("Fechar modal");
                        setModalProprietarioVisible(!modalProprietarioVisible);
                    }}>
                    <View style={meuestilo.centeredView}>
                        <View style={meuestilo.modalView}>
                            <EscolheProprietario 
                                setModalProprietarioVisible={setModalProprietarioVisible}
                                setProprietario={setProprietario}    
                            />
                        </View>
                    </View>
                </Modal>
                <Pressable 
                    style={[meuestilo.buttonModal, meuestilo.buttonOpen]}
                    onPress={() => setModalProprietarioVisible(true)}        
                >
                    <Text style={meuestilo.textStyle}>
                        Proprietario: {formAnimal.proprietario?.nome}
                    </Text>
                </Pressable>

                <TextInput 
                    placeholder="Sexo"
                    style={meuestilo.input}
                    value={formAnimal.sexo}
                    onChangeText={sexo => setFormAnimal({
                        ...formAnimal, 
                        sexo: sexo
                    })}
                />
                <TextInput 
                    placeholder="Data Nascimento"
                    style={meuestilo.input}
                    value={formAnimal.datanasc}
                    onChangeText={datanasc => setFormAnimal({
                        ...formAnimal, 
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
                data={animais}
                renderItem={renderAnimais}
                keyExtractor={item => item.id.toString()}
                refreshing={isRefreshing}
            />

        </KeyboardAvoidingView>
        </ScrollView>
    );
}

export default ManterAnimal;