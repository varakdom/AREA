import { View, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useState } from 'react';
import Fetch from './Fetch';
import Facebook from '../res/Facebook';
import Microsoft from '../res/Microsoft';
import Google from '../res/Google';

const buttons = [
  { src: <Google width={42} height={42}/>, url: "google_login" },
  { src: <Facebook width={42} height={42}/>, url: "facebook_login" },
  { src: <Microsoft width={42} height={42}/>, url: "azure_login" },
];

export default function({route, navigation}) {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={styles.box}>
        <Text style={{fontSize: 24, color: "#26547c", fontWeight: "bold"}}>LOGIN</Text>
        <View style={styles.elem}>
          <TextInput mode='outlined' style={{ backgroundColor: 'white' }} keyboardType="email-address" outlineColor="#C0C0C0" activeOutlineColor="#26547c" textColor='black' value={mail} onChangeText={text => setMail(text)} placeholder={"Email address"} left={<TextInput.Icon icon={require("../res/account-circle.png")}/>}/>
        </View>
        <View style={styles.elem}>
          <TextInput mode='outlined' style={{ backgroundColor: 'white' }} secureTextEntry={true} outlineColor="#C0C0C0" activeOutlineColor="#26547c" textColor='black' value={password} onChangeText={text => setPassword(text)} placeholder={"Password"} left={<TextInput.Icon icon={require("../res/lock.png")}/>}/>
        </View>
        <View style={styles.elem}>
          <Button mode="outlined" loading={loading} onPress={() => {
            if (mail.length && password.length && !loading) {
              setLoading(true);
              Fetch(route.params.api + "/login", { method: "POST", body: JSON.stringify({email: mail, password: password}) }, (json, response) => {
                Fetch(route.params.api + "/profile", {}, (json, response) => {
                  setLoading(false);
                  if (json && response.status == 200)
                    navigation.reset({index: 0, routes: [{name: 'Home', params: { api: route.params.api, new: true, user: json}}]});
                  else
                    ToastAndroid.show("Wrong username or password!", ToastAndroid.SHORT);
                });
              });
            }
          }} buttonColor='#26547c' textColor='white'>LOGIN</Button>
        </View>
        <View style={{...styles.elem, flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{ color: "grey" }}>New ?</Text>
          <Button mode='text' textColor='#26547c' onPress={() => navigation.navigate('Register', route.params)}>REGISTER</Button>
        </View>
        <View style={{ justifyContent: 'space-around', alignItems: 'center', justifyContent: 'center', width: '100%', flexDirection: 'row' }}>
          <View style={{width: 100, height: 2, backgroundColor: '#C0C0C0'}} />
          <Text style={{ marginTop: 5, color: "grey", paddingHorizontal: 10, paddingBottom: 7 }}>OR</Text>
          <View style={{width: 100, height: 2, backgroundColor: '#C0C0C0'}} />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
          { buttons.map((button, index) =>
            <TouchableOpacity key={index} onPress={() => navigation.navigate('Webview', { api: route.params.api, url: button.url }) }>
              {button.src}
            </TouchableOpacity>)
          }
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
