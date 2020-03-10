import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import { useCurrentProfile } from "../../../../shared/hooks/currentUser"
import useApi from "../../../../shared/hooks/api"
import Calendar from "react-calendar"
import { CalendarContainer, Row, WeekendContainer } from "./Styles"
import { useModalStateHelper } from "../shared"
import Modal from "../../../../shared/components/Modal"
import { formatDateTime } from "../../../../shared/utils/dateTime"
import Table from "../../../../shared/components/Table"
import { Form } from "../../../../shared/components"
import toast from "../../../../shared/utils/toast"
import { ActionButton, Actions, FormElement, FormHeading } from "../../../Authentication/Styles"
import pubsub from "sweet-pubsub"

const propTypes = {
  weekends: PropTypes.array.isRequired,
  date: PropTypes.object.isRequired
}

const columns = [
  {
    Header: "От",
    accessor: "from_time"
  },
  {
    Header: "До",
    accessor: "to_time"
  }
]

const WeekendModal = ({ date, weekends }) => {
  const profile = useCurrentProfile()
  const [{ isCreating }, createWeekend] = useApi.post(`/weekends/`)

  return <WeekendContainer>
    <h3>{formatDateTime(date, "DD.MM.YYYY")}</h3>
    <Row>
      <Table columns={columns} data={weekends} />
      <Form
        enableReinitialize
        initialValues={{
          from_time: "",
          to_time: ""
        }}
        validations={{
          from_time: Form.is.required(),
          to_time: Form.is.required()
        }}
        onSubmit={async (values, form) => {
          try {
            await createWeekend({
              ...values,
              employee: profile?.id,
              date: formatDateTime(date, "YYYY-MM-DD")
            })
            pubsub.emit("fetch-weekends")
            toast.success("You are successfully created weekend.")
          } catch (error) {
            Form.handleAPIError(error, form)
          }
        }}
      >
        <FormElement>
          <FormHeading>Добавление выходного</FormHeading>
          <Form.Field.Input
            type="time"
            name="from_time"
            label="От"
          />
          <Form.Field.Input
            type="time"
            name="to_time"
            label="До"
          />
          <Actions>
            <ActionButton type="submit" variant="primary" isWorking={isCreating}>
              Создать
            </ActionButton>
          </Actions>
        </FormElement>
      </Form>
    </Row>
  </WeekendContainer>
}

WeekendModal.propTypes = propTypes

const Weekends = () => {
  const profile = useCurrentProfile()
  const [date, setDate] = useState(null)
  const [{ isLoading, data: weekends }, fetchWeekends] = useApi.get("/weekends/")
  const modalStateHelper = useModalStateHelper()

  useEffect(() => {
    if (profile?.id) {
      fetchWeekends({ "employee_id": profile.id })
      pubsub.on("fetch-weekends", () => fetchWeekends({ "employee_id": profile.id }))
    }
    return () => {
      pubsub.off("fetch-weekends", fetchWeekends)
    }
  }, [fetchWeekends, profile])

  useEffect(() => {
    if (date) {
      modalStateHelper.open()
    }
  }, [modalStateHelper, date])

  const selectedWeekends = useMemo(() => {
    if (!isLoading && weekends) {
      return weekends.filter(
        el => new Date(el.date).setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0)
      )
    }
    return []
  }, [isLoading, weekends, date])

  const handleTileClassName = useCallback(({ date }) => {
    if (!isLoading && weekends) {
      return weekends.find(
        el => new Date(el.date).setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0)
      )
        ? "weekend"
        : null
    }
    return null
  }, [isLoading, weekends])

  return <Fragment>
    <div>
      <h2>Выходные</h2>
      <CalendarContainer>
        <Calendar
          tileClassName={handleTileClassName}
          onChange={setDate}
          value={new Date()}
        />
      </CalendarContainer>
      {modalStateHelper.isOpen() && <Modal
        isOpen
        width={1200}
        testid="modal:weekends"
        onClose={() => {
          modalStateHelper.close()
          setDate(null)
        }}
        renderContent={() => <WeekendModal date={date} weekends={selectedWeekends} />}
      />}
    </div>
  </Fragment>
}

export default Weekends
