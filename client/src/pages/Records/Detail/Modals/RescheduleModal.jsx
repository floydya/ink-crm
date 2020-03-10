import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'shared/components'
import { FormElement, ActionButton, Actions } from 'pages/Authentication/Styles'
import { useContext } from 'react'
import { RecordContext } from '../Context'


const propTypes = {
    modalClose: PropTypes.func.isRequired,
    reschedule: PropTypes.shape({
        data: PropTypes.shape({
            isUpdating: PropTypes.bool.isRequired,
            data: PropTypes.object.isRequired,
            error: PropTypes.object.isRequired,
        }).isRequired,
        trigger: PropTypes.func.isRequired,
    }).isRequired,
}

const RescheduleModal = ({ modalClose, reschedule }) => {
    const record = useContext(RecordContext)
    return <Form
        enableReinitialize
        validations={{
            datetime: Form.is.required(),
        }}
        initialValues={{
            datetime: record.datetime
        }}
        onSubmit={async (values, form) => {
            try {
                await reschedule.trigger(values.datetime)
                modalClose()
            } catch (error) {
                Form.handleAPIError(error, form)
            }
        }}
    >
        <FormElement>
            <Form.Field.DatePicker name="datetime" />
            <Actions>
                <ActionButton type="submit" variant="primary" isWorking={reschedule.data.isUpdating}>
                    Перенести
                </ActionButton>
                <ActionButton type="button" variant="secondary" disabled={reschedule.data.isUpdating} onClick={modalClose}>
                    Закрыть
                </ActionButton>
            </Actions>
        </FormElement>
    </Form>
}

RescheduleModal.propTypes = propTypes

export default RescheduleModal
