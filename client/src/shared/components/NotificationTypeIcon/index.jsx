import React from 'react';
import PropTypes from 'prop-types';

import { TypeIcon } from './Styles';

const propTypes = {
  type: PropTypes.string.isRequired,
};

const NotificationTypeIcon = ({ type, ...otherProps }) => (
  <TypeIcon type={type} color={type} size={18} {...otherProps} />
);

NotificationTypeIcon.propTypes = propTypes;

export default NotificationTypeIcon;
