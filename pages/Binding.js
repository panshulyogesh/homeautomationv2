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
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

import {useFocusEffect} from '@react-navigation/native';
const Binding = ({navigation}) => {
  const [asyncloc, setasyncloc] = useState([]);
  const [asyncapp, setasyncapp] = useState([]);
  const [location, setlocation] = useState([]);
  const [owner, setowner] = useState([]);
  const [appliance, setappliance] = useState([]);
  const [asyncbind, setasyncbind] = useState([]);
  const [model, setmodel] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

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
  useFocusEffect(
    React.useCallback(() => {
      retrieveData();
    }, [retrieveData]),
  );

  const retrieveData = async () => {
    try {
      // const value = await AsyncStorage.getItem('user_config');
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM owner_reg', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          //let items = JSON.stringify(temp);
          let ownerdata_obj = temp;
          console.log(ownerdata_obj[0].owner_name);
          setowner(ownerdata_obj[0].owner_name);
        });
      });
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM location_reg', [], (tx, results) => {
          var temp = [];
          for (let j = 0; j < results.rows.length; ++j)
            temp.push(results.rows.item(j));
          setasyncloc(temp);
        });
      });
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM appliance_reg', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setasyncapp(temp);
        });
      });
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM binding_reg', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setasyncbind(temp);
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
          'DELETE FROM  binding_reg where name=?',
          [userdata.name],
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
    console.log(location, appliance);
    if (!location) {
      alert('Please enter location');
      return;
    }
    if (!appliance) {
      alert('Please enter appliance');
      return;
    }
    // if (!model) {
    //   alert('Please enter model');
    //   return;
    // }
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

    let binding = owner.toString() + '_' + location + '_' + appliance;
    console.log('binding', binding.toString());

    db.transaction(function (tx) {
      tx.executeSql(
        `INSERT INTO binding_reg (id,name)
               VALUES (?,?)`,
        [dateTime.toString(), binding.toString().toUpperCase()],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            navigation.navigate('DummyScreen', {
              paramKey: 'Binding',
            });
          }
        },
        (tx, error) => {
          navigation.navigate('DummyScreen', {
            paramKey: 'Binding_samedata',
          });
        },
      );
    });
  };

  //pair/unpair:snehal_hall_fan_havels-ceilingfan-yorker
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
      <MultiSelect
        hideTags
        items={asyncloc}
        uniqueKey="name"
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
        displayKey="name"
        searchInputStyle={{color: '#CCC'}}
        submitButtonColor="#48d22b"
        submitButtonText="Submit"
      />
      <MultiSelect
        hideTags
        items={asyncapp}
        uniqueKey="name"
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
        displayKey="name"
        searchInputStyle={{color: '#CCC'}}
        submitButtonColor="#48d22b"
        submitButtonText="Submit"
      />
      {/* <MultiSelect
        hideTags
        items={asyncloc}
        uniqueKey="id"
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        single={true}
        selectText="Pick Items"
        searchInputPlaceholderText="Search Items..."
        onChangeInput={text => console.log(text)}
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#CCC"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{color: '#CCC'}}
        submitButtonColor="#48d22b"
        submitButtonText="Submit"
      /> */}
      {/* <ModalDropdown
        textStyle={{
          fontSize: 16,
          paddingTop: 8,
          paddingBottom: 8,
          alignItems: 'center',
        }}
        dropdownTextStyle={{fontSize: 30}}
        options={asyncloc}
        defaultValue={'select location'}
        onSelect={(idx, value) => setlocation(value)}></ModalDropdown> */}

      {/* <ModalDropdown
        textStyle={{
          fontSize: 16,
          paddingTop: 8,
          paddingBottom: 8,
          alignItems: 'center',
        }}
        dropdownTextStyle={{fontSize: 30}}
        options={asyncapp}
        defaultValue={'select appliance'}
        onSelect={(idx, value) => setappliance(value)}></ModalDropdown> */}
      {/* <ModalDropdown
        textStyle={{
          fontSize: 16,
          paddingTop: 8,
          paddingBottom: 8,
          alignItems: 'center',
        }}
        dropdownTextStyle={{fontSize: 30}}
        options={filedata.model}
        defaultValue={'select model'}
        onSelect={(idx, value) => setmodel(value)}></ModalDropdown> */}

      {/* <SearchableDropdown
        keyboardShouldPersistTaps="always"
        onTextChange={text => Alert.alert(text)}
        resetValue={false}
        onItemSelect={item => setmodel(item.appliance)}
        containerStyle={{padding: 5}}
        textInputStyle={{
          padding: 12,
          borderWidth: 1,
          borderColor: '#ccc',
          backgroundColor: '#FAF7F6',
        }}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: '#FAF9F8',
          borderColor: '#bbb',
          borderWidth: 1,
        }}
        itemTextStyle={{
          color: '#222',
        }}
        itemsContainerStyle={{
          maxHeight: '60%',
        }}
        items={asyncloc}
        defaultIndex={2}
        placeholder="select location"
      /> */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSubmitPress()}>
        <Text>Add Binding</Text>
      </TouchableOpacity>

      <FlatList
        keyExtractor={(item, id) => id}
        data={asyncbind}
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
                fontSize: 14,
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

  actionButton: {
    marginLeft: 250,
  },
  actionButton1: {
    marginLeft: 150,
  },
  separatorLine: {
    height: 1,
    backgroundColor: 'black',
  },
});
