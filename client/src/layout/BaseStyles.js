import { createGlobalStyle } from 'styled-components';

import { color, font, mixin } from '../shared/utils/styles';

export default createGlobalStyle`
  html, body, #root {
    height: 100%;
    min-height: 100%;
    min-width: 768px;
  }
  body {
    color: ${color.textDarkest};
    background-color: ${color.backgroundColor};
    -webkit-tap-highlight-color: transparent;
    line-height: 1.2;
    ${font.size(16)}
    ${font.regular}
  }
  #root {
    display: flex;
    flex-direction: column;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    ${font.regular}
  }
  *, *:after, *:before, input[type="search"] {
    box-sizing: border-box;
  }
  a {
    color: ${color.textLink};
    text-decoration: none;
  }
  ul {
    list-style: none;
  }
  ul, li, ol, dd, h1, h2, h3, h4, h5, h6, p {
    padding: 0;
    margin: 0;
  }
  h1, h2, h3, h4, h5, h6, strong {
    ${font.bold}
  }
  button {
    background: none;
    border: none;
  }
  /* Workaround for IE11 focus highlighting for select elements */
  select::-ms-value {
    background: none;
    color: #42413d;
  }
  [role="button"], button, input, select, textarea {
    outline: none;
    &:focus {
      outline: none;
    }
    &:disabled {
      opacity: 1;
    }
  }
  [role="button"], button, input, textarea {
    appearance: none;
  }
  select:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 #000;
  }
  select::-ms-expand {
    display: none;
  }
  select option {
    color: ${color.textDarkest};
  }
  p {
    line-height: 1.4285;
    a {
      ${mixin.link()}
    }
  }
  textarea {
    line-height: 1.4285;
  }
  body, select {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html {
    touch-action: manipulation;
  }
  
  .text-center {
    text-align: center;
    justify-content: center;
  }
  .text-right {
    text-align: right;
    justify-content: flex-end;
  }
  .text-left {
    text-align: left;
    justify-content: flex-start;
  }
  div.swal2-actions {
    position: relative;
    z-index: 0;
  }
  
  ${mixin.placeholderColor(color.textLight)}
`;