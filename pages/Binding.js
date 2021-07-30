import React, {useState} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  useEffect,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
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

const filedata = require('./Master.json');
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalDropdown from 'react-native-modal-dropdown';
import SearchableDropdown from 'react-native-searchable-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import MultiSelect from 'react-native-multiple-select';
import TcpSocket from 'react-native-tcp-socket';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

import {useFocusEffect} from '@react-navigation/native';
const Binding = ({navigation}) => {
  const [asyncloc, setasyncloc] = useState([]);
  const [asyncapp, setasyncapp] = useState([]);
  const [asyncmodel, setasyncmodel] = useState([]);
  const [location, setlocation] = useState([]);
  const [owner, setowner] = useState([]);
  const [appliance, setappliance] = useState([]);
  const [asyncbind, setasyncbind] = useState([]);
  const [model, setmodel] = useState([]);

  const locations = selectedItems => {
    // Set Selected Items
    setlocation(selectedItems);
    console.log(selectedItems);
  };
  const appliances = selectedItems => {
    // Set Selected Items
    setappliance(selectedItems);
    console.log(selectedItems);
  };

  const models = selectedItems => {
    // Set Selected Items
    setmodel(selectedItems);
    console.log(selectedItems);
  };
  useFocusEffect(
    React.useCallback(() => {
      retrieveData();
    }, [retrieveData]),
  );

  const retrieveData = async () => {
    try {
      // const value = await AsyncStorage.getItem('user_config');
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Owner_Reg', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          //let items = JSON.stringify(temp);
          let ownerdata_obj = temp;
          console.log(ownerdata_obj[0].owner_name);
          setowner(ownerdata_obj[0]);
        });
      });
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Location_Reg', [], (tx, results) => {
          var temp = [];
          for (let j = 0; j < results.rows.length; ++j)
            temp.push(results.rows.item(j));
          setasyncloc(temp);
        });
      });
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Appliance_Reg', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setasyncapp(temp);
        });
      });
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Binding_Reg', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setasyncbind(temp);
        });
      });
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM models_list', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            let modifiedmodels =
              results.rows.item(i).manufacturer +
              '-' +
              results.rows.item(i).Device_Type +
              '-' +
              results.rows.item(i).Model;

            temp.push({modifiedmodels});
          }
          console.log(temp);
          setasyncmodel(temp);
        });
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const handledeletePress = item => {
    console.log('chosen item to delete', item);

    function deletebinding(userdata) {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM  Binding_Reg where location=? and appliance =? and model =?',
          [userdata.location, userdata.appliance, userdata.model],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              navigation.navigate('DummyScreen', {
                paramKey: 'Binding_delete',
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

          onPress: () => deletebinding(item),
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
    if (location.length == 0) {
      alert('Please enter location');
      return;
    }
    if (appliance.length == 0) {
      alert('Please enter appliance');
      return;
    }
    if (model.length == 0) {
      alert('Please enter model');
      return;
    }

    // let binding = owner.toString() + '_' + location + '_' + appliance;
    // console.log('binding', binding.toString());
    // console.log(
    //   location.toString(),
    //   appliance.toString(),
    //   model.toString().toUpperCase(),
    // );
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Binding_Reg where
        (location=? and appliance =? and model =?)`,
        [location.toString(), appliance.toString(), model.toString()],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len', len);
          if (len == 0) {
            storebinding(
              location.toString().toUpperCase(),
              appliance.toString().toUpperCase(),
              model.toString().toUpperCase(),
            );
          } else {
            navigation.navigate('DummyScreen', {
              paramKey: 'Binding_samedata',
            });
          }
        },
        (tx, error) => {
          console.log('error', error);
        },
      );
    });

    // db.transaction(function (tx) {
    //   tx.executeSql(
    //     `INSERT INTO Binding_Reg (location,appliance,model,paired/unpaired)
    //            VALUES (?,?,?,?)`,
    //     [
    //       location.toString().toUpperCase(),
    //       appliance.toString().toUpperCase(),
    //       model.toString().toUpperCase(),
    //       'unpaired',
    //     ],
    //     (tx, results) => {
    //       console.log('Results', results.rowsAffected);
    //       if (results.rowsAffected > 0) {
    //         navigation.navigate('DummyScreen', {
    //           paramKey: 'Binding',
    //         });
    //       }
    //     },
    //     (tx, error) => {
    //       navigation.navigate('DummyScreen', {
    //         paramKey: 'Binding_samedata',
    //       });
    //     },
    //   );
    // });
  };

  function storebinding(location, appliance, model) {
    console.log('entered');
    db.transaction(function (tx) {
      tx.executeSql(
        `INSERT INTO Binding_Reg (location,appliance,model,paired_unpaired,color)
               VALUES (?,?,?,?,?)`,
        [
          location.toString().toUpperCase(),
          appliance.toString().toUpperCase(),
          model.toString().toUpperCase(),
          'unpaired',
          'grey',
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            navigation.navigate('DummyScreen', {
              paramKey: 'Binding',
            });
          }
        },
        (tx, error) => {
          console.log(error);
          navigation.navigate('DummyScreen', {
            paramKey: 'Binding_samedata',
          });
        },
      );
    });
  }
  function handlepairing(item) {
    console.log('----------------');
    console.log('data from user for pairing', item);

    let pairingstring =
      'pair' +
      ':' +
      owner.owner_name +
      ',' +
      owner.Door_Number +
      ',' +
      owner.Property_name +
      ',' +
      owner.Area +
      ',' +
      owner.Street +
      ',' +
      owner.State +
      ',' +
      owner.country +
      ',' +
      item.location +
      ',' +
      item.appliance +
      ',' +
      item.model +
      ';';

    console.log(pairingstring);

    let client = TcpSocket.createConnection(
      {port: 80, host: '192.168.4.1'},
      () => {
        client.write(pairingstring.toString());
      },
    );
    client.on('connect', () => {
      console.log('Opened client on ' + JSON.stringify(client.address()));
    });
    client.on('data', data => {
      console.log('message was received from ESP32 ==>', data.toString());
      if (data.toString() == 'esp32 successs') {
        updatebindingtable(item);
      }
      client.end();
    });
    client.on('error', error => {
      console.log('error', error);
      Alert.alert('please check your wifi connection');
      client.end();
    });
    client.on('close', () => {
      console.log('Connection closed!');
      client.end();
    });
  }

  function updatebindingtable(item) {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE  Binding_Reg set paired_unpaired=?, macid=?,color =? where
        (location=? and appliance =? and model =?);`,
        [
          'paired',
          '30:AE:A4:07:0D:64',
          'green',
          item.location,
          item.appliance,
          item.model,
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            navigation.navigate('DummyScreen', {
              paramKey: 'Binding_updation',
            });
          } else alert('Updation Failed');
        },
      );
    });
  }
  function handlerefresh() {
    let url = 'http://homeautomation.sowcare.net/data';
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('response from webservice ===>', data);

        data.forEach(function (a, index) {
          //  console.log('a', a['Device Type']);
          //console.log(asyncbind.length);
          // let temp = [];
          // temp.push(a);
          //console.log(temp);
          storemodels(a);
        });
      })

      .catch(error => {
        console.error('error in webservice====>', error);
      });
  }

  function storemodels(info) {
    console.log('-----------------------');
    console.log('info', info['Device Type']);
    console.log('info', info.Manufacturur);
    console.log('info', info.Model);
    console.log('info', info.Properties);
    console.log('info', info.Units);
    console.log('info', info['Valid States']);

    db.transaction(function (tx) {
      tx.executeSql(
        `INSERT INTO  models_list (
          manufacturer ,Model, Device_Type ,Properties,
              Valid_States ,Units) VALUES(?,?,?,?,?,?)`,
        [
          info.Manufacturur.toUpperCase(),
          info.Model.toUpperCase(),
          info['Device Type'].toUpperCase(),
          info.Properties,
          info['Valid States'].toUpperCase(),
          info.Units.toUpperCase(),
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);

          if (results.rowsAffected > 0) {
            //console.log('success');
            navigation.navigate('DummyScreen', {
              paramKey: 'Binding',
            });
          }
        },
        (tx, error) => {
          console.log(error);
        },
      );
    });
  }
  //pair/unpair:snehal_hall_fan_havels-ceilingfan-yorker;
  //ownername,property,town,village ,country,street
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
      <TouchableOpacity style={styles.button} onPress={() => handlerefresh()}>
        <Text>refresh</Text>
      </TouchableOpacity>
      <MultiSelect
        items={asyncloc}
        uniqueKey="Location"
        onSelectedItemsChange={locations}
        selectedItems={location}
        single={true}
        selectText="Pick Locations"
        searchInputPlaceholderText="Search Locations..."
        onChangeInput={text => console.log(text)}
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#CCC"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="Location"
        searchInputStyle={{color: '#CCC'}}
        submitButtonColor="#48d22b"
        submitButtonText="Submit"
      />
      <MultiSelect
        items={asyncapp}
        uniqueKey="Appliance"
        onSelectedItemsChange={appliances}
        selectedItems={appliance}
        single={true}
        selectText="Pick Appliances"
        searchInputPlaceholderText="Search Appliances..."
        onChangeInput={text => console.log(text)}
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#CCC"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="Appliance"
        searchInputStyle={{color: '#CCC'}}
        submitButtonColor="#48d22b"
        submitButtonText="Submit"
      />
      <MultiSelect
        items={asyncmodel}
        uniqueKey="modifiedmodels"
        onSelectedItemsChange={models}
        selectedItems={model}
        single={true}
        selectText="Pick Models"
        searchInputPlaceholderText="Search Models..."
        onChangeInput={text => console.log(text)}
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#CCC"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="modifiedmodels"
        searchInputStyle={{color: '#CCC'}}
        submitButtonColor="#48d22b"
        submitButtonText="Submit"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSubmitPress()}>
        <Text>Add Binding</Text>
      </TouchableOpacity>

      <FlatList
        keyExtractor={(item, id) => id}
        data={asyncbind}
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
              Location:{''}
              {item.location}
            </Text>
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
              Appliance:{''}
              {item.appliance}
            </Text>
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
              Model:{''}
              {item.model}
            </Text>
            <View
              style={{
                flex: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                onPress={() => handlepairing(item)}
                style={{backgroundColor: item.color, width: '18%', height: 45}}>
                <Icon name="wifi" active />
              </Button>
              <Button
                onPress={() => handledeletePress(item)}
                style={{backgroundColor: 'red', width: '18%', height: 45}}>
                <Icon name="trash" active />
              </Button>
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

export default Binding;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#7fff00',
    padding: 10,
    width: 300,
    marginTop: 16,
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

// let bingo = [{
//   "Device": "fan",
//   "Manafacturer": "Havells"
// }, {
//   "Device": "Ceiling",
//   "Manafacturer": "bajaj"
// }]

// let obj = {
//   "Device": "Ceiling",
//   "Manafacturer": "bajaj"
// }
// const objString = JSON.stringify(obj);
// const val = bingo.find((item) => JSON.stringify(item) === objString);
// console.log(val)
////////////////////////
// let bingo = [{"Device": "fan", "Manafacturer": "Havells"}, {"Device": "Ceiling", "Manafacturer": "bajaj"}];

// let check1 ={"Device": "Ceiling", "Manafacturer": "bajaj"}
// //should return true or {"Device": "Ceiling", "Manafacturer": "bajaj"}

// let check2 ={"Device": "light", "Manafacturer": "bajaj"}
// //should return false or undefined

// function checkObjectExists(main, check) {
//   return JSON.stringify(main).indexOf(JSON.stringify(check)) >= 0;
// }

// console.log( checkObjectExists(bingo, check1) );   //true

// console.log( checkObjectExists(bingo, check2) );  //false
