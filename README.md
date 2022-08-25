# react-native-components-tracking

React Native library to automatically track events on components.

## Features

- Track all touch events on the components tree
- Track component events on an easy way

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

```ts
import analytics from '@react-native-firebase/analytics';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { ComponentTracking } from '~/common/analytics/ComponentTracking';

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
      triggerFunctionKey={'onPress'}
      trackEvent={analytics().logEvent}
      event={'BUTTON_CLICK'}
      idKey={trackingIdKey}
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
      triggerFunctionKey={triggerFunctionKey}
      trackEvent={analytics().logEvent}
      event={baseEvent}
      idKey={trackingIdKey}
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

We show a basic example with a button but it works with any component we want to wrap. For example, if we want to track the event `onEndEditing` of text input we can do something like that:

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
      triggerFunctionKey={triggerFunctionKey}
      trackEvent={analytics().logEvent}
      event={baseEvent}
      idKey={trackingIdKey}
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

Another cool feature we included on this library is the possibility to track automatically all the touch events made into the application.
...

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Marcoo09"><img src="https://avatars.githubusercontent.com/Marcoo09" width="100px;" alt=""/><br /><sub><b>Marco Fiorito</b></sub></a></td>
  </tr>
</table>

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
