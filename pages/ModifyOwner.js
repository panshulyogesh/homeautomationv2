import React, {useState, createRef, useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  Button,
  Alert,
  Modal,
  Pressable,
  StatusBar,
  Dimensions,
} from 'react-native';

import * as Animatable from 'react-native-animatable';

import LinearGradient from 'react-native-linear-gradient';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Feather from 'react-native-vector-icons/Feather';

import AsyncStorage from '@react-native-async-storage/async-storage';

let configurations = {
  owner: {
    owner_name: '',
    owner_password: '',
    MailId: '',
    PhoneNumber: '',
    Property_name: '',
    Area: '',
    State: '',
    country: '',
    Street: '',
    Door_Number: '',
  },
};
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});

import {useFocusEffect} from '@react-navigation/native';
const ModifyOwner = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [OwnerName, setOwnerName] = useState('');
  const [password, setpassword] = useState('');
  const [MailId, setMailId] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Property_name, setProperty_name] = useState('');
  const [Street, setStreet] = useState('');
  const [Area, setArea] = useState('');
  const [State, setState] = useState('');
  const [country, setcountry] = useState('');
  const [Door_Number, setDoor_Number] = useState('');
  const [owner, setowner] = useState('');

  let updateAllStates = (
    ownername,
    owner_password,
    MailId,
    PhoneNumber,
    Property_name,
    Area,
    State,
    country,
    Street,
    Door_Number,
  ) => {
    setOwnerName(ownername);
    setpassword(owner_password);
    setMailId(MailId);
    setPhoneNumber(PhoneNumber);
    setProperty_name(Property_name);
    setArea(Area);
    setState(State);
    setcountry(country);
    setStreet(Street);
    setDoor_Number(Door_Number);
  };
  useFocusEffect(
    React.useCallback(() => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM Owner_Reg where Id=?',
          ['1'],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              let res = results.rows.item(0);
              updateAllStates(
                res.owner_name,
                res.owner_password,
                res.MailId,
                res.PhoneNumber.toString(),
                res.Property_name,
                res.Area,
                res.State,
                res.country,
                res.Street,
                res.Door_Number,
              );
            } else {
              alert('No user found');
              updateAllStates('');
            }
          },
        );
      });
    }, []),
  );

  const handleSubmitPress = async () => {
    setModalVisible(!modalVisible);
    if (
      !OwnerName ||
      !password ||
      !MailId ||
      !PhoneNumber ||
      !Property_name ||
      !Area ||
      !State ||
      !country ||
      !Street ||
      !Door_Number
    ) {
      alert('Please fill all the fields');
      return;
    }

    configurations.owner.owner_name = OwnerName.toUpperCase();
    configurations.owner.owner_password = password.toUpperCase();
    configurations.owner.MailId = MailId;
    configurations.owner.PhoneNumber = PhoneNumber.toUpperCase();
    configurations.owner.Property_name = Property_name.toUpperCase();
    configurations.owner.Area = Area.toUpperCase();
    configurations.owner.State = State.toUpperCase();
    configurations.owner.country = country.toUpperCase();
    configurations.owner.Street = Street.toUpperCase();
    configurations.owner.Door_Number = Door_Number.toUpperCase();

    db.transaction(function (tx) {
      tx.executeSql(
        `UPDATE  Owner_Reg SET 
              owner_name=?, owner_password=?,MailId=?,PhoneNumber=?,Property_name=? ,Area=?,State=?,country=?,Street=?,Door_Number=?
              where Id=?`,
        [
          configurations.owner.owner_name,
          configurations.owner.owner_password,
          configurations.owner.MailId,
          configurations.owner.PhoneNumber,
          configurations.owner.Property_name,
          configurations.owner.Area,
          configurations.owner.State,
          configurations.owner.country,
          configurations.owner.Street,
          configurations.owner.Door_Number,
          '1',
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Data is updated',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('FirstPage'),
                },
              ],
              {cancelable: false},
            );
          }
        },
        (tx, error) => {
          console.log('error', error);
        },
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#008080" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Configure Now!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          <Text style={styles.text_footer}>Edit Your Name </Text>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholderTextColor="#05375a"
              placeholder="Owner Name"
              value={OwnerName}
              onChangeText={OwnerName => setOwnerName(OwnerName)}
            />
          </View>
          <Text style={styles.text_footer}>Edit Your Password </Text>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholderTextColor="#05375a"
              placeholder="Enter password"
              value={password}
              onChangeText={password => setpassword(password)}
            />
          </View>
          <Text style={styles.text_footer}>Edit Your Mail Id</Text>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholderTextColor="#05375a"
              placeholder="Mail Id"
              value={MailId}
              onChangeText={MailId => setMailId(MailId)}
            />
          </View>
          <Text style={styles.text_footer}>Edit Your Phone Number</Text>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholderTextColor="#05375a"
              placeholder="Phone Number"
              keyboardType="numeric"
              value={PhoneNumber}
              onChangeText={PhoneNumber => setPhoneNumber(PhoneNumber)}
            />
          </View>
          <Text style={styles.text_footer}>Edit Your Property Name</Text>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholderTextColor="#05375a"
              placeholder="Property Name"
              value={Property_name}
              onChangeText={Property_name => setProperty_name(Property_name)}
            />
          </View>
          <Text style={styles.text_footer}>Edit Your City/Town/Village</Text>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholderTextColor="#05375a"
              placeholder="City/Town/Village"
              value={Area}
              onChangeText={Area => setArea(Area)}
            />
          </View>
          <Text style={styles.text_footer}>Edit Your State</Text>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholderTextColor="#05375a"
              placeholder="State"
              value={State}
              onChangeText={State => setState(State)}
            />
          </View>
          <Text style={styles.text_footer}>Edit Your Country</Text>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholderTextColor="#05375a"
              placeholder="Country"
              value={country}
              onChangeText={country => setcountry(country)}
            />
          </View>
          <Text style={styles.text_footer}>Edit Your Street</Text>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholderTextColor="#05375a"
              placeholder="Street"
              value={Street}
              onChangeText={Street => setStreet(Street)}
            />
          </View>
          <Text style={styles.text_footer}>
            Edit Your Apartment Number/House Number
          </Text>
          <View style={styles.action}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholderTextColor="#05375a"
              placeholder="Apartment Number/House Number"
              value={Door_Number}
              onChangeText={Door_Number => setDoor_Number(Door_Number)}
            />
          </View>

          <View style={styles.centeredView}>
            <Pressable style={styles.signIn} onPress={handleSubmitPress}>
              <LinearGradient
                colors={[`#008080`, '#01ab9d']}
                style={styles.signIn}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Submit
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default ModifyOwner;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: `#008080`,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    fontWeight: 'bold',
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
    borderWidth: 1,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  color_textPrivate: {
    color: 'grey',
  },
});
