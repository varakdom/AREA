import { WebView } from 'react-native-webview';
import { View } from 'react-native';

export default function({route, navigation}) {
    return (
        <View style={{flex: 1}}>
            <WebView userAgent="Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.5304.105 Mobile Safari/537.36" style={{ flex: 1 }} source={{uri: route.params.api + "/" + route.params.url}} onNavigationStateChange={(state) => {
            if (state.url.startsWith("https://zarea.fr"))
              navigation.reset({index: 0, routes: [{name: 'Home', params: { api: route.params.api, new: true}}]});
            }}/>
        </View>
    );
}
