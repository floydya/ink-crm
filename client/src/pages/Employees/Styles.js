import styled from "styled-components"

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
`

export const SearchContainer = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
  gap: 15px;
  align-items: center;
`

export const RoleLine = styled.h3`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 35px 0 15px 0;
`

export const ProfileLine = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 5fr 1fr;
  background-color: white;
  margin: 10px;
  padding: 15px;
  align-items: center;
`
