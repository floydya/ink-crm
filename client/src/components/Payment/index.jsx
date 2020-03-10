import React from "react"
import PropTypes from "prop-types"
import { formatDateTime } from "../../shared/utils/dateTime"
import { months } from "../../shared/constants/dates"
import { Info, InfoBody, InfoHeader, Row } from "./Styles"
import { PaymentStatus } from "../../shared/constants/paymentStatuses"


const propTypes = {
  payment: PropTypes.object.isRequired
}

const Payment = ({ payment }) => {

  return <div style={{ padding: "25px" }}>
    <Row>
      <Info>
        <InfoHeader>Идентификатор</InfoHeader>
        <InfoBody>{payment.id}</InfoBody>
      </Info>
      <Info>
        <InfoHeader>Статус</InfoHeader>
        <InfoBody>{PaymentStatus[payment.status]}</InfoBody>
      </Info>
      <Info>
        <InfoHeader>Месяц</InfoHeader>
        <InfoBody>{months.find(el => el.value === payment.month).label}</InfoBody>
      </Info>
      <Info>
        <InfoHeader>Год</InfoHeader>
        <InfoBody>{payment.year}</InfoBody>
      </Info>
      <Info>
        <InfoHeader>Кто выдал(-а)</InfoHeader>
        <InfoBody>{payment.created_by?.full_name}</InfoBody>
      </Info>
      <Info>
        <InfoHeader>Когда создан</InfoHeader>
        <InfoBody>{formatDateTime(payment.created_at, "DD.MM.YYYY HH:mm:ss")}</InfoBody>
      </Info>
      <Info>
        <InfoHeader>Сумма</InfoHeader>
        <InfoBody>{payment.amount}</InfoBody>
      </Info>
      <Info>
        <InfoHeader>Доказательство</InfoHeader>
        <InfoBody>
          {!!payment.href
            ? <a href={payment.href} target="_blank" rel="noopener noreferrer">Открыть в новой вкладке</a>
            : "–"
          }
        </InfoBody>
      </Info>
      <Info style={{ gridColumn: "1 / span 2" }}>
        <InfoHeader>Заметка</InfoHeader>
        <InfoBody>{payment.note}</InfoBody>
      </Info>
      <Info>
        <InfoHeader>Дата изменения статуса</InfoHeader>
        <InfoBody>{!!payment.status_changed_at
          ? formatDateTime(payment.status_changed_at, "DD.MM.YYYY HH:mm:ss")
          : "–"
        }</InfoBody>
      </Info>
      <Info>
        <InfoHeader>Кто изменил статус</InfoHeader>
        <InfoBody>{payment.status_changed_by?.full_name || "–"}</InfoBody>
      </Info>
    </Row>
  </div>
}

Payment.propTypes = propTypes

export default Payment
