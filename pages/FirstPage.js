var CryptoJS = require('crypto-js');
import React, {useState, createRef} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  StatusBar,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';

import {Icon, Fab, Button} from 'native-base';
import * as Animatable from 'react-native-animatable';

import LinearGradient from 'react-native-linear-gradient';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Feather from 'react-native-vector-icons/Feather';
import Slider from '@react-native-community/slider';

import MultiSelect from 'react-native-multiple-select';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
var db = openDatabase({name: 'UserDatabase.db'});
import TcpSocket from 'react-native-tcp-socket';
const FirstPage = ({navigation}) => {
  const [selectedloc, setselectedloc] = useState([]);
  const [selectloc, setselectloc] = useState([]);
  const [selectedappliance, setselectedappliance] = useState([]);
  const [selectappliance, setselectappliance] = useState([]);
  const [selectedproperty, setselectedproperty] = useState([]);
  const [selectproperty, setselectproperty] = useState([]);
  const [selectedvaildstate, setselectedvaildstate] = useState([]);
  const [selectvaildstate, setselectvaildstate] = useState([]);
  const [mapped_data, setmappeddata] = useState([]);
  const [owner, setowner] = useState([]);
  const [get, setget] = useState('');
  const [tempo, settempo] = useState('');
  const [arrlen, setarrlen] = useState(null);
  const [minval, setminval] = useState(null);
  const [maxval, setmaxval] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      retrieve();
    }, []),
  );
  //after location is chosen
  const selectedlocation = selectedItems => {
    console.log(selectedItems.toString());
    setselectloc(selectedItems);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT appliance FROM Binding_Reg where location=? and paired_unpaired=? ',
        [selectedItems.toString(), 'paired'],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          console.log('appliance', temp);
          setselectappliance(temp);
          // setasyncapp(temp);
        },
      );
    });
  };
  //after appliance is chosen
  const appliance = selectedItems => {
    console.log(selectedItems.toString());
    setselectedappliance(selectedItems);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Binding_Reg where (location =? and appliance=?); ',
        [selectloc.toString(), selectedItems.toString()],
        (tx, results) => {
          var temp = [];
          var res = results.rows.item(0);
          console.log('database data', res);
          var property = res.properties.toString().split(';');
          console.log('property===>', property);
          var validstate = res.Valid_States.toString().split(';');
          console.log('valid state===>', validstate);
          var output = res.output.toString().split(';');
          console.log('output===>', output);
          var espin = res.ESP_pin.toString().split(';');
          console.log('espin===>', espin);
          var productid = res.ACS_controller_model.toString().split('#');
          console.log('productid====>', productid);
          var macid = res.macid.toString().split('#');
          console.log('macid====>', macid);
          var ipaddress = res.ipaddress.toString().split('#');
          console.log('ipaddress====>', ipaddress);
          var portnumber = res.portnumber.toString().split('#');
          console.log('portnumber====>', portnumber);
          let result = property.map((property, i) => ({
            property,
            validstate: validstate[i],
            output: output[i],
            esp_pin: espin[i],
            productid: productid[0],
            macid: macid[0],
            ipaddress: ipaddress[0],
            portnumber: portnumber[0],
          }));
          console.log('mapped data', result);

          // const map = new Map();
          // for (let i = 0; i < property.length; i++) {
          //   map.set(property[i], validstate[i]);
          // }
          //  console.log('mapped values', map);
          // var result = validstate.reduce(function (result, field, index) {
          //   result[property[index]] = field;
          //   return result;
          // }, {});

          // console.log('result', result);
          // var modified = result.Speed.toString().split(',');
          // console.log('modified', modified);

          // property.forEach(property => {
          //   temp.push({property});
          // });
          // console.log(temp);
          setmappeddata(result);
          setselectproperty(result);
        },
        (tx, error) => {
          console.log(error);
        },
      );
    });
  };

  //after property is chosen
  const property = selectedItems => {
    //console.log(selectedItems);
    setselectedproperty(selectedItems);
    //console.log(mapped_data);
    const findvalidstate = mapped_data.find(x =>
      x.property.includes(selectedItems.toString()),
    );

    console.log('findvalidstate====>', findvalidstate.validstate);

    let valid = findvalidstate.validstate.toString();
    let valid_state = valid.split(',');
    console.log(valid_state);
    settempo(valid_state);
    setarrlen(valid_state.length);
    setminval(valid_state[0]);
    setmaxval(valid_state[valid_state.length - 1]);
    var temp = [];
    valid_state.forEach(valid_state => {
      temp.push({valid_state});
    });
    console.log(temp);
    setselectvaildstate(temp);
  };
  const validstates = selectedItems => {
    console.log(selectedItems);
    setselectedvaildstate(selectedItems);
  };

  async function retrieve() {
    const read = await AsyncStorage.getItem('pwdstatus');
    //  console.log('read', read);
    if (read != null) {
      await AsyncStorage.setItem('pwdstatus', JSON.stringify(false));
    }

    db.transaction(tx => {
      tx.executeSql(
        'SELECT DISTINCT location FROM Binding_Reg',
        [],
        (tx, results) => {
          var temp = [];
          for (let j = 0; j < results.rows.length; ++j)
            temp.push(results.rows.item(j));
          setselectedloc(temp);
        },
      );
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Owner_Reg', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        let ownerdata_obj = temp;
        // console.log(ownerdata_obj[0]);
        setowner(ownerdata_obj[0]);
      });
    });
  }

  function handlesubmit() {
    if (selectloc.length == 0) {
      alert('Please enter location');
      return;
    }
    if (selectedappliance.length == 0) {
      alert('Please enter appliance');
      return;
    }
    if (selectedproperty.length == 0) {
      alert('Please enter property');
      return;
    }
    if (selectedvaildstate.length == 0) {
      alert('Please enter vaild state');
      return;
    }
    console.log('hello', selectedvaildstate);
    // console.log('mapped_data', mapped_data);
    // const findobj = mapped_data.find(x =>
    //   x.property.includes(selectedproperty.toString()),
    // );
    // console.log('findobj', findobj);
    // var validstate = findobj.validstate.toString().split(',');
    // console.log('valid state===>', validstate);
    // var output = findobj.output.toString().split(',');
    // console.log('output===>', output);
    // let result = validstate.map((validstate, i) => ({
    //   validstate,
    //   output: output[i],
    // }));
    // console.log('submapping==>', result);
    // const findoutput = result.find(x =>
    //   x.validstate.includes(selectedvaildstate.toString()),
    // );
    // console.log('output found===>', findoutput);
    // console.log('ip adresss found===>', findobj.ipaddress);
    // console.log('port  found===>', findobj.portnumber);
    // /// SET/PANSHUL;24:62:AB:F2:8D:5C/0-0;GPIO0;
    // let setstring =
    //   findobj.macid +
    //   '/' +
    //   'SET' +
    //   '/' +
    //   // owner.owner_name +
    //   // ';' +
    //   // findobj.productid +
    //   // '_' +
    //   // findobj.macid +
    //   // '/' +
    //   findoutput.output +
    //   ';' +
    //   findobj.esp_pin +
    //   // ';' +
    //   '#';
    // console.log('set string===>', setstring);
    // let client = TcpSocket.createConnection(
    //   {port: findobj.portnumber, host: findobj.ipaddress},
    //   () => {
    //     client.write(setstring.toString());
    //   },
    // );
    // client.on('connect', () => {
    //   console.log('Opened client on ' + JSON.stringify(client.address()));
    // });
    // client.on('data', data => {
    //   console.log('message was received from ESP32 ==>', data.toString());
    //   client.end();
    // });
    // client.on('error', error => {
    //   console.log('error', error);
    //   Alert.alert('please check your wifi connection');
    //   client.end();
    // });
    // client.on('close', () => {
    //   console.log('Connection closed!');
    //   client.end();
    // });
    // // OUTPUT
    // console.log(encode()); // 'NzUzMjI1NDE='
    // console.log(decode()); // '75322541'
    // function encode() {
    //   // INIT
    //   const myString =
    //     'Owner_name;controller_Key;Device_name;Device_Model;Custom_SSID;Custom_Password;DAQ_STACTIC_IP;DAQ_STACTIC_Port;Device_IP;Device_Port;Device_SSID;Device_Password;'; // Utf8-encoded string
    //   // PROCESS
    //   const encodedWord = CryptoJS.enc.Utf8.parse(myString); // encodedWord Array object
    //   const encoded = CryptoJS.enc.Base64.stringify(encodedWord);
    //   return encoded;
    // }
    // function decode() {
    //   // INIT
    //   const encoded =
    //     'T3duZXJfbmFtZTtjb250cm9sbGVyX0tleTtEZXZpY2VfbmFtZTtEZXZpY2VfTW9kZWw7Q3VzdG9tX1NTSUQ7Q3VzdG9tX1Bhc3N3b3JkO0RBUV9TVEFDVElDX0lQO0RBUV9TVEFDVElDX1BvcnQ7RGV2aWNlX0lQO0RldmljZV9Qb3J0O0RldmljZV9TU0lEO0RldmljZV9QYXNzd29yZDs='; // Base64 encoded string
    //   // PROCESS
    //   const encodedWord = CryptoJS.enc.Base64.parse(encoded); // encodedWord via Base64.parse()
    //   const decoded = CryptoJS.enc.Utf8.stringify(encodedWord); // decode encodedWord via Utf8.stringify()
    //   return decoded;
    // }

    // var key = 'abcdefghijklmnop'.split('').reverse('').join('');
    // let setstring = 'Hello am Sahique';
    // var ciph = 'e5d4b746b127a03a90bbdd67c75e90ef'
    //   .split('')
    //   .reverse('')
    //   .join('');
    // console.log(key);
    // console.log(ciph);
    // // var ciphertext = CryptoJS.AES.encrypt(setstring, key).toString();
    // // console.log('cipher text==>', ciphertext);
    // // Decrypt
    // var bytes = CryptoJS.AES.decrypt(ciph, key);
    // // console.log(bytes);
    // var originalText = bytes.toString(CryptoJS.enc.Utf8);
    // console.log('deciphered original text====>', originalText);
    // e5d4b746b127a03a90bbdd67c75e90ef
    // "abcdefghijklmnop"
    // Hello am Sahique
  }

  function handlecheck() {
    if (selectloc.length == 0) {
      alert('Please enter location');
      return;
    }
    if (selectedappliance.length == 0) {
      alert('Please enter appliance');
      return;
    }
    if (selectedproperty.length == 0) {
      alert('Please enter property');
      return;
    }
    const findobj = mapped_data.find(x =>
      x.property.includes(selectedproperty.toString()),
    );
    console.log('findobj', findobj);
    let getstring =
      findobj.macid +
      '/' +
      'GET' +
      '/' +
      owner.owner_name +
      ';' +
      // findobj.productid +
      // '_' +
      findobj.macid +
      ';' +
      findobj.esp_pin +
      ';' +
      '#';
    console.log('check string===>', getstring);
    let client = TcpSocket.createConnection(
      {port: findobj.portnumber, host: findobj.ipaddress},
      () => {
        client.write(getstring.toString());
      },
    );
    client.on('connect', () => {
      console.log('Opened client on ' + JSON.stringify(client.address()));
    });
    client.on('data', data => {
      console.log('message was received from ESP32 ==>', data.toString());
      if (data.toString()) {
        updatebinding(data.toString());
      }
      //HW,Swing,GPIO2,do,OUTPUT,0,0,0.00;
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

  function updatebinding(data) {
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE Binding_Reg SET status=? where (location=? AND  appliance=?);',
        [data, selectloc, selectedappliance],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            navigation.navigate('DummyScreen', {
              paramKey: 'check',
            });
            setget(data);
          }
        },
        (tx, error) => {
          console.log(error);
        },
      );
    });
  }

  function micpress() {
    console.log('mic');
  }

  function range(start, end) {
    return Array(end - start + 1)
      .fill()
      .map((_, idx) => start + idx);
  }

  sliderValueChange = value => {
    //console.log('arrlen', arrlen);
    // console.log('tempo', tempo);
    // var result = range(1, arrlen);
    // //console.log('result', result);

    // const output = result.reduce((prev, curr) =>
    //   Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev,
    // );
    // //console.log(output);
    // var finalop = tempo[output - 1];
    // console.log('finalop', finalop);
    // setselectedvaildstate(finalop);

    console.log('value', value);
    let index = value * (arrlen - 1);
    console.log('index', index);
    var finalop = tempo[index];
    console.log('finalop', finalop);
    setselectedvaildstate(finalop);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#008080" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Control Now!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'orange',
          }}>
          <Button transparent onPress={() => handlesubmit()}>
            <Icon name="analytics" style={{fontSize: 30, color: 'green'}} />
          </Button>
          <Button transparent onPress={() => handlecheck()}>
            <Icon
              name="information-outline"
              style={{fontSize: 30, color: 'red'}}
            />
          </Button>
        </View>
        <Text style={styles.text_footer}>Enter Your Location </Text>
        <View>
          <MultiSelect
            items={selectedloc}
            single={true}
            uniqueKey="location"
            onSelectedItemsChange={selectedlocation}
            selectedItems={selectloc}
            selectText="Pick location"
            searchInputPlaceholderText="Search Items..."
            onChangeInput={text => console.log(text)}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="location"
            searchInputStyle={{color: '#CCC'}}
            submitButtonColor="#48d22b"
            submitButtonText="Submit"
          />
        </View>
        <Text style={styles.text_footer}>Enter Your Appliance </Text>
        <View>
          <MultiSelect
            items={selectappliance}
            single={true}
            uniqueKey="appliance"
            onSelectedItemsChange={appliance}
            selectedItems={selectedappliance}
            selectText="Pick Appliance"
            searchInputPlaceholderText="Search Items..."
            onChangeInput={text => console.log(text)}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="appliance"
            searchInputStyle={{color: '#CCC'}}
            submitButtonColor="#48d22b"
            submitButtonText="Submit"
          />
        </View>
        <Text style={styles.text_footer}>Enter Your Control</Text>
        <View>
          <MultiSelect
            items={selectproperty}
            single={true}
            uniqueKey="property"
            onSelectedItemsChange={property}
            selectedItems={selectedproperty}
            selectText="Pick Control"
            searchInputPlaceholderText="Search Items..."
            onChangeInput={text => console.log(text)}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="property"
            searchInputStyle={{color: '#CCC'}}
            submitButtonColor="#48d22b"
            submitButtonText="Submit"
          />
        </View>
        <Text style={styles.text_footer}>Enter Your Setting </Text>
        <View>
          <Slider
            style={{width: '100%', height: 40}}
            step={1 / (arrlen - 1)}
            minimumValue={0}
            maximumValue={1}
            //arrlen = len of array of states for this control
            //min val = o ,max val =1 ,step = (max-min)/(arrlen-1)
            //index = (slidervalue * (arrlen-1)) === round to integer
            onValueChange={value => {
              sliderValueChange(value);
            }}
            thumbTintColor="rgb(252, 228, 149)"
            maximumTrackTintColor="#d3d3d3"
            minimumTrackTintColor="rgb(252, 228, 149)"
          />

          <View style={styles.textCon}>
            <Text style={styles.colorGrey}>{selectedvaildstate}</Text>
            {/* {tempo.length > 0 ? (
              <>
                {tempo.map(shop => {
                  return (
                    <Text key={shop} style={styles.colorGrey}>
                      {shop}
                    </Text>
                  );
                })}
              </>
            ) : (
              <></>
            )} */}
            {/* <Text>{minval}</Text>
            <Text style={styles.colorYellow}>{selectedvaildstate}</Text>
            <Text style={styles.colorGrey}>{maxval} </Text> */}
          </View>
          {/* <MultiSelect
            items={selectvaildstate}
            single={true}
            uniqueKey="valid_state"
            onSelectedItemsChange={validstates}
            selectedItems={selectedvaildstate}
            selectText="Pick Setting"
            searchInputPlaceholderText="Search Items..."
            onChangeInput={text => console.log(text)}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="valid_state"
            searchInputStyle={{color: '#CCC'}}
            submitButtonColor="#48d22b"
            submitButtonText="Submit"
          /> */}
        </View>
        <View style={styles.action}>
          <TextInput
            style={styles.textInput}
            autoCapitalize="none"
            placeholderTextColor="#05375a"
            placeholder="your current value"
            defaultValue={get}
          />
        </View>
      </Animatable.View>
      <Fab
        style={{backgroundColor: '#05375a'}}
        position="topRight"
        onPress={() => micpress()}>
        <Icon name="mic" />
      </Fab>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: `#008080`,
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
    justifyContent: 'center',
    alignItems: 'center',
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
  textCon: {
    width: 320,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorGrey: {
    color: 'black',
  },
  colorYellow: {
    color: 'rgb(252, 228, 149)',
  },
});
export default FirstPage;
