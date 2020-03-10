import styled from "styled-components"
import { Button } from "shared/components"

export const ButtonGroup = styled.div`
  button:not(:last-child) {
    margin-right: 10px;
  }
`

export const Row = styled.div`
  margin-top: 35px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`

export const Title = styled.dt`
  font-weight: bold;
`

export const ButtonTitle = styled(Button)``

export const Description = styled.dd`
  font-weight: semi-bold;
`

export const InfoBlock = styled.div`
  &:not(:first-child) {
    margin-top: 15px;  
  }
  line-height: 2rem;
`

export const Data = styled.h2`
`

export const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr 2fr;
`

export const InnerContainer = styled.div`
  background-color: ${props => props.color};
  padding: 20px;
  grid-column: 2;

  dd:not(:last-child) {
    margin-bottom: 10px;
  }
`

export const FinishFormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;

  dt {
    font-weight: semi-bold;
  }

  dd {
    font-weight: bold;

    &:not(:last-child) {
      margin-bottom: 10px;
    }

  }
`