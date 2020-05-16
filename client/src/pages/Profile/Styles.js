import styled from "styled-components"
import { color } from "../../shared/utils/styles"

export const Container = styled.div`
  margin-top: 25px;
  display: grid;
  grid-template-columns: 2fr 4fr;
  color: ${color.textDarkest};
  gap: 15px;
`
export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 25px;
  padding: 25px;
`