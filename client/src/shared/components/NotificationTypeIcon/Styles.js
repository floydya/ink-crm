import styled from 'styled-components';

import { notificationTypeColors } from '../../utils/styles';
import Icon from '../Icon';

export const TypeIcon = styled(Icon)`
  color: ${props => notificationTypeColors[props.color]};
`;
