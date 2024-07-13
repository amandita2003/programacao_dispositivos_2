import { useNavigation } from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Pressable, Image, FlatList, } from "react-native";
import { auth, firestore, storage } from "../firebase";
import { Cachorro } from "../model/Cachorro";
import meuestilo from "../meuestilo";
import * as ImagePicker from "expo-image-picker"
import {uploadBytes} from "firebase/storage"
import {  ScrollView } from "react-native-gesture-handler";

const CachorroManter =() =>{
    const [formCachorro, setFormCachorro]=
    useState<Partial<Cachorro>>({})

    const [cachorros, setCachorros] = useState<Cachorro[]>([])

    const [loading, setLoading] = useState(true)

    const navigation = useNavigation()

    const [pickerImagePath, setPickerImagePath] = useState('')

    const refCachorro=firestore.collection("Usuario").doc(auth.currentUser?.uid)
    .collection("Cachorro")

    const salvar = () =>{
        const cachorro = new Cachorro(formCachorro)
        if(cachorro.id === undefined){
            const cachorroRefComId = refCachorro.doc()
        
            cachorro.id = cachorroRefComId.id
        
        console.log(cachorro)
        cachorroRefComId.set(cachorro.toFirestore()).then(()=>{
            alert("Cachorro "+cachorro.nome+" adicionado com sucesso")
            cancelar()
        })
        } else{
                const cachorroRefComId = refCachorro.doc(cachorro.id)
                cachorroRefComId.update(cachorro.toFirestore()).then(()=>{
                    alert("Cachorro atualizado com sucesso!")
                    cancelar()
                })

        }

        
    }

    const cancelar = () =>{
       setFormCachorro({}) 
       setPickerImagePath("")
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

    useEffect(() =>{
        if(loading){
            const subscriber = refCachorro.onSnapshot((querySnapshot) =>{
                const cachorros = []
                querySnapshot.forEach((documentSnapshot)=>{
                    cachorros.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id
                    })

                    setCachorros(cachorros)
                    setLoading(false)
                });
            })
        }
    }, [cachorros])

    const editCachorro = async(cachorro: Cachorro) =>{
        const result = firestore.collection('Usuario').doc(auth.currentUser?.uid).collection('Cachorro').doc(cachorro.id)
        .onSnapshot(documentSnapshot =>{
            const cachorro = new Cachorro(documentSnapshot.data())
            setFormCachorro(cachorro)
            setPickerImagePath(cachorro.urlfoto)
            //console.log(cachorro)
        })

    }
    const deleteCachorro = async(cachorro: Cachorro) =>{
        const result = await refCachorro.doc(cachorro.id).delete().then(() =>{
            alert('Cachorro deletado')
            cancelar()
        })
    }


    const Item = ({item}) => (
        <View style={meuestilo.item}>
            <Pressable
                onPress={()=>editCachorro(item)}
                onLongPress={()=>deleteCachorro(item)}>
                <Image
                    style={meuestilo.image}
                    source={{
                    uri: item.urlfoto
                    }}
                />
                <View>
                    <Text style={meuestilo.title}>Nome:{item.nome}</Text>
                    <Text style={meuestilo.title}>Raça:{item.raca}</Text>
                    <Text style={meuestilo.title}>Sexo:{item.sexo}</Text>
                    <Text style={meuestilo.title}>Data de nascimento:{item.datanasc}</Text>
                </View>
            </Pressable>
        </View>
    )
    const renderItem = ({item}) => <Item item={item}/>

    return(
        <ScrollView>
            <KeyboardAvoidingView style={meuestilo.container}>
                <Pressable onPress={()=> escolheFoto()}>
                    {pickerImagePath === "" &&(
                        <Image source={require("../assets/camera2.png")} style={meuestilo.imagem}/>
                    )}
                    {pickerImagePath !== "" && (
                        <Image source={{uri: pickerImagePath}} style={meuestilo.image}/>
                        )}
                    
                    
                </Pressable>
            <View style={meuestilo.inputContainer}>
                
                
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
                <FlatList
            data={cachorros}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
                />

            
            
            </KeyboardAvoidingView>
        </ScrollView>

    )
    }

    export default CachorroManter

