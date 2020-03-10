import React, { useContext } from "react";
import PropTypes from "prop-types";
import useApi from "shared/hooks/api";
import { Form } from "shared/components";
import { FormElement, Actions, ActionButton } from "pages/Authentication/Styles";
import { useMemo } from "react";
import pubsub from "sweet-pubsub";
import { RecordContext } from "../Context";

const propTypes = {
  modalClose: PropTypes.func.isRequired
};

const ChangeTypeModal = ({ modalClose }) => {
  const record = useContext(RecordContext)
  const [{ data }] = useApi.get(`/types/sessions/`, {}, { mountFetch: true });
  const types = useMemo(
    () => (data || []).map(el => ({ label: el.name, value: el.id })),
    [data]
  );
  const [{isUpdating}, changeType] = useApi.patch(`/records/${record.id}/`);
  return (
    <Form
      validations={{
        type: Form.is.required()
      }}
      initialValues={{
        type: record.type.id
      }}
      onSubmit={async (values, form) => {
        try {
          await changeType(values);
          await pubsub.emit("fetch-record");
          await modalClose();
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
    >
      <FormElement>
        <Form.Field.Select name="type" options={types} />
        <Actions>
          <ActionButton type="submit" variant="primary" isWorking={isUpdating}>
            Изменить
          </ActionButton>
          <ActionButton type="button" variant="secondary" disabled={isUpdating} onClick={modalClose}>
            Закрыть
          </ActionButton>
        </Actions>
      </FormElement>
    </Form>
  );
};

ChangeTypeModal.propTypes = propTypes;

export default ChangeTypeModal;
