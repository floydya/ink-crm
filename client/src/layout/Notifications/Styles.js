import styled from 'styled-components';

import { color, font, mixin } from '../../shared/utils/styles';

export const NotificationList = styled.div`
  padding: 25px 35px 60px;
`;

export const Notification = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 4px;
  transition: background 0.1s;
  ${mixin.clickable}
  &:hover {
    background: ${color.backgroundLight};
  }
`;

export const NotificationData = styled.div`
  padding-left: 15px;
`;

export const NotificationTitle = styled.div`
  color: ${color.textDark};
  ${font.size(15)}
`;

export const NotificationTypeId = styled.div`
  text-transform: uppercase;
  color: ${color.textMedium};
  ${font.size(12.5)}
`;

export const SectionTitle = styled.div`
  padding-bottom: 12px;
  text-transform: uppercase;
  color: ${color.textMedium};
  ${font.bold}
  ${font.size(11.5)}
`;

export const NoResults = styled.div`
  padding-top: 50px;
  text-align: center;
`;

export const NoResultsTitle = styled.div`
  padding-top: 30px;
  ${font.medium}
  ${font.size(20)}
`;

export const NoResultsTip = styled.div`
  padding-top: 10px;
  ${font.size(15)}
`;