import styled from 'styled-components'

export const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 50px;
`

export const Row = styled.div`
  display: grid;
  gap: 50px;
`

export const ColContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 50px;
`