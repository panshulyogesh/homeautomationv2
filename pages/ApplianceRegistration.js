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
import ModalDropdown from 'react-native-modal-dropdown';
import {
  check_password,
  read_store_async,
  delete_registrations,
} from './Functions';
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
        tx.executeSql('SELECT * FROM appliance_reg', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setasyncapp(temp);
          // console.log("items",temp);
        });
      });

      //console.log('async data loc:', async_data);
      // console.log('async data app:', async_data.appliance);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handledeletePress = item => {
    console.log('chosen item to delete', item);

    function deleteappliance(userdata) {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM  appliance_reg where appliance=?',
          [userdata.appliance],
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
    let today = new Date();
    let date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    let date1 = today.getFullYear() + (today.getMonth() + 1) + today.getDate();
    let time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    let dateTime = date + time;
    db.transaction(function (tx) {
      tx.executeSql(
        `INSERT INTO appliance_reg (id,appliance)
                 VALUES (?,?)`,
        [dateTime.toString(), Device.toString().toUpperCase()],
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
    <>
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
          }}
          placeholder=" Enter Device name eg:Fan,AC,Light...etc"
          onChangeText={Device => setDevice(Device)}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSubmitPress()}>
          <Text>Add Appliance</Text>
        </TouchableOpacity>
        {/* <View>
        <ModalDropdown
          textStyle={{
            fontSize: 16,
            paddingTop: 8,
            paddingBottom: 8,
            alignItems: 'center',
          }}
          dropdownTextStyle={{fontSize: 30}}
          options={asyncapp}
          defaultValue={'Appliance List'}
          onSelect={(idx, value) => setdrop_app(value)}></ModalDropdown>
      </View> */}
        <FlatList
          keyExtractor={(item, id) => id}
          data={asyncapp}
          renderItem={({item}) => (
            <View
              style={{
                flex: 1,
                height: 40,
                marginTop: 20,
                margin: 10,
              }}>
              <Text
                style={{
                  position: 'absolute',
                  width: '100%',
                  backgroundColor: 'beige',
                  bottom: 0,
                }}>
                {item.appliance}
              </Text>
              <Left>
                <Button
                  onPress={() => handledeletePress(item)}
                  style={styles.actionButton}
                  danger>
                  <Icon name="trash" active />
                </Button>
              </Left>
            </View>
          )}
          ItemSeparatorComponent={() => {
            return <View style={styles.separatorLine}></View>;
          }}
        />
      </View>
    </>
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
    height: 1,
    backgroundColor: 'black',
  },
});
export default ApplianceRegistration;
