import React from "react"
import { isEqual } from "lodash"
import { ColContainer, Row, RowContainer } from "./Styles"
import Counter from "./components/AbstractCounter"
import { Card, CardBody, CardContainer, CardHeader } from "./components/Styles"
import { useCurrentProfile } from "../../shared/hooks/currentUser"
import "react-calendar/dist/Calendar.css"

const HomePage = () => {
  const profile = useCurrentProfile()
  return <RowContainer>
    <Row>
      <ColContainer>
        <Counter pluralName="Премии" apiURL="/bounties/" />
        <Counter pluralName="Штрафы" apiURL="/fines/" />
        <CardContainer>
          <Card>
            <CardHeader>Баланс</CardHeader>
            <CardBody>{profile?.balance || "0.00"}</CardBody>
          </Card>
        </CardContainer>
      </ColContainer>
    </Row>
  </RowContainer>
}

export default React.memo(HomePage, isEqual)