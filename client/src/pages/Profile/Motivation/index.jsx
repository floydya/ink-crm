import React from "react";
import SellMotivation from "./Tables/Sells";
import EducationMotivation from "./Tables/Educations";
import SessionMotivation from "./Tables/Sessions";
import { Col, Row } from "antd"

const Motivation = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col md={8} xs={24}>
        <SessionMotivation />
      </Col>
      <Col md={8} xs={24}>
        <EducationMotivation/>
      </Col>
      <Col md={8} xs={24}>
        <SellMotivation/>
      </Col>
    </Row>
  );
};

export default Motivation;
