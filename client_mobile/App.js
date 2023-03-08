import React from 'react';
import type { Node } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, IconButton, TextInput, Dialog, Portal, Button } from 'react-native-paper';
import LoginScreen from './src/Login';
import RegisterScreen from './src/Register';
import HomeScreen from './src/Home';
import WebviewScreen from './src/Webview';
import Fetch from './src/Fetch';

const Stack = createNativeStackNavigator();

const App: () => Node = () => {

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
    width: '100%',
    height: '100%',
  };

  const [api, setApi] = React.useState("https://api.zarea.fr");
  const [visible, setVisible] = React.useState(false);

  const ref = useNavigationContainerRef();

  const screens = [
    { name: 'Home', component: HomeScreen, options: { headerRight: () => <IconButton iconColor='black' onPress={() => Fetch(api + "/logout", {}, (json, response) => console.log(ref.reset({index: 0, routes: [{name: "Login"}]})))} icon={require("./res/logout.png")}/>} },
    { name: 'Login', component: LoginScreen, options: { headerRight: () => <IconButton iconColor='black' onPress={() => setVisible(true)} icon={require("./res/settings.png")}/>} },
    { name: 'Register', component: RegisterScreen, options: { headerRight: () => <IconButton iconColor='black' onPress={() => setVisible(true)} icon={require("./res/settings.png")}/>} },
    { name: 'Webview', component: WebviewScreen, options: { headerShown: false } },
  ];

  return (
    <PaperProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle='light-content' backgroundColor='#C0C0C0'/>
        <NavigationContainer ref={ref}>
          <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)} style={{backgroundColor: backgroundStyle.backgroundColor}}>
              <Dialog.Title style={{ color: 'black'}}>Change API URL</Dialog.Title>
              <Dialog.Content>
                <TextInput mode='outlined' style={{ backgroundColor: 'white' }} keyboardType="url" outlineColor="#C0C0C0" activeOutlineColor="#26547c" textColor='black' value={api} onChangeText={text => setApi(text)} placeholder={"Api url"} left={<TextInput.Icon iconColor='black' icon={require("./res/link.png")}/>}/>
              </Dialog.Content>
              <Dialog.Actions>
                <Button mode="outlined" buttonColor='#26547c' textColor='white' onPress={() => setVisible(false)}>Done</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Stack.Navigator initialRouteName='Login' style={{backgroundColor: "blue"}}>
            {screens.map((screen, index) => ( <Stack.Screen name={screen.name} initialParams={{ api: api }} options={screen.options} component={screen.component} key={index}/> ))}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default App;
