import React from "react";

import {
  DashboardGrid,
  RevenueCard,
  ExpenseCard,
  RemainCard,
  PaymentsCard
} from "./Styles";
import {
  RevenueWidget,
  ExpenseWidget,
  RemainWidget,
  PaymentsWidget
} from "./Widgets";

const Dashboard = () => {
  return (
    <DashboardGrid>
      <RevenueCard>
        <RevenueWidget />
      </RevenueCard>
      <ExpenseCard>
        <ExpenseWidget />
      </ExpenseCard>
      <RemainCard>
        <RemainWidget />
      </RemainCard>
      <PaymentsCard>
        <PaymentsWidget />
      </PaymentsCard>
    </DashboardGrid>
  );
};

export default Dashboard;
