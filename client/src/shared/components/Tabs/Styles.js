import styled from "styled-components"
import { color, mixin } from "../../utils/styles"

export const TabWrapper = styled.div`
`

export const TabNavWrapper = styled.div`
  display: flex;
`

export const Label = styled.div`
  color: ${mixin.darken("white", 0.75)};
  margin-right: 10px;
  cursor: pointer;
  width: 20%;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  background: ${mixin.lighten(color.backgroundDarkPrimary, 1.5)};
  text-align: center;
  line-height: 3em;
  
  &.active {
    background: ${mixin.lighten(color.backgroundDarkPrimary, 0.5)};
    color: white;
  }
`

export const TabBodyWrapper = styled.div`
  border-top:${mixin.lighten(color.backgroundDarkPrimary, 0.5)} 3px solid;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
  border-top-right-radius: 3px;
  background: white;
`