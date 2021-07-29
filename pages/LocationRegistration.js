import React, {useState} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useEffect,
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

import ModalDropdown from 'react-native-modal-dropdown';

import {useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'UserDatabase.db'});

const LocationRegistration = ({navigation}) => {
  const [LocationName, setLocationName] = useState(''); //text input field loc
  const [asyncloc, setasyncloc] = useState([]); //to view dropodown values
  const [drop_loc, setdrop_loc] = useState(''); //to capture dropdown vals
  const [bind, setbind] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      retrieveData();
    }, [retrieveData]),
  );

  const retrieveData = async () => {
    try {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Location_Reg', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setasyncloc(temp);
        });
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const handledeletePress = item => {
    console.log('chosen item to delete', item);

    function deletelocation(userdata) {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM  Location_Reg where Location=?',
          [userdata.Location],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              navigation.navigate('DummyScreen', {
                paramKey: 'LocationRegistration_delete',
              });
            }
          },
          (tx, error) => {
            console.log('error', error);
          },
        );
      });
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM Binding_Reg', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          //Alert console.log(temp);

          if (temp.length > 0) {
            temp.forEach(function (a, index) {
              let temp1 = [];
              temp1.push(a);

              const result = temp1.find(data =>
                data.Binding.includes(userdata.Location),
              );
              console.log('result', result);
              if (result) {
                deletebinding(result);
              }
            });
          }
          // alert (//paired//notfound /no vacancy)

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

          onPress: () => deletelocation(item),
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
    console.log(userdata.Binding);
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM  Binding_Reg where Binding=?',
        [userdata.Binding],
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
    if (!LocationName) {
      alert('Please enter location');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        `INSERT INTO Location_Reg (Location) VALUES (?)`,
        [LocationName.toString().toUpperCase()],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            navigation.navigate('DummyScreen', {
              paramKey: 'LocationRegistration',
            });
          }
        },
        (tx, error) => {
          navigation.navigate('DummyScreen', {
            paramKey: 'LocationRegistration_samedata',
          });
        },
      );
    });
  };

  return (
    <View
      style={{
        flex: 10,
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
        placeholder=" Enter Location name eg: Hall,dining,Kitchen...etc"
        onChangeText={LocationName => setLocationName(LocationName)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSubmitPress()}>
        <Text>Add location</Text>
      </TouchableOpacity>

      <FlatList
        keyExtractor={(item, id) => id}
        data={asyncloc}
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
              {item.Location}
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

export default LocationRegistration;

const styles = StyleSheet.create({
  actionButton: {
    marginLeft: 200,
  },
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
  dropdown_3: {
    marginVertical: 20,
    marginHorizontal: 16,
    fontSize: 100,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    width: 100,
    height: 100,
    flexGrow: 100,
  },
});
