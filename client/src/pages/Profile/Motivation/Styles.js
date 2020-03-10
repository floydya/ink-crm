import styled from "styled-components"

export const Container = styled.div`
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  
  table {
    border: none;
    background: white;
    width: 100%;
    
    caption {
      margin-bottom: 10px;
    }
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
