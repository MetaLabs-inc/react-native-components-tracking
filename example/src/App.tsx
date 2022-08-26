import * as React from 'react';
import { useState } from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  ComponentTracking,
  TouchEventBoundary,
} from 'react-native-components-tracking';

export default function App() {
  //TouchableOpacity
  const baseOnPress = () => {
    console.warn('button was pressed');
  };
  //TextInput
  const [text, onChangeText] = useState('');
  const onEndEditing = () => {
    console.warn('onEndEditing executed');
  };
  //Switch
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <TouchEventBoundary
      trackEvent={(event: string) => {
        console.warn('an event tracked with event boundary', event);
      }}
    >
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <ComponentTracking
            options={[
              {
                triggerFunctionKey: 'onEndEditing',
                event: 'ON_END_EDITTING',
                idKey: 'DUMMY_TEXT_INPUT',
              },
              {
                triggerFunctionKey: 'onChangeText',
                event: 'ON_CHANGE_TEXT',
                idKey: 'DUMMY_TEXT_INPUT',
              },
            ]}
            trackEvent={(event: string) => {
              console.warn('an text input tracked', event);
            }}
          >
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              onEndEditing={onEndEditing}
              value={text}
              placeholder={'Write something...'}
            />
          </ComponentTracking>
          <TouchableOpacity
            onPress={baseOnPress}
            style={styles.button}
            component-tracking-label={'dummy_button'}
          >
            <Text>Dummy button</Text>
          </TouchableOpacity>
          <ComponentTracking
            options={[
              {
                triggerFunctionKey: 'onValueChange',
                event: 'ON_VALUE_CHANGE',
                idKey: 'DUMMY_SWITCH',
              },
            ]}
            trackEvent={(event: string) => {
              console.warn('a switch tracked', event);
            }}
          >
            <Switch
              trackColor={{ false: '#767577', true: '#3E4DCE' }}
              thumbColor={isEnabled ? '#CD5C87' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </ComponentTracking>
          <Text style={styles.baseText} component-tracking-label={'dummy_text'}>
            An example text to be automatically tracked on press
          </Text>
        </ScrollView>
      </SafeAreaView>
    </TouchEventBoundary>
  );
}

const styles = StyleSheet.create({
  safeAreaViewContainer: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 200,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#FFD260',
    padding: 10,
  },
  baseText: {
    fontFamily: 'Cochin',
  },
});
