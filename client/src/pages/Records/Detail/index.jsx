import React, { Fragment, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import useApi from "../../../shared/hooks/api";
import { PageError, Modal } from "../../../shared/components";
import Button from "../../../shared/components/Button";
import {
  Container,
  InnerContainer,
  ButtonGroup,
  Data,
  Description,
  InfoBlock,
  Row,
  Title
} from "./Styles";
import { formatDateTime } from "../../../shared/utils/dateTime";
import useSessionActions from "./Func";
import pubsub from "sweet-pubsub";
import { useModalStateHelper } from "pages/Home/components/shared";
import RescheduleModal from "./Modals/RescheduleModal";
import ChangeTypeModal from "./Modals/ChangeTypeModal";
import ChangePerformerModal from "./Modals/ChangePerformerModal";
import CancelRecordModal from "./Modals/CancelRecordModal";
import { color } from "shared/utils/styles";
import { RecordContext } from "./Context";
import FinishRecordModal from "./Modals/FinishRecordModal";
import { Divider } from "pages/Authentication/Styles";
import ConsumableTable from "./Consumables/table";
import { PageLoading } from "@ant-design/pro-layout"

const RecordDetail = () => {
  const { recordId } = useParams();
  const rescheduleModalHelper = useModalStateHelper();
  const recordPerformerModalHelper = useModalStateHelper();
  const recordTypeModalHelper = useModalStateHelper();
  const cancelModalHelper = useModalStateHelper();
  const finishModalHelper = useModalStateHelper();
  const [{ isLoading, error, data }, fetchRecord] = useApi.get(
    `/records/${recordId}/`,
    {},
    { mountFetch: true }
  );
  const actions = useSessionActions(recordId, data?.datetime || null);

  const canEditRecord = useMemo(() => {
    const statusFit = ["new", "pending"].includes(data?.status);
    return statusFit;
  }, [data]);

  useEffect(() => {
    pubsub.on("fetch-record", fetchRecord);
    return () => pubsub.off("fetch-record", fetchRecord);
  }, [fetchRecord]);

  if (isLoading) return <PageLoading tip={"Загрузка..."} />;
  if (error) return <PageError />;

  return (
    <RecordContext.Provider value={data}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Link to={`/customers/${data.customer.id}`}>
          <Button type="button" variant="empty" icon="arrow-left">
            {data.customer.full_name}
          </Button>
        </Link>
        <ButtonGroup>
          {["new", "pending"].includes(data.status) && (
            <Fragment>
              <Button
                type="button"
                variant="success"
                icon="check"
                onClick={actions.start.trigger}
              >
                Начать
              </Button>
              <Button
                type="button"
                variant="primary"
                icon="stopwatch"
                onClick={rescheduleModalHelper.open}
              >
                Перенести
              </Button>
              <Button
                type="button"
                variant="danger"
                icon="close"
                onClick={cancelModalHelper.open}
              >
                Отменить
              </Button>
            </Fragment>
          )}
          {data.status === "in_work" && (
            <Button
              type="button"
              variant="success"
              icon="check"
              onClick={finishModalHelper.open}
            >
              Завершить
            </Button>
          )}
        </ButtonGroup>
      </div>
      <Row>
        <dl>
          <InfoBlock>
            <Title>Студия: </Title>
            <Description>{data?.parlor?.name || "–"}</Description>
          </InfoBlock>
          <InfoBlock>
            <Title>Кто создал: </Title>
            <Description>
              {data?.created_by?.user?.full_name || "–"}
            </Description>
          </InfoBlock>
          <InfoBlock>
            <Title>Когда создан: </Title>
            <Description>
              {formatDateTime(data.created_at, "DD.MM.YYYY HH:mm:ss")}
            </Description>
          </InfoBlock>
          <InfoBlock>
            <Title>Примерное время на сеанс: </Title>
            <Description>{data.approximate_time}</Description>
          </InfoBlock>
        </dl>
        <dl>
          <InfoBlock>
            <Title>Тип сеанса: </Title>
            {!!data.type ? (
              <Description>
                {canEditRecord ? (
                  <Button
                    variant="secondary"
                    style={{ cursor: "copy" }}
                    onClick={recordTypeModalHelper.open}
                    icon="edit"
                  >
                    {data.type.name}
                  </Button>
                ) : (
                  data.type.name
                )}
              </Description>
            ) : (
              <Description>–</Description>
            )}
          </InfoBlock>
          <InfoBlock>
            <Title>Мастер: </Title>
            <Description>
              {canEditRecord ? (
                <Button
                  variant={data.performer ? "secondary" : "danger"}
                  style={{ cursor: "copy" }}
                  onClick={recordPerformerModalHelper.open}
                  icon={data.performer ? "edit" : "plus"}
                >
                  {data.performer ? data.performer.user.full_name : "Не выбран"}
                </Button>
              ) : data.performer ? (
                data.performer.user.full_name
              ) : (
                "Не выбран"
              )}
            </Description>
          </InfoBlock>
          <InfoBlock>
            <Title>Эскиз: </Title>
            {!!data.sketch ? (
              <Description>
                <Button
                  variant="secondary"
                  onClick={() => window.open(data.sketch)}
                  icon="link"
                >
                  Открыть в новой вкладке
                </Button>
              </Description>
            ) : (
              <Description>–</Description>
            )}
          </InfoBlock>
          <InfoBlock>
            <Title>Предоплата: </Title>
            <Description>
              {data.prepayments.reduce(
                (acc, next) => acc + parseFloat(next.value),
                0.0
              )}
            </Description>
          </InfoBlock>
        </dl>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <InfoBlock>
            <Data>{data.status_display}</Data>
          </InfoBlock>
          <InfoBlock style={{ textAlign: "center" }}>
            <h4>Дата записи</h4>
            <Data>{formatDateTime(data.datetime, "DD.MM.YYYY")}</Data>
            <Data>{formatDateTime(data.datetime, "HH:mm")}</Data>
          </InfoBlock>
        </div>
      </Row>
      <div>
        <dl>
          <InfoBlock>
            <Title>Заметка: </Title>
            <Description>{data.comment || "–"}</Description>
          </InfoBlock>
        </dl>
      </div>
      {data.status === "in_work" && <ConsumableTable />}
      {data.status === "canceled" && (
        <Container>
          <InnerContainer color={color.backgroundLightDanger}>
            <h2 className="text-center">Анкета отмененной записи</h2>
            <dl>
              <Title>Причина отмены:</Title>
              <Description>{data.reason}</Description>
              {data.rollback_prepayment !== null && (
                <Fragment>
                  <Title>Предоплата:</Title>
                  <Description>
                    {data.rollback_prepayment
                      ? "Возвращена клиенту"
                      : "Оставлена в кассе"}
                  </Description>
                </Fragment>
              )}
            </dl>
          </InnerContainer>
        </Container>
      )}
      {data.status === "finished" && (
        <Container>
          <InnerContainer color={color.backgroundLightSuccess}>
            <h2 className="text-center">Анкета завершенной записи</h2>
            <dl>
              <Title>Указанная стоимость:</Title>
              <Description>{data.price}</Description>
              {!!data.used_coupon && (
                <Fragment>
                  <Title>
                    Использованный купон({data.used_coupon.type_display}):
                  </Title>
                  <Description>{data.used_coupon.code}</Description>
                </Fragment>
              )}
            </dl>
            <Divider />
            <dl>
              {data.employee_payments.map(el => (
                <Fragment key={el.id}>
                  <Title>
                    Процент за {el.type} – {el.employee.user.full_name}:
                  </Title>
                  <Description>{el.amount}</Description>
                </Fragment>
              ))}
            </dl>
          </InnerContainer>
        </Container>
      )}
      {rescheduleModalHelper.isOpen() && (
        <Modal
          isOpen
          withCloseIcon={false}
          width={400}
          onClose={rescheduleModalHelper.close}
          renderContent={({ close }) => (
            <RescheduleModal
              modalClose={close}
              reschedule={actions.reschedule}
            />
          )}
        />
      )}
      {cancelModalHelper.isOpen() && (
        <Modal
          isOpen
          withCloseIcon={false}
          width={400}
          onClose={cancelModalHelper.close}
          renderContent={({ close }) => (
            <CancelRecordModal modalClose={close} />
          )}
        />
      )}
      {recordTypeModalHelper.isOpen() && (
        <Modal
          isOpen
          withCloseIcon={false}
          onClose={recordTypeModalHelper.close}
          width={400}
          renderContent={({ close }) => <ChangeTypeModal modalClose={close} />}
        />
      )}
      {recordPerformerModalHelper.isOpen() && (
        <Modal
          isOpen
          withCloseIcon={false}
          onClose={recordPerformerModalHelper.close}
          width={400}
          renderContent={({ close }) => (
            <ChangePerformerModal modalClose={close} />
          )}
        />
      )}
      {finishModalHelper.isOpen() && (
        <Modal
          isOpen
          withCloseIcon={false}
          onClose={finishModalHelper.close}
          width={1200}
          renderContent={({ close }) => (
            <FinishRecordModal modalClose={close} />
          )}
        />
      )}
    </RecordContext.Provider>
  );
};

export default RecordDetail;
