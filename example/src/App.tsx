import * as React from 'react';

import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { ComponentTracking, TouchEventBoundary, } from 'react-native-components-tracking';

export default function App() {
  const baseOnPress = () => {
    console.warn('button was pressed')
  }
  return (
    <TouchEventBoundary trackEvent={(event:string) => {
      console.warn('an event tracked with event boundary',event)
    }}>
      <View style={styles.container}>
        <ComponentTracking
          triggerFunctionKey={'onPress'}
          trackEvent={(event:string) => {
            console.warn('an event tracked',event)
          }}
          event={'BUTTON_CLICK'}
          idKey={'HELLO_WORLD'}>
          <TouchableOpacity
            onPress={baseOnPress}
            component-tracking-label={'hello_world'}
          >
            <Text>Hello World</Text>
          </TouchableOpacity>
        </ComponentTracking>
      </View>
    </TouchEventBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
