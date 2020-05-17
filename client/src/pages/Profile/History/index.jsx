import React from "react";
import UnpayedPayments from "./UnpayedPayments";
import Transactions from "./Transactions";

const History = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "25px",
      }}
    >
      <Transactions />

      <UnpayedPayments />
    </div>
  );
};

export default History;
