import React from 'react';

import Spinner from '../Spinner';

import StyledPageLoader from './Styles';

const PageLoader = () => (
  <StyledPageLoader>
    <Spinner size={70} />
  </StyledPageLoader>
);

export default PageLoader;
