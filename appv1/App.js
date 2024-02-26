import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ChatroomScreen from './screens/ChatroomScreen';
import MessagesScreen from './screens/MessagesScreen';
import Globalstate from './context';
import io from "socket.io-client"
import { useEffect } from 'react';
// navigation.navigate('Profile', {name: 'Jane'}) 
const stack = createNativeStackNavigator();

const config = {
  "headerShown": false
}

export default function App() {

  return (
    <Globalstate>
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen
          name='Home'
          component={HomeScreen}
          options={config}
        />
        <stack.Screen
          name='Chat'
          component={ChatroomScreen}
          options={config}
        />
        <stack.Screen
          name='Messages'
          component={MessagesScreen}
          options={config}
        />
      </stack.Navigator>
    </NavigationContainer>
    </Globalstate>
  );
}
