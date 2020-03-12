import React from 'react';
import PropTypes from 'prop-types';

import { StyledIcon } from './Styles';

const fontIconCodes = {
  [`bug`]: '\\eec7',
  [`stopwatch`]: '\\edcd',
  [`task`]: '\\f007',
  [`story`]: '\\e911',
  [`arrow-down`]: '\\ea5b',
  [`arrow-left`]: '\\ea5c',
  [`arrow-right`]: '\\ea5d',
  [`arrow-up`]: '\\ea5e',
  [`check`]: '\\eed8',
  [`chevron-down`]: '\\ea99',
  [`circled-down`]: '\\ea6b',
  [`circled-left`]: '\\ea6c',
  [`circled-right`]: '\\ea6d',
  [`circled-up`]: '\\ea6e',
  [`board`]: '\\eefa',
  [`dashboard`]: '\\eef9',
  [`help`]: '\\efcc',
  [`circled-help`]: '\\efca',
  [`link`]: '\\ef71',
  [`menu`]: '\\efa2',
  [`notification`]: '\\efac',
  [`home`]: '\\ef47',
  [`customers`]: '\\ed07',
  // [`more`]: '\\e90e',
  [`attach`]: '\\eea7',
  [`plus`]: '\\efc2',
  [`plus-square`]: '\\efc1',
  [`minus-square`]: '\\ef99',
  [`search`]: '\\ed12',
  // [`issues`]: '\\e908',
  [`settings`]: '\\efe2',
  [`close`]: '\\eee4',
  [`play`]: '\\ecaa',
  // [`feedback`]: '\\e918',
  [`trash`]: '\\ee09',
  [`phone`]: '\\efbb',
  // [`github`]: '\\e915',
  [`shop`]: '\\efe7',
  // [`component`]: '\\e91a',
  [`reports`]: '\\e97f',
  [`page`]: '\\efb2',
  [`calendar`]: '\\eecd',
  [`exit`]: '\\ef1d',
  [`success`]: '\\eed7',
  [`danger`]: '\\ef19',
  [`info`]: '\\ef4e',
  [`warning`]: '\\f025',
  [`user`]: '\\ecff',
  [`edit`]: '\\ef10',
  [`pay`]: '\\efb7',
};

const propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(Object.keys(fontIconCodes)).isRequired,
  size: PropTypes.number,
  left: PropTypes.number,
  top: PropTypes.number,
};

const defaultProps = {
  className: undefined,
  size: 16,
  left: 0,
  top: 0,
};

const Icon = ({ type, ...iconProps }) => (
  <StyledIcon {...iconProps} data-testid={`icon:${type}`} code={fontIconCodes[type]} />
);

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;
