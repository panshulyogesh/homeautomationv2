import React, {useState, createRef, useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';

import {
  Left,
  Text,
  Button,
  Icon,
  Right,
  CheckBox,
  Title,
  H1,
  Spinner,
} from 'native-base';
import {useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

const ApplianceRegistration = ({navigation}) => {
  const [Device, setDevice] = useState('');
  const [asyncapp, setasyncapp] = useState([]);
  const [drop_app, setdrop_app] = useState(''); //to capture dropdown vals

  useFocusEffect(
    React.useCallback(() => {
      retrieveData();
    }, [retrieveData]),
  );

  const retrieveData = async () => {
    try {
      // const value = await AsyncStorage.getItem('user_config');
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Appliance_Reg', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setasyncapp(temp);
        });
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const handledeletePress = item => {
    console.log('chosen item to delete', item);

    function deleteappliance(userdata) {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM  Appliance_Reg where Appliance=?',
          [userdata.Appliance],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              navigation.navigate('DummyScreen', {
                paramKey: 'ApplianceRegistration_delete',
              });
            }
          },
          (tx, error) => {
            console.log('error', error);
          },
        );
      });

      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM  Binding_Reg where appliance=?',
          [userdata.Appliance],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('deleted from binding table');
            }
          },
          (tx, error) => {
            console.log('error', error);
          },
        );
      });
    }

    Alert.alert(
      'Are you sure ',
      ' you want  to delete',
      [
        {
          text: 'Ok',

          onPress: () => deleteappliance(item),
        },
        {
          text: 'cancel',

          onPress: () => console.log('cancel pressed'),
        },
      ],
      {cancelable: true},
    );
  };

  const handleSubmitPress = async () => {
    if (!Device) {
      alert('Please enter Device');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        `INSERT INTO Appliance_Reg (Appliance)
                 VALUES (?)`,
        [Device.toString().toUpperCase()],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            navigation.navigate('DummyScreen', {
              paramKey: 'ApplianceRegistration',
            });
          }
        },
        (tx, error) => {
          navigation.navigate('DummyScreen', {
            paramKey: 'ApplianceRegistration_samedata',
          });
        },
      );
    });
  };

  return (
    <View
      style={{
        flex: 1,
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
      }}>
      <TextInput
        style={{
          borderWidth: 2,
          color: '#05375a',
        }}
        placeholderTextColor="#05375a"
        placeholder=" Enter Device name eg:Fan,AC,Light...etc"
        onChangeText={Device => setDevice(Device)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSubmitPress()}>
        <Text>Add Appliance</Text>
      </TouchableOpacity>
      <FlatList
        keyExtractor={(item, id) => id}
        data={asyncapp}
        renderItem={({item}) => (
          <View>
            <Text
              adjustsFontSizeToFit
              numberOfLines={6}
              style={{
                textAlignVertical: 'center',
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0)',
                color: 'black',
                fontWeight: 'bold',
              }}>
              {item.Appliance}
            </Text>
            <View
              style={{
                flex: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Right>
                <Button
                  onPress={() => handledeletePress(item)}
                  style={{backgroundColor: 'red', width: '18%', height: 45}}>
                  <Icon name="trash" active />
                </Button>
              </Right>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => {
          return <View style={styles.separatorLine}></View>;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#7fff00',
    padding: 10,
    width: 300,
    marginTop: 16,
  },

  actionButton: {
    marginLeft: 200,
  },
  separatorLine: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,.3)',
    margin: 3,
  },
});
export default ApplianceRegistration;
