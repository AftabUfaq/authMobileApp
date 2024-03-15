import React from 'react';

import {View, Text, Dimensions, TouchableOpacity, Linking} from 'react-native';

const {width, height} = Dimensions.get('screen');
const CustomButton = ({label, link = null, text, onPress}) => {
  return (
    <View
      style={{
        width: width - 30,
        alignSelf: 'center',
        padding: 10,
        borderColor: '#0002',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
      }}>
      <Text style={{fontWeight: 'bold'}}>{label}</Text>
      {link != null && (
        <TouchableOpacity style={{width:width/3, height:30, justifyContent:"center"}} onPress={() => {
          Linking.openURL(link)
        }}>
          <Text style={{color:"#00F", fontWeight:"bold"}} >Read More</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={{
          width: width - 50,
          height: 45,
          marginTop: 5,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0090FF',
          borderRadius: 5,
        }}
        onPress={onPress}>
        <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
