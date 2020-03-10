import styled from "styled-components"

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 25px;
  padding: 25px;
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
`

export const InfoHeader = styled.h4`
  font-weight: bold;
`

export const InfoBody = styled.h5`
  
`