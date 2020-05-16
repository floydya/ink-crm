import React from "react"
import UnpayedPayments from "./UnpayedPayments"
import Transactions from "./Transactions"
import { Col, Row } from "antd"


const History = () => {
  return <>
    <Row>
      <Col md={{ span: 11 }}>
        <h2>Транзакции</h2>
        <Transactions />
      </Col>
      <Col md={{ span: 11, offset: 2 }}>
        <h2>Невыплаченные платежи</h2>
        <UnpayedPayments />
      </Col>
    </Row>
  </>
}

export default History