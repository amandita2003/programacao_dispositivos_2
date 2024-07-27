import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import AnimalManter from './AnimalManter';
import AnimalListar from './AnimalListar';
import VacinaManter from './VacinaManter';
import VacinaListar from './VacinaListar';
import HomeScreen from './HomeScreen';
import ListarProprietarios from './ProprietarioListar';
import ManterProprietario from './ProprietarioManter';

function ProprietarioMantScreen({ navigation }) {
    return (
        <ManterProprietario></ManterProprietario>
    );
}

function ProprietarioListScreen({ navigation }) {
    return (
        <ListarProprietarios></ListarProprietarios>
    );
}

function AnimalMantScreen({ navigation }) {
    return (
        <AnimalManter></AnimalManter>
    );
}
function AnimalListScreen({ navigation }) {
    return (
        <AnimalListar></AnimalListar>
    );
}

function VacinaMantScreen({ navigation }) {
    return (
        <VacinaManter></VacinaManter>
    );
}
function VacinaListScreen({ navigation }) {
    return (
        <VacinaListar></VacinaListar>
    );
}
function Logout({ navigation }){
    return (
        <HomeScreen></HomeScreen>
    );
}



const Drawer = createDrawerNavigator();

export default function Menu() {
    return (
        <Drawer.Navigator initialRouteName='Manter Cachorro'>
            <Drawer.Screen name="Manter Proprietario" component={ProprietarioMantScreen} />
            <Drawer.Screen name="Listar Proprietario" component={ProprietarioListScreen} />
            <Drawer.Screen name="Manter Animal" component={AnimalMantScreen} />
            <Drawer.Screen name="Listar Animal" component={AnimalListScreen} />
            <Drawer.Screen name="Manter Vacina" component={VacinaMantScreen} />
            <Drawer.Screen name="Listar Vacina" component={VacinaListScreen} />   
            <Drawer.Screen name='Logout' component={Logout} />                     
        </Drawer.Navigator>
    );
}