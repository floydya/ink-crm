import styled from "styled-components"
import { Avatar } from "../../shared/components"
import { color, mixin } from "../../shared/utils/styles"

export const Container = styled.div`
  margin-top: 25px;
  display: grid;
  grid-template-columns: 2fr 4fr;
  color: ${color.textDarkest};
  gap: 15px;
`

export const Card = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
`

export const InfoCard = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 25px;
`

export const ProfileAvatar = styled(Avatar)`
  margin-bottom: 15px;
`

export const ProfileName = styled.span``
export const ProfileRole = styled.span`
  font-size: 0.85rem;
  ${mixin.tag()}
`
export const CreateContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
`

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

export const TableWrapper = styled.div`
  margin-top: 25px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  table {
    border: none;
    background: white;
    width: 100%;
  }
 
  thead {
    background-color: rgba(0, 0, 0, 0.02);
    
    th {
      font-weight: 600;
    }
  }
  
  th, td {
    font-size: 12px;
    line-height: 20px;
  }
  
  th {
    padding: 8px;
  }
  td {
    padding: 12px;
  }
  
  tr.date-block {
    background-color: rgba(0, 0, 0, 0.04);
  }
`