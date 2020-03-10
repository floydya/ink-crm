import styled from "styled-components"
import { color } from "../../../shared/utils/styles"
import { Icon } from "../../../shared/components"

export const CardContainer = styled.div`
  padding: 10px 25px;
  border-radius: 5px;
  color: ${color.textDarkest};
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Card = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`
export const CardHeader = styled.h3``
export const CardBody = styled.h2``
export const CardInfo = styled.div`
`

export const HelpIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`

export const Container = styled.div`
  padding: 25px;
`
export const Title = styled.h2``
export const Body = styled.div``