import styled from "styled-components"

export const CustomerContainer = styled.div`
  display: grid;
  grid-template-columns: 4fr 8fr;
  gap: 25px;
`

export const LeftContainer = styled.div`
  background-color: white;
  padding: 15px;
  display: flex;
  flex-direction: column;
`

export const RightContainer = styled.div`
  background-color: white;
  padding: 15px;
`

export const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const DL = styled.dl`
  padding-left: 15px;
  dt {
    font-weight: bold;
  }
  dd:not(:last-child) {
    margin-bottom: 10px;
  }
`
