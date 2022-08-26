import React, { ReactElement } from 'react';

interface LayoutProps {
  children: ReactElement;
  options: {
    triggerFunctionKey: string;
    event: string;
    idKey: string;
  }[];
  trackEvent: (eventName: string) => void;
}

export const ComponentTracking: React.FC<LayoutProps> = ({
  children,
  ...otherProps
}) => {
  let newProps = { ...children?.props };
  const { options, trackEvent } = otherProps;
  try {
    if (children) {
      options?.forEach((option) => {
        const overridedProp = (...args: any) => {
          const result = children.props[option.triggerFunctionKey](...args);
          trackEvent(`${option.event}_${option.idKey}`);
          return result;
        };
        newProps[option.triggerFunctionKey] = overridedProp;
      });
    }
  } catch (error) {}
  const Element = React.cloneElement(children, newProps);
  return Element;
};
