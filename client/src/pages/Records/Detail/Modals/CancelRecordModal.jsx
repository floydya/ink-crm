import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Form } from "shared/components";
import {
  FormElement,
  Actions,
  ActionButton
} from "pages/Authentication/Styles";
import { RecordContext } from "../Context";
import useApi from "shared/hooks/api";
import pubsub from "sweet-pubsub";

const prepaymentOptions = [
  { label: "Вернуть клиенту", value: true },
  { label: "Оставить в кассе", value: false }
];

const propTypes = {
  modalClose: PropTypes.func.isRequired
};

const CancelRecordModal = ({ modalClose }) => {
  const record = useContext(RecordContext)
  const [{isUpdating}, cancelRecord] = useApi.patch(`/records/${record.id}/`);
  return (
    <Form
      validations={{
        reason: Form.is.required(),
        ...(record.prepayments.length && {
          rollback_prepayment: Form.is.required()
        })
      }}
      initialValues={{
        reason: "",
        rollback_prepayment: true
      }}
      onSubmit={async (values, form) => {
        try {
          await cancelRecord({status: "canceled", ...values})
          await modalClose()
          await pubsub.emit('fetch-record')
        } catch (error) {
          Form.handleAPIError(error, form)
        }
      }}
    >
      <FormElement>
        <Form.Field.Input name="reason" label="Причина отмены записи" />
        {!!record.prepayments.length && (
          <Form.Field.Select
            name="rollback_prepayment"
            label="Что делать с предоплатой?"
            options={prepaymentOptions}
          />
        )}
        <Actions>
          <ActionButton
            type="submit"
            variant="primary"
            isWorking={isUpdating}
          >
            Отменить
          </ActionButton>
          <ActionButton
            type="button"
            variant="secondary"
            disabled={isUpdating}
            onClick={modalClose}
          >
            Закрыть
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};

CancelRecordModal.propTypes = propTypes;

export default CancelRecordModal;
