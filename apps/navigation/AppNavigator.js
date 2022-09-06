import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Customer from '../pages/Customer';
import FormCustomer from '../pages/FormCustomer';

const Stack = createNativeStackNavigator();
class AppNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Customer"
            component={Customer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FormCustomer"
            component={FormCustomer}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default AppNavigator;
