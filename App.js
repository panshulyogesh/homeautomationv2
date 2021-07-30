import React, {useEffect} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import FirstPage from './pages/FirstPage';
import SecondPage from './pages/SecondPage';
import OwnerRegistration from './pages/OwnerRegistration';
import ApplianceRegistration from './pages/ApplianceRegistration';
import LocationRegistration from './pages/LocationRegistration';
import Binding from './pages/Binding';
import ModifyOwner from './pages/ModifyOwner';
import DummyScreen from './pages/DummyScreen';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

function TabStack() {
  return (
    <Tab.Navigator
      initialRouteName="Controller"
      tabBarOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#F8F8F8',
        style: {
          backgroundColor: `#008080`,
        },
        labelStyle: {
          textAlign: 'center',
        },
        indicatorStyle: {
          borderBottomColor: `#008080`,
          borderBottomWidth: 2,
        },
      }}>
      <Tab.Screen
        name="FirstPage"
        component={FirstPage}
        options={{
          tabBarLabel: 'Controller',
        }}
      />
      <Tab.Screen
        name="SecondPage"
        component={SecondPage}
        options={{
          tabBarLabel: 'Registration',
        }}
      />
    </Tab.Navigator>
  );
}
const App = () => {
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Owner_Reg'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS Owner_Reg', []);
            txn.executeSql(
              `CREATE TABLE IF NOT EXISTS Owner_Reg(
              Id INTEGER PRIMARY KEY AUTOINCREMENT,
              owner_name TEXT,
              owner_password TEXT,
              MailId TEXT,
              PhoneNumber INT(15),
              Property_name TEXT, 
              Area TEXT,
              State TEXT,
              country TEXT,
              Street TEXT,
              Door_Number  TEXT)`,
              [],
            );
          }
        },
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Location_Reg'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS Location_Reg', []);
            txn.executeSql(
              `CREATE TABLE IF NOT EXISTS Location_Reg(Location TEXT PRIMARY KEY)`,
              [],
            );
          }
        },
        function (tx, res) {
          console.log(error);
        },
      );
    });

    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Appliance_Reg'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS Appliance_Reg', []);
            txn.executeSql(
              `CREATE TABLE IF NOT EXISTS Appliance_Reg(Appliance TEXT PRIMARY KEY)`,
              [],
            );
          }
        },
      );
    });

    //column name = LOC, APPLIANCE,MODEL,PAIRED/UNPAIRED,>> IF PAIRED MACID,PROPERTIES,status
    //binding str=owner+loc+appli+model;
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Binding_Reg'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS Binding_Reg', []);
            txn.executeSql(
              `CREATE TABLE IF NOT EXISTS Binding_Reg(location TEXT,appliance TEXT, model TEXT,paired_unpaired TEXT,macid TEXT,properties 
              TEXT,status TEXT,color TEXT)`,
              [],
            );
          }
        },
      );
    });
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='models_list'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS models_list', []);
            txn.executeSql(
              `CREATE TABLE IF NOT EXISTS models_list(id INTEGER PRIMARY KEY AUTOINCREMENT, manufacturer TEXT,Model TEXT, Device_Type TEXT,Properties TEXT,
              Valid_States TEXT,Units TEXT)`,
              [],
            );
          }
        },
      );
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Controller"
        screenOptions={{
          headerStyle: {backgroundColor: `#008080`},
          headerTintColor: '#fff',
          headerTitleStyle: {fontWeight: 'bold'},
        }}>
        <Stack.Screen
          name="TabStack"
          component={TabStack}
          options={{title: ' Home Automation'}}
        />

        <Stack.Screen
          name="OwnerRegistration"
          component={OwnerRegistration}
          options={{
            tabBarLabel: 'Owner Registration',
          }}
        />

        <Stack.Screen
          name="ModifyOwner"
          component={ModifyOwner}
          options={{
            tabBarLabel: ' Edit Owner Registration',
          }}
        />
        <Stack.Screen
          name="DummyScreen"
          component={DummyScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ApplianceRegistration"
          component={ApplianceRegistration}
          options={{
            tabBarLabel: 'Appliance Registration',
          }}
        />

        <Stack.Screen
          name="LocationRegistration"
          component={LocationRegistration}
          options={{
            tabBarLabel: 'Location Registration',
          }}
        />

        <Stack.Screen
          name="Binding"
          component={Binding}
          options={{
            tabBarLabel: 'Binding',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
