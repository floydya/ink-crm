import styled from "styled-components"

export const CalendarContainer = styled.div`
  .weekend {
    background-color: rgba(255, 0, 0, 0.3); 
    &.react-calendar__tile--active {
      background-color: rgba(255, 0, 0, 0.6);
    }
  }
`

export const WeekendContainer = styled.div`
  padding: 25px;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
`