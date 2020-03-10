import styled from "styled-components"

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  height: 100%;
`

export const SearchContainer = styled.form`
  grid-column-start: 2;
  display: grid;
  grid-template-columns: 4fr 2fr;
  gap: 25px;
  align-items: center;
`

export const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr 2fr;
`
