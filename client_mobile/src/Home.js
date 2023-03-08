import { Button, Dialog, Portal, Text, TextInput } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown'
import { View, TouchableOpacity, ToastAndroid } from 'react-native';
import { useEffect, useState } from 'react';
import Fetch from './Fetch';
import  Discord from '../res/Discord';
import Facebook from '../res/Facebook';
import Github from '../res/Github';
import Twitch from '../res/Twitch';
import Twitter from '../res/Twitter';
import Spotify from '../res/Spotify';
import Trello from '../res/Trello';

const components = {
    'discord': Discord,
    'facebook': Facebook,
    'github': Github,
    'twitch': Twitch,
    'twitter': Twitter,
    'spotify': Spotify,
    'trello': Trello,
};

export default function({route, navigation}) {
  const [services, setServices] = useState({});
  const [visible, setVisible] = useState(false);
  const [provider, setProvider] = useState(null);
  const [action, setAction] = useState('');
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [actionParams, setActionParams] = useState({});
  const [reactionProvider, setReactionProvider] = useState(null);
  const [reaction, setReaction] = useState('');
  const [showReactionProviderDropdown, setShowReactionProviderDropdown] = useState(false);
  const [showReactionDropdown, setShowReactionDropdown] = useState(false);
  const [reactionParams, setReactionParams] = useState({});
  const [loading, setLoading] = useState(false);

  clear = () => {
    setAction('');
    setActionParams({});
    setReactionProvider(null);
    setReaction('');
    setReactionParams({});
  };

  SetAction = (Action) => {
    setAction(Action);
    setActionParams({});
  };

  SetReactionProvider = (Provider) => {
    setReactionProvider(Provider);
    setReaction('');
    setReactionParams({});
  };

  SetReaction = (Reaction) => {
    setReaction(Reaction);
    setReactionParams({});
  };

  if (route.params.new) {
    Fetch(route.params.api + "/services", {}, (json, response) => setServices(json));
    route.params.new = false;
  }

  if (route.params.user)
    navigation.setOptions({ title: "Welcome " + route.params.user });
  else
    useEffect(() => { Fetch(route.params.api + "/profile", {}, (json, response) => { json ? navigation.setOptions({ title: "Welcome " + json }) : null }) }, []);

  return (
    <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row'}}>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Add {provider} action</Dialog.Title>
          <Dialog.Content>
            <DropDown label="Action" mode='outlined' value={action} setValue={SetAction} visible={showActionDropdown} showDropDown={() => setShowActionDropdown(true)} onDismiss={() => setShowActionDropdown(false)} list={provider ? Object.keys(services[provider].actions).map(value => { return ({label: services[provider].actions[value].title, value: value}) }) : []} />
            { action?.length ? <Text>Action parameter(s)</Text> : null }
            { action?.length ? services[provider].actions[action].input.map((input) => <TextInput key={input.title} label={input.title} value={actionParams[input.value]} onChangeText={text => setActionParams({...actionParams, [input.value]: text})} />) : null}
            <Text>Reaction</Text>
            <DropDown label="Provider" mode='outlined' value={reactionProvider} setValue={SetReactionProvider} visible={showReactionProviderDropdown} showDropDown={() => setShowReactionProviderDropdown(true)} onDismiss={() => setShowReactionProviderDropdown(false)} list={Object.keys(services).map(value => { const Component = components[value]; return ({label: value.charAt(0).toUpperCase() + value.slice(1), value: value, custom: <View style={{flexDirection: 'row'}}>{Component ? <Component width={32} height={32}/> : null}<Text style={{marginLeft: 10}}>{value.charAt(0).toUpperCase() + value.slice(1)}</Text></View>}) })} />
            { reactionProvider?.length ? <DropDown label="Reaction" mode='outlined' value={reaction} setValue={SetReaction} visible={showReactionDropdown} showDropDown={() => setShowReactionDropdown(true)} onDismiss={() => setShowReactionDropdown(false)} list={reactionProvider ? Object.keys(services[reactionProvider].reactions).map(value => { return ({label: services[reactionProvider].reactions[value].title, value: value}) }) : []} /> : null }
            { reaction?.length ? <Text>Reaction parameter(s)</Text> : null }
            { reaction?.length ? services[reactionProvider].reactions[reaction].input.map((input) => <TextInput key={input.title} label={input.title} value={reactionParams[input.value]} onChangeText={text => setReactionParams({...reactionParams, [input.value]: text})} />) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button loading={loading} mode="outlined" buttonColor='#26547c' textColor='white' onPress={() => { setLoading(true); Fetch(route.params.api + "/area", { method: "POST", body: JSON.stringify({provider: provider, action: action, params: actionParams, rprovider: reactionProvider, reaction: reaction, rparams: reactionParams})}, (json, response) => { setLoading(false); response.status !== 201 ? ToastAndroid.show(response.status + " - " + json?.msg, ToastAndroid.SHORT) : setVisible(false); })}}>ADD ACTION</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={{flexDirection: 'column'}}>
        {
          Object.keys(services).filter((value, index) => !(index % 2)).map((service, index) => {
            const Component = components[service];

            return (Component ?
              <TouchableOpacity activeOpacity={services[service].connected ? 1 : 0.2} key={index} style={{backgroundColor: 'white', borderRadius: 10, padding: 20, elevation: 20, marginVertical: 20, alignItems: 'center', alignSelf: 'center'}} onPress={() => !services[service].connected ? navigation.navigate("Webview", { url: `${service}_login`}) : null}>
                <Component width={60} height={60}/>
                { services[service].connected ? <Button mode="outlined" buttonColor='#26547c' textColor='white' style={{marginTop: 15}} onPress={() => { clear(); setProvider(service); setVisible(true)}}>CONFIGURE</Button> : null}
              </TouchableOpacity>
            : null);
          })
        }
      </View>
      <View style={{flexDirection: 'column'}}>
        {
          Object.keys(services).filter((value, index) => index % 2).map((service, index) => {
            const Component = components[service];

            return (Component ?
              <TouchableOpacity activeOpacity={services[service].connected ? 1 : 0.2} key={index} style={{backgroundColor: 'white', borderRadius: 10, padding: 20, elevation: 20, marginVertical: 20, alignItems: 'center', alignSelf: 'center'}} onPress={() => !services[service].connected ? navigation.navigate("Webview", { url: `${service}_login`}) : null}>
                <Component width={60} height={60}/>
                { services[service].connected ? <Button mode="outlined" buttonColor='#26547c' textColor='white' style={{marginTop: 15}} onPress={() => { clear(); setProvider(service); setVisible(true)}}>CONFIGURE</Button> : null}
              </TouchableOpacity>
            : null);
          })
        }
      </View>
    </View>
  );
}
