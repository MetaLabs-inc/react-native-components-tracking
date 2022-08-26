# react-native-components-tracking

React Native library that automatically tracks events on components.

## Features

- Track all touch events on the components tree
- Track component events easily

## Try it out

Run the [example](https://github.com/MetaLabs-inc/react-native-components-tracking/tree/development/example) app with [Expo](https://expo.dev/) to see it in action.

The source code for the examples are under the [/example](/example) folder.

## Installation

```sh
npm install react-native-components-tracking
```

or

```sh
yarn add react-native-components-tracking
```

## Usage

We will use Firebase Analytics in the examples made in this documentation.

### ComponentTracking

```ts
import analytics from '@react-native-firebase/analytics';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { ComponentTracking } from 'react-native-components-tracking';

import { styles } from './styles';

interface ExtraProps {
  title: string;
  dark?: boolean;
  disabled?: boolean;
  allowFontScaling?: boolean;
  trackingIdKey: string;
}

export type LayoutProps = TouchableOpacityProps & ExtraProps;

export const Button: React.FC<LayoutProps> = (props) => {
  const {
    title,
    onPress,
    disabled = false,
    style = {},
    allowFontScaling = true,
    trackingIdKey,
  } = props;

  return (
    <ComponentTracking
      trackingOptions={[
        {
          triggerFunctionKey: 'onPress',
          event: 'BUTTON_CLICK',
          idKey: trackingIdKey,
        },
      ]}
      trackEvent={analytics().logEvent}
    >
      <TouchableOpacity
        {...props}
        style={[styles.buttonContainer, styles.shadow, style]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text allowFontScaling={allowFontScaling}>{title}</Text>
      </TouchableOpacity>
    </ComponentTracking>
  );
};
```

Above, we defined a generic Button component which receives a trackingIdKey which will be used to customize the tracking event for each Button.
Then we will use the button like any other component and it will track the `BUTTON_CLICK_${trackingIdKey}` event when it is pressed.

Also, we can make it a bit more generic and receive not only the trackingIdKey but also the base event name and the triggerFunctionKey:

```ts
export const Button: React.FC<LayoutProps> = (props) => {
  const {
    title,
    onPress,
    disabled = false,
    style = {},
    allowFontScaling = true,
    trackingIdKey,
    baseEvent,
    triggerFunctionKey,
  } = props;

  return (
    <ComponentTracking
      trackingOptions={[
        {
          triggerFunctionKey,
          event: baseEvent,
          idKey: trackingIdKey,
        },
      ]}
      trackEvent={analytics().logEvent}
    >
      <TouchableOpacity
        {...props}
        style={[styles.buttonContainer, styles.shadow, style]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text allowFontScaling={allowFontScaling}>{title}</Text>
      </TouchableOpacity>
    </ComponentTracking>
  );
};
```

We show a basic example with a button but it works with any component we want to wrap. For example, if we want to track the event `onEndEditing` of text input we can do something like this:

1. Create a generic text input component.

```ts
export const CustomTextInput: React.FC<LayoutProps> = (props) => {
  const {
    onEndEditing,
    onChangeText,
    style = {},
    placeholder,
    trackingIdKey,
    baseEvent,
    triggerFunctionKey,
  } = props;

  return (
    <ComponentTracking
      trackingOptions={[
        {
          triggerFunctionKey,
          event: baseEvent,
          idKey: trackingIdKey,
        },
      ]}
      trackEvent={analytics().logEvent}
    >
      <TextInput
        style={style}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
        value={text}
        placeholder={placeholder}
      />
    </ComponentTracking>
  );
};
```

2. Use it sending the triggerFunctionKey and baseEvent

```ts
  <CustomTextInput
    triggerFunctionKey={'onEndEditing'}
    baseEvent={'ON_END_EDITTING'}
    trackingIdKey={'DUMMY_TEXT_INPUT'}
    onChangeText={() => {
      console.warn('Your onChangeText function')
      }
    }
    onEndEditing={() => {
      console.warn('Your onEndEditing function')
      }
    }>
```

In the examples above, we showed components with a single `triggerFunctionKey` to call, but ComponentTracking allows us to send a series of tracking options in case you want to automatically track more than one event.

### TouchEventBoundary

Another cool feature we included on this library is the possibility to track automatically all the touch events made into the application.

To use this feature you should:

1. Wrap your app on the `TouchEventBoundary` component
2. Specify `component-tracking-label` on each component you want to track touches

```ts
import * as React from 'react';
import { useState } from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { TouchEventBoundary } from 'react-native-components-tracking';

export default function App() {
  //TouchableOpacity
  const baseOnPress = () => {
    console.warn('button was pressed');
  };

  return (
    <TouchEventBoundary
      trackEvent={(event: string) => {
        console.warn('an event tracked with event boundary', event);
      }}
    >
      <SafeAreaView style={styles.safeAreaViewContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            onPress={baseOnPress}
            style={styles.button}
            component-tracking-label={'dummy_button'}
          >
            <Text>Dummy button</Text>
          </TouchableOpacity>
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
  button: {
    alignItems: 'center',
    backgroundColor: '#FFD260',
    padding: 10,
  },
  baseText: {
    fontFamily: 'Cochin',
  },
});
```

### Props

**category** \
The category assigned to the breadcrumb that is logged by the touch event.

**type** \
The type assigned to the breadcrumb that is logged by the touch event.

**maxComponentTreeSize** \
default: 20. The max number/depth of components to display when logging a touch's component tree.

**ignoreNames** \
Array<string | RegExp>, Accepts strings and regular expressions. Component names to ignore when logging the touch event. This prevents useless logs such as: "Touch event within element: View", where you still can't tell which specific View it occurred in.

---

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Made with ❤️ at MetaLabs

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Marcoo09"><img src="https://avatars.githubusercontent.com/Marcoo09" width="100px;" alt=""/><br /><sub><b>Marco Fiorito</b></sub></a></td>
    <td align="center"><a href="https://github.com/matiassalles99"><img src="https://avatars.githubusercontent.com/matiassalles99" width="100px;" alt=""/><br /><sub><b>Matias Salles</b></sub></a></td>
    <td align="center"><a href="https://github.com/grazo99"><img src="https://avatars.githubusercontent.com/grazo99" width="100px;" alt=""/><br /><sub><b>Graziano Pascale</b></sub></a></td>
    <td align="center"><a href="https://github.com/leanribeiro"><img src="https://avatars.githubusercontent.com/leanribeiro" width="100px;" alt=""/><br /><sub><b>Leandro Ribeiro</b></sub></a></td>
  </tr>
</table>

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
