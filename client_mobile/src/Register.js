import { View, StyleSheet, TouchableOpacity, Text, ToastAndroid } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useState } from 'react';
import Fetch from './Fetch';

export default function ({route, navigation}) {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={styles.box}>
        <Text style={{fontSize: 24, color: "#26547c", fontWeight: "bold"}}>REGISTER</Text>
        <View style={styles.elem}>
          <TextInput mode='outlined' style={{ backgroundColor: 'white' }} outlineColor="#C0C0C0" activeOutlineColor="#26547c" textColor='black' value={name} onChangeText={text => setName(text)} placeholder={"Displayname"} left={<TextInput.Icon icon={require("../res/account-circle.png")}/>}/>
        </View>
        <View style={styles.elem}>
          <TextInput mode='outlined' style={{ backgroundColor: 'white' }} keyboardType="email-address" outlineColor="#C0C0C0" activeOutlineColor="#26547c" textColor='black' value={mail} onChangeText={text => setMail(text)} placeholder={"Email address"} left={<TextInput.Icon icon={require("../res/at.png")}/>}/>
        </View>
        <View style={styles.elem}>
          <TextInput mode='outlined' style={{ backgroundColor: 'white' }} secureTextEntry={true} outlineColor="#C0C0C0" activeOutlineColor="#26547c" textColor='black' value={password} onChangeText={text => setPassword(text)} placeholder={"Password"} left={<TextInput.Icon icon={require("../res/lock.png")}/>}/>
        </View>
        <View style={styles.elem}>
          <TextInput mode='outlined' style={{ backgroundColor: 'white' }} secureTextEntry={true} outlineColor="#C0C0C0" activeOutlineColor="#26547c" textColor='black' error={password !== confirmed} value={confirmed} onChangeText={text => setConfirmed(text)} placeholder={"Confirmed password"} left={<TextInput.Icon icon={require("../res/lock.png")}/>}/>
        </View>
        <View style={styles.elem}>
          <Button mode='outlined' loading={loading} onPress={() => {
            if (mail.length && password.length && !loading && password === confirmed && name.length) {
              setLoading(true);
              Fetch(route.params.api + "/register", { method: "POST", body: JSON.stringify({email: mail, password: password, name: name}) }, (json, response) => {
                setLoading(false);
                if (json)
                  response.status === 201 ? navigation.goBack() : ToastAndroid.show(json?.msg, ToastAndroid.SHORT);
              });
            }
          }} buttonColor='#26547c' textColor='white'>REGISTER</Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
    elevation: 50
  }, elem: {
    width: '100%',
    paddingHorizontal: 0,
    paddingVertical: 8
  }
});
