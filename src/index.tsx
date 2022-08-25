import React, {ReactElement} from 'react';
import { TouchEventBoundary } from './TouchEventBoundary'

interface LayoutProps {
  children: ReactElement;
  triggerFunctionKey: string;
  event: string;
  idKey: string;
  trackEvent: (eventName: string) => void;
}

export const ComponentTracking: React.FC<LayoutProps> = ({
  children,
  ...otherProps
}) => {
  let newProps = {...children?.props};
  try {
    if (children) {
      const overridedProp = (...args: any) => {
        const result = children.props[otherProps.triggerFunctionKey](...args);
        otherProps.trackEvent(`${otherProps.event}_${otherProps.idKey}`);
        return result;
      };
      newProps[otherProps.triggerFunctionKey] = overridedProp;
    }
  } catch (error) {}
  const Element = React.cloneElement(children, newProps);
  return Element;
};

export {TouchEventBoundary}
