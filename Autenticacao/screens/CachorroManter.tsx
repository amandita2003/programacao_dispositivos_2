import { useNavigation } from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Pressable } from "react-native";
import { auth, firestore, storage } from "../firebase";
import { Cachorro } from "../model/Cachorro";
import meuestilo from "../meuestilo";
import * as ImagePicker from "expo-image-picker"
import {uploadBytes} from "firebase/storage"

const CachorroManter =() =>{
    const [formCachorro, setFormCachorro]=
    useState<Partial<Cachorro>>({})

    const navigation = useNavigation()

    const [pickerImagePath, setPickerImagePath] = useState('')

    const refCachorro=firestore.collection("Usuario").doc(auth.currentUser?.uid)
    .collection("Cachorro")

    const salvar = () =>{
        const cachorroRefComId = refCachorro.doc()
        const cachorro = new Cachorro(formCachorro)
        cachorro.id = cachorroRefComId.id
        
        console.log(cachorro)
        cachorroRefComId.set(cachorro.toFirestore()).then(()=>{
            alert("Cachorro "+cachorro.nome+" adicionado com sucesso")
            cancelar()
        })
    }

    const cancelar = () =>{
       setFormCachorro({}) 
    }

    const escolheFoto = () =>{
        Alert.alert(
            "Escolher foto",
            "selecione a foto seu animal",
            [
                {
                    text: "Abrir câmera",
                    onPress: () => abrirCamera()
                },
                {
                    text: "Abrir galeria",
                    onPress: () => showImagePicker()
                }
            ]
        )
    }

    const abrirCamera = async () =>{
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
        if(permissionResult.granted===false){
            alert("permissão recusada")
            return
        }
        const result = await ImagePicker.launchCameraAsync()
        //console.log(result)
    }

    const showImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(permissionResult.granted===false){
            alert("permissão de acesso a galeria recusada")
            return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        aspect: [4,3],
    })
    enviarImagem(result)
}
    const enviarImagem = async (result) =>{
        if(!result.canceled){
            setPickerImagePath(result.assets[0].uri)
            const uploadUri = result.assets[0].uri
            let filename = uploadUri.substring(uploadUri.lastIndexOf('/')+1)
            const extension = filename.split('.').pop()
            const name = filename.split('.').slice(0, -1).join('.')
            const ref = storage.ref(`imagens/${name}.${extension}`)
            const img = await fetch(uploadUri)
            const bytes = await img.blob()
            const fbResult = await uploadBytes(ref, bytes)
            const download = await storage.ref(fbResult.metadata.fullPath).getDownloadURL()
            setFormCachorro({... formCachorro, urlfoto: download})
        }
    }

    return(
        <KeyboardAvoidingView style={meuestilo.container}>
            <View style={meuestilo.inputContainer}>
                <Pressable onPress={()=> escolheFoto()}>
                    <Text>Foto</Text>
                </Pressable>
            <TextInput
                placeholder="Nome"
                value={formCachorro.nome}
                onChangeText={nome=>setFormCachorro({...formCachorro, nome:nome})}
                style={meuestilo.input}
            />
            <TextInput
                placeholder="Sexo"
                value={formCachorro.sexo}
                onChangeText={sexo=>setFormCachorro({...formCachorro, sexo:sexo})}
                style={meuestilo.input}
            />
            <TextInput
                placeholder="Data de nascimento"
                value={formCachorro.datanasc}
                onChangeText={datanasc=>setFormCachorro({...formCachorro, datanasc:datanasc})}
                style={meuestilo.input}
            />
            <TextInput
                placeholder="Raça"
                value={formCachorro.raca}
                onChangeText={raca=>setFormCachorro({...formCachorro, raca:raca})}
                style={meuestilo.input}
            />
            </View>
            <View style={meuestilo.buttonContainer}>
                <TouchableOpacity onPress={cancelar} style={meuestilo.button}>
                    <Text style={meuestilo.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={salvar} style={[meuestilo.button, meuestilo.buttonOutline ]}>
                    <Text style={meuestilo.buttonOutlineText}>Salvar</Text>
                </TouchableOpacity>
            </View>
            
            </KeyboardAvoidingView>

    )
    }

    export default CachorroManter

