import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import PropTypes from "prop-types"
import { FieldLabel, StyledField } from "../../../shared/components/Form/Styles"
import DatePicker from "../../../shared/components/DatePicker"
import { ActionButton, Actions } from "../../Authentication/Styles"
import { Modal } from "../../../shared/components"
import BountyModal from "../Modals/CreateBounty"
import FineModal from "../Modals/CreateFine"
import { useModalStateHelper } from "../../Home/components/shared"
import { formatDateTimeForAPI } from "../../../shared/utils/dateTime"
import moment from "moment"
import useApi from "../../../shared/hooks/api"
import lodash from "lodash"
import { TableWrapper } from "../Styles"
import qs from "query-string"
import UnpayedPayments from "./UnpayedPayments"
import pubsub from "sweet-pubsub"
import Transactions from "./Transactions"

const propTypes = {
  employee: PropTypes.number.isRequired
}

const History = ({ employee }) => {
  const bountyModalHelper = useModalStateHelper()
  const fineModalHelper = useModalStateHelper()
  const [_from, _setFrom] = useState(formatDateTimeForAPI(moment().startOf("month")))
  const [_to, _setTo] = useState(formatDateTimeForAPI(moment().endOf("month")))
  const prevData = useRef(null)
  const [{ isLoading, data }, fetchTransactions] = useApi.get(`/transactions/`, {
    created_at_after: _from,
    created_at_before: _to,
    purpose_id: employee,
    limit: 25
  }, { mountFetch: true })
  const [transactions, setTransactions] = useState([])
  const groupedTransactions = useMemo(() => {
    return lodash.groupBy(transactions, el => moment(el.created_at).format("DD.MM.YYYY"))
  }, [transactions])
  const nextQueryParams = useMemo(() => data && data.next && qs.parseUrl(data.next).query, [data])
  const fetchMore = useCallback(() => {
    const container = document.getElementById("container")
    if (window.innerHeight + container.scrollTop !== container.scrollHeight || isLoading || !data.next) return
    fetchTransactions(nextQueryParams)
  }, [isLoading, data, fetchTransactions, nextQueryParams])

  const newFetch = useCallback(() => {
    prevData.current = null
    setTransactions([])
    fetchTransactions()
  }, [fetchTransactions])

  useEffect(() => {
    const container = document.getElementById("container")
    container.addEventListener("scroll", fetchMore)
    return () => container.removeEventListener("scroll", fetchMore)
  }, [fetchMore])

  useEffect(() => {
    prevData.current = null
    setTransactions([])
    pubsub.on("fetch-transactions", newFetch)
    return () => pubsub.off("fetch-transactions", newFetch)
  }, [newFetch])

  useEffect(() => {
    if (data?.results && prevData.current?.next !== data?.next) {
      setTransactions(prev => [...prev, ...data.results])
    }
    prevData.current = data
  }, [data])

  return <div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 4fr", gap: "15px" }}>
      <StyledField hasLabel>
        <FieldLabel htmlFor="from">От</FieldLabel>
        <DatePicker id="from" value={_from} onChange={_setFrom} withTime={false} />
      </StyledField>
      <StyledField hasLabel>
        <FieldLabel htmlFor="to">До</FieldLabel>
        <DatePicker id="to" value={_to} onChange={_setTo} withTime={false} />
      </StyledField>
      <Actions style={{ justifyContent: "flex-end" }}>
        <ActionButton type="button" variant="success" icon="plus-square" onClick={bountyModalHelper.open}>
          Премия
        </ActionButton>
        <ActionButton type="button" variant="danger" icon="minus-square" onClick={fineModalHelper.open}>
          Штраф
        </ActionButton>
        {bountyModalHelper.isOpen() && (
          <Modal
            isOpen
            testid="modal:bounty"
            width={600}
            onClose={bountyModalHelper.close}
            renderContent={({ close }) => (
              <BountyModal modalClose={close} employee={employee} />
            )}
          />
        )}
        {fineModalHelper.isOpen() && (
          <Modal
            isOpen
            testid="modal:fine"
            width={600}
            onClose={fineModalHelper.close}
            renderContent={({ close }) => (
              <FineModal modalClose={close} employee={employee} />
            )}
          />
        )}
      </Actions>
    </div>
    <TableWrapper>
      <Transactions groupedTransactions={groupedTransactions} />
      <UnpayedPayments employee={employee} />
    </TableWrapper>
  </div>
}

History.propTypes = propTypes

export default History