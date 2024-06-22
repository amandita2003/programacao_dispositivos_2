import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CachorroManter from './CachorroManter';
import HomeScreen from './HomeScreen';
import CachorroListar from './CachorroListar';

function ManterScreen({navigation}){
    return(
        <CachorroManter></CachorroManter>
    )
}

function Logout({ navigation}){
    return(
        <HomeScreen></HomeScreen>
    )
}

function ListarScreen({ navigation}){
    return(
        <CachorroListar></CachorroListar>
    )
}

const Drawer = createDrawerNavigator()

export default function Menu(){
    return(
        <Drawer.Navigator initialRouteName='Manter Cachorro'>
            <Drawer.Screen name='Manter Cachorro' component={ManterScreen}/>
            <Drawer.Screen name='Listar Cachorro' component={ListarScreen}/>
            <Drawer.Screen name='Logout' component={Logout}/>
            
        </Drawer.Navigator>
    )
}