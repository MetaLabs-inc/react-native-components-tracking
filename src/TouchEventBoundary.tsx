import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export type TouchEventBoundaryProps = {
  /**
   * The category assigned to the breadcrumb that is logged by the touch event.
   */
  category?: string;
  /**
   * The type assigned to the breadcrumb that is logged by the touch event.
   */
  type?: string;
  /**
   * The max number of components to display when logging a touch's component tree.
   */
  maxComponentTreeSize?: number;
  /**
   * Component name(s) to ignore when logging the touch event. This prevents unhelpful logs such as
   * "Touch event within element: View" where you still can't tell which View it occurred in.
   */
  ignoreNames?: Array<string | RegExp>;
  /**
   * The track event method triggered when a touch event is detected
   */
  trackEvent: (eventName: string) => void;
};

const touchEventStyles = StyleSheet.create({
  wrapperView: {
    flex: 1,
  },
});

const DEFAULT_CATEGORY = 'touch';
const DEFAULT_TYPE = 'user';
const DEFAULT_MAX_COMPONENT_TREE_SIZE = 20;
const PROP_KEY = 'component-tracking-label';

interface ElementInstance {
  elementType?: {
    displayName?: string;
    name?: string;
  };
  memoizedProps?: Record<string, unknown>;
  return?: ElementInstance;
}

/**
 * Boundary to log breadcrumbs for interaction events.
 */
class TouchEventBoundary extends React.Component<TouchEventBoundaryProps> {
  public static displayName: string = '__ComponentTracking.TouchEventBoundary';
  public static defaultProps: Partial<TouchEventBoundaryProps> = {
    category: DEFAULT_CATEGORY,
    type: DEFAULT_TYPE,
    ignoreNames: [],
    maxComponentTreeSize: DEFAULT_MAX_COMPONENT_TREE_SIZE,
    trackEvent: () => {
      console.warn('**trackEvent not defined**');
    },
  };

  /**
   *
   */
  public render(): React.ReactNode {
    return (
      <View
        style={touchEventStyles.wrapperView}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onTouchStart={this._onTouchStart.bind(this) as any}
      >
        {this.props.children}
      </View>
    );
  }

  /**
   * Logs the touch event given the component tree names and a label.
   */
  private _logTouchEvent(
    _componentTreeNames: string[],
    activeLabel?: string
  ): void {
    this.props.trackEvent(
      `${this.props.category}_${this.props.type}_${activeLabel}`
    );
  }

  /**
   * Checks if the name is supposed to be ignored.
   */
  private _isNameIgnored(name: string): boolean {
    let ignoreNames = this.props.ignoreNames || [];

    return ignoreNames.some(
      (ignoreName: string | RegExp) =>
        (typeof ignoreName === 'string' && name === ignoreName) ||
        (ignoreName instanceof RegExp && name.match(ignoreName))
    );
  }

  /**
   * Traverses through the component tree when a touch happens and logs it.
   * @param e
   */
  // eslint-disable-next-line complexity
  private _onTouchStart(e: { _targetInst?: ElementInstance }): void {
    if (e._targetInst) {
      let currentInst: ElementInstance | undefined = e._targetInst;

      let activeLabel: string | undefined;
      let activeDisplayName: string | undefined;
      const componentTreeNames: string[] = [];

      while (
        currentInst &&
        // maxComponentTreeSize will always be defined as we have a defaultProps. But ts needs a check so this is here.
        this.props.maxComponentTreeSize &&
        componentTreeNames.length < this.props.maxComponentTreeSize
      ) {
        if (
          // If the loop gets to the boundary itself, break.
          currentInst.elementType?.displayName ===
          TouchEventBoundary.displayName
        ) {
          break;
        }

        const props = currentInst.memoizedProps;
        const label =
          typeof props?.[PROP_KEY] !== 'undefined'
            ? `${props[PROP_KEY]}`
            : undefined;

        // Check the label first
        if (label && !this._isNameIgnored(label)) {
          if (!activeLabel) {
            activeLabel = label;
          }
          componentTreeNames.push(label);
        } else if (
          typeof props?.accessibilityLabel === 'string' &&
          !this._isNameIgnored(props.accessibilityLabel)
        ) {
          if (!activeLabel) {
            activeLabel = props.accessibilityLabel;
          }
          componentTreeNames.push(props.accessibilityLabel);
        } else if (currentInst.elementType) {
          const { elementType } = currentInst;

          if (
            elementType.displayName &&
            !this._isNameIgnored(elementType.displayName)
          ) {
            // Check display name
            if (!activeDisplayName) {
              activeDisplayName = elementType.displayName;
            }
            componentTreeNames.push(elementType.displayName);
          }
        }

        currentInst = currentInst.return;
      }

      const finalLabel = activeLabel ?? activeDisplayName;

      if (componentTreeNames.length > 0 || finalLabel) {
        this._logTouchEvent(componentTreeNames, finalLabel);
      }
    }
  }
}

/**
 * Convenience Higher-Order-Component for TouchEventBoundary
 * @param WrappedComponent any React Component
 * @param boundaryProps TouchEventBoundaryProps
 */
const withTouchEventBoundary = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  InnerComponent: React.ComponentType<any>,
  boundaryProps?: TouchEventBoundaryProps
): React.FunctionComponent => {
  const WrappedComponent: React.FunctionComponent = (props) => (
    <TouchEventBoundary {...(boundaryProps ?? {})}>
      <InnerComponent {...props} />
    </TouchEventBoundary>
  );

  WrappedComponent.displayName = 'WithTouchEventBoundary';

  return WrappedComponent;
};

export { TouchEventBoundary, withTouchEventBoundary };
