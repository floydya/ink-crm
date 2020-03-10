import React, { Fragment, useEffect } from "react"
import PropTypes from "prop-types"
import useApi from "../../../shared/hooks/api"
import { Body, Card, CardBody, CardContainer, CardHeader, CardInfo, Container, HelpIcon, Title } from "./Styles"
import { Modal, Table } from "../../../shared/components"
import { homeCardsColumns, useModalStateHelper } from "./shared"
import { capitalize } from "../../../shared/utils/string"
import { useCurrentProfile } from "../../../shared/hooks/currentUser"

const entitiesPropTypes = {
  pluralName: PropTypes.string.isRequired,
  entities: PropTypes.array.isRequired
}

const Entities = ({ pluralName, entities }) => {
  return <Container>
    <Title>{capitalize(pluralName)} за текущий месяц</Title>
    <Body>
      <Table columns={homeCardsColumns} data={entities} />
    </Body>
    <h4 style={{ textAlign: "right" }}>
      Итого: {entities.reduce((acc, next) => acc + parseFloat(next.amount), 0)}
    </h4>
  </Container>
}
Entities.propTypes = entitiesPropTypes


const propTypes = {
  pluralName: PropTypes.string.isRequired,
  apiURL: PropTypes.string.isRequired
}

const Counter = ({ pluralName, apiURL }) => {
  const modalHelpers = useModalStateHelper()
  const profile = useCurrentProfile()
  const [{ data, error, isLoading }, fetchData] = useApi.get(apiURL, { "employee_id": profile?.id })

  useEffect(() => {
    if (profile && profile?.id) {
      fetchData()
    }
  }, [fetchData, profile])

  return <CardContainer>
    {isLoading
      ? <Fragment>
        Loading...
      </Fragment>
      : !error
        ? <Fragment>
          <Card>
            <CardHeader>
              {capitalize(pluralName)}
            </CardHeader>
            <CardBody>
              {data.reduce((acc, next) => acc + parseFloat(next.amount), 0.0).toFixed(2)}
            </CardBody>
            {modalHelpers.isOpen() && (
              <Modal
                isOpen
                testid="modal:fines"
                width={1200}
                onClose={modalHelpers.close}
                renderContent={() => (
                  <Entities pluralName={pluralName} entities={data} />
                )}
              />
            )}
          </Card>
          <CardInfo>
            <HelpIcon type="circled-help" size={20} onClick={modalHelpers.open} />
          </CardInfo>
        </Fragment>
        : <Fragment>
          Error...
        </Fragment>
    }
  </CardContainer>
}

Counter.propTypes = propTypes

export default Counter
