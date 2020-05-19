import React from "react"
import UnpayedPayments from "./UnpayedPayments"
import Transactions from "./Transactions"
import { Col, Row } from "antd"

const History = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col md={12} xs={24}>
        <Transactions />
      </Col>
      <Col md={12} xs={24}>
        <UnpayedPayments />
      </Col>
    </Row>
  )
}

export default History
