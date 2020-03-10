import styled from "styled-components";

export const DashboardGrid = styled.div`
  display: grid;
  grid-template:
    "revenue expense remain"
    "payments payments .";
  gap: 15px;
`;

export const RevenueCard = styled.div`
  grid-area: revenue;
  background-color: white;
  padding: 15px;
`;


export const ExpenseCard = styled.div`
  grid-area: expense;
  background-color: white;
  padding: 15px;
`;

export const RemainCard = styled.div`
  grid-area: remain;
  background-color: white;
  padding: 15px;
`;

export const PaymentsCard = styled.div`
  grid-area: payments;
  background-color: white;
  padding: 15px;
`;
