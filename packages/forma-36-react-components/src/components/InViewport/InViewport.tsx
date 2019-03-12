import React, { Component } from 'react';
import cn from 'classnames';
import isBrowser from '../../utils/isBrowser';
import throttle from '../../utils/throttle';
import styles from './InViewport.css';

export interface InViewportProps {
  extraClassNames?: string;
  children?: React.ReactNode;
  testId?: string;
  offset?: number;
  onOverflowTop?: Function;
  onOverflowRight?: Function;
  onOverflowBottom?: Function;
  onOverflowLeft?: Function;
}

export class InViewport extends Component<InViewportProps> {
  static defaultProps = {
    testId: 'cf-ui-in-viewport',
    offset: 0,
    onOverflowTop: () => {},
    onOverflowRight: () => {},
    onOverflowBottom: () => {},
    onOverflowLeft: () => {},
  };

  tGetDomPosition = null;
  nodeRef = null;

  componentDidMount() {
    this.getDomPosition();
    this.bindEventListeners();
  }

  componentDidUpdate() {
    this.getDomPosition();
  }

  componentWillUnmount() {
    if (isBrowser) {
      window.removeEventListener('scroll', this.tGetDomPosition, true);
      window.removeEventListener('resize', this.tGetDomPosition);
    }
  }

  getDomPosition = () => {
    if (isBrowser) {
      const html = document.documentElement;
      const boundingClientRect = this.nodeRef.getBoundingClientRect();
      const windowWidth = window.innerWidth || html.clientWidth;
      const windowHeight = window.innerHeight || html.clientHeight;
      this.handleOverflow(boundingClientRect, windowWidth, windowHeight);
    }
  };

  bindEventListeners = () => {
    this.tGetDomPosition = throttle(600, this.getDomPosition);
    if (isBrowser) {
      window.addEventListener('scroll', this.tGetDomPosition, true);
      window.addEventListener('resize', this.tGetDomPosition);
    }
  };

  handleOverflow = (
    { top, left, bottom, right },
    windowWidth,
    windowHeight,
  ) => {
    const {
      offset,
      onOverflowTop,
      onOverflowLeft,
      onOverflowBottom,
      onOverflowRight,
    } = this.props;
    const topThreshold = 0 - offset;
    const leftThreshold = 0 - offset;
    const rightThreshold = windowWidth + offset;
    const bottomThreshold = windowHeight + offset;

    if (top + right + bottom + left !== 0) {
      if (top < topThreshold) {
        onOverflowTop();
      } else if (left < leftThreshold) {
        onOverflowLeft();
      } else if (bottom > bottomThreshold) {
        onOverflowBottom();
      } else if (right > rightThreshold) {
        onOverflowRight();
      }
    }
  };

  render() {
    const {
      extraClassNames,
      children,
      testId,
      onOverflowBottom,
      onOverflowLeft,
      onOverflowRight,
      onOverflowTop,
      ...otherProps
    } = this.props;

    const classNames = cn(styles['InViewport'], extraClassNames);

    return (
      <div
        ref={ref => {
          this.nodeRef = ref;
        }}
        className={classNames}
        data-test-id={testId}
        {...otherProps}
      >
        {children}
      </div>
    );
  }
}

export default InViewport;