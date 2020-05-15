import styled from "styled-components"
import { default as NativeSelect } from "antd/lib/select"

export const Select = styled(NativeSelect)`
  width: 100%;
  
  .ant-select-selection-item {
    color: white;
  }
  
  svg {
    fill: white;
  }
`