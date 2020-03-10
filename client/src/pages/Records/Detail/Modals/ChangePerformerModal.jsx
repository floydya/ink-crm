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

const ChangePerformerModal = ({ modalClose }) => {
  const record = useContext(RecordContext)
  const [{ data }] = useApi.get(`/profiles/`, {session_type: record.type.id}, { mountFetch: true });
  const employees = useMemo(
    () => (data || []).map(el => ({ label: el.user.full_name, value: el.id })),
    [data]
  );
  const [{isUpdating}, changePerfomer] = useApi.patch(`/records/${record.id}/`);
  return (
    <Form
      validations={{
        performer: Form.is.required()
      }}
      initialValues={{
        performer: record.performer?.id || null
      }}
      onSubmit={async (values, form) => {
        try {
          await changePerfomer(values);
          await pubsub.emit("fetch-record");
          await modalClose();
        } catch (error) {
          Form.handleAPIError(error, form);
        }
      }}
    >
      <FormElement>
        <Form.Field.Select name="performer" options={employees} />
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

ChangePerformerModal.propTypes = propTypes;

export default ChangePerformerModal;
