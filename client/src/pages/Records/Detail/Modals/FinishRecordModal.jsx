import React, { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import pubsub from "sweet-pubsub";
import { RecordContext } from "../Context";
import useApi from "shared/hooks/api";
import { Form } from "shared/components";
import { FormElement, Divider } from "layout/Settings/Styles";
import { FinishFormContainer } from "../Styles";
import { useState } from "react";
import { useEffect } from "react";
import { Actions, ActionButton } from "pages/Authentication/Styles";
import moment from "moment";

const getCoupon = (couponList, coupon) => {
  return (couponList || []).find(el => el.id === coupon);
};

const getCouponDenomination = (couponList, coupon) => {
  return getCoupon(couponList, coupon)?.denomination || 0;
};

const getPrepayments = prepayments => {
  return (prepayments || []).reduce(
    (acc, next) => acc + parseFloat(next.value),
    0.0
  );
};

const getPerformerMotivation = (performer, session_type) => {
  return (
    (performer?.session_motivations || []).find(
      el => el.session_type.id === session_type
    )?.base_percent / 100.0 || 0
  );
};

const getInviteMotivation = (inviter, session_type) => {
  return (
    (inviter?.session_motivations || []).find(
      el => el.session_type.id === session_type
    )?.invite_percent / 100.0 || 0
  );
};

const getRevenue = (coupon, price) => {
  const couponDenomination =
    coupon?.type === "discount" ? parseFloat(coupon.denomination) : 0.0;
  return price - couponDenomination;
};

const propTypes = {
  modalClose: PropTypes.func.isRequired
};

const FinishRecordModal = ({ modalClose }) => {
  const record = useContext(RecordContext);
  const [{ isUpdating }, finishRecord] = useApi.patch(`/records/${record.id}/`);
  const [code, setCode] = useState("");
  const [{ data }, fetchCoupons] = useApi.get(`/coupons/`);
  const coupons = useMemo(
    () => (data || []).map(el => ({ label: el.code, value: el.id })),
    [data]
  );

  const timeSpent = useMemo(
    () => moment().diff(moment(record.status_changed), "hours"),
    [record]
  );
  const countedPrice = useMemo(
    () => parseFloat(record.type.price_per_hour) * timeSpent,
    [record, timeSpent]
  );
  useEffect(() => {
    if (code && code.length > 3) fetchCoupons({ code });
  }, [code, fetchCoupons]);

  return (
    <div style={{ padding: "25px" }}>
      <h2>Завершение сеанса</h2>
      <Form
        validations={{
          price: Form.is.required()
        }}
        initialValues={{
          price: "",
          used_coupon: ""
        }}
        onSubmit={async (values, form) => {
          try {
            await finishRecord({ status: "finished", ...values });
            await pubsub.emit("fetch-record");
            await modalClose();
          } catch (error) {
            Form.handleAPIError(error, form);
          }
        }}
      >
        {formikProps => (
          <FormElement>
            <FinishFormContainer>
              <div>
                <Form.Field.Input
                  type="number"
                  name="price"
                  label="Стоимость работы"
                  tip={
                    countedPrice > 0 && <span>
                      Затрачено {timeSpent} часов на работу. Примерная стоимость
                      – {countedPrice}.
                    </span>
                  }
                />
                <Form.Field.Select
                  label="Использовать купон"
                  name="used_coupon"
                  options={coupons}
                  searchChange={setCode}
                />
              </div>
              <div>
                {!!formikProps.values.price && (
                  <h4>Стоимость работы: {formikProps.values.price}</h4>
                )}
                {!!record.prepayments.length && (
                  <h4>
                    Внесено предоплаты:{" "}
                    {record.prepayments.reduce(
                      (acc, next) => acc + parseFloat(next.value),
                      0.0
                    )}
                  </h4>
                )}
                {!!formikProps.values.used_coupon && (
                  <h4>
                    Выбран купон(
                    {
                      (data || []).find(
                        el => el.id === formikProps.values.used_coupon
                      )?.type_display
                    }
                    ):{" "}
                    {
                      (data || []).find(
                        el => el.id === formikProps.values.used_coupon
                      )?.denomination
                    }
                  </h4>
                )}
                <Divider style={{ marginBottom: "22px" }} />
                <dl>
                  <dt>Необходимо взять налички</dt>
                  <dd>
                    {formikProps.values.price -
                      getCouponDenomination(
                        data,
                        formikProps.values.used_coupon
                      ) -
                      getPrepayments(record.prepayments)}
                  </dd>
                  <dt>За работу({record.performer.user.full_name})</dt>
                  <dd>
                    {getRevenue(
                      getCoupon(data, formikProps.values.used_coupon),
                      formikProps.values.price
                    ) *
                      getPerformerMotivation(record.performer, record.type.id)}
                  </dd>
                </dl>
                <dt>За приглашение({record.created_by.user.full_name})</dt>
                <dd>
                  {getRevenue(
                    getCoupon(data, formikProps.values.used_coupon),
                    formikProps.values.price
                  ) * getInviteMotivation(record.created_by, record.type.id)}
                </dd>
              </div>
            </FinishFormContainer>
            <Actions>
              <ActionButton
                type="submit"
                variant="primary"
                isWorking={isUpdating}
              >
                Внести деньги в кассу
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
        )}
      </Form>
    </div>
  );
};

FinishRecordModal.propTypes = propTypes;

export default FinishRecordModal;
