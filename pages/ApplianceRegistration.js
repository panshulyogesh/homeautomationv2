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
        tx.executeSql('SELECT * FROM appliance_reg', [], (tx, results) => {
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
          'DELETE FROM  appliance_reg where name=?',
          [userdata.name],
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
        tx.executeSql('SELECT * FROM binding_reg', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          console.log(temp);
          console.log('temp length', temp.length);
          if (temp.length > 0) {
            temp.forEach(function (a, index) {
              let temp1 = [];
              temp1.push(a);

              const result = temp1.find(x => x.name.includes(userdata.name));
              console.log('result', result);
              if (result) {
                deletebinding(result);
              }
            });
          }

          // var inventory = [
          //   {name: 'owner_hall_light', id: 2},
          //   {name: 'owner_kitchen_ac', id: 0},
          //   {name: 'owner_bed_fan', id: 5},
          // ];
          // let find = 'lamp';
          // const result = inventory.find(x => x.name.includes(find));
          // //expected output
          // console.log(result); //   {name: 'owner_kitchen_ac', id: 0}
        });
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
  function deletebinding(userdata) {
    console.log(userdata.id);
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  binding_reg where id=?',
        [userdata.id],
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
        `INSERT INTO appliance_reg (id,name)
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
                {item.name}
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
