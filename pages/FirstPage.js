import React, {useState, createRef} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
} from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const FirstPage = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      retrieve();
    }, []),
  );

  async function retrieve() {
    const read = await AsyncStorage.getItem('pwdstatus');
    console.log('read', read);
    if (read != null) {
      await AsyncStorage.setItem('pwdstatus', JSON.stringify(false));
    }
  }

  // const items = [
  //   // name key is must. It is to show the text in front
  //   {loc: 'angellist'},
  //   {loc: 'codepen'},
  //   {loc: 'envelope'},
  //   {loc: 'etsy'},
  //   {loc: 'facebook'},
  //   {loc: 'foursquare'},
  //   {loc: 'github-alt'},
  //   {loc: 'github'},
  //   {loc: 'gitlab'},
  //   {loc: 'instagram'},
  // ];
  // const [selectedItems, setSelectedItems] = useState([]);

  // const onSelectedItemsChange = selectedItems => {
  //   // Set Selected Items
  //   setSelectedItems(selectedItems);
  //   console.log(selectedItems);
  // };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <MultiSelect
        items={items}
        single={true}
        uniqueKey="loc"
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        selectText="Pick Items"
        searchInputPlaceholderText="Search Items..."
        onChangeInput={text => console.log(text)}
        tagRemoveIconColor="#CCC"
        tagBorderColor="#CCC"
        tagTextColor="#CCC"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#CCC"
        itemTextColor="#000"
        displayKey="loc"
        searchInputStyle={{color: '#CCC'}}
        submitButtonColor="#48d22b"
        submitButtonText="Submit"
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
});
export default FirstPage;
