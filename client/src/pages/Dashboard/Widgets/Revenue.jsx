import React, { useMemo, Fragment } from "react";
import moment from "moment";
import { formatDateTimeForAPI } from "shared/utils/dateTime";
import useApi from "shared/hooks/api";
import { PageLoader, PageError, Icon } from "shared/components";
import { useCurrentProfile } from "shared/hooks/currentUser";

const RevenueWidget = () => {
  const profile = useCurrentProfile()
  const variables = useMemo(
    () => ({
      created_at_after: formatDateTimeForAPI(
        moment()
          .subtract(1, "d")
          .startOf("day")
      ),
      created_at_before: formatDateTimeForAPI(moment().endOf("day")),
      transaction_type: "deposit",
      purpose: profile?.parlor?.id
    }),
    [profile]
  );
  const [{ isLoading, error, data }] = useApi.get(
    `/parlors-transactions/`,
    variables,
    { mountFetch: true }
  );
  const counterData = useMemo(
    () =>
      (data || []).reduce(
        (acc, next) => {
          if (moment(next.created_at).diff(moment().startOf("day")) < 0)
            return Object.assign(acc, { yesterday: [...acc.yesterday, next] });
          return Object.assign(acc, { today: [...acc.today, next] });
        },
        { yesterday: [], today: [] }
      ),
    [data]
  );
  const summaryData = useMemo(
    () => ({
      yesterday: counterData.yesterday.reduce(
        (acc, next) => acc + parseFloat(next.amount),
        0.0
      ),
      today: counterData.today.reduce(
        (acc, next) => acc + parseFloat(next.amount),
        0.0
      )
    }),
    [counterData]
  );
  if (isLoading) return <PageLoader />;
  if (error) return <PageError />;
  return (
    <Fragment>
      <span>Выручка</span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          alignItems: "center",
        }}
      >
        <h2>
          {summaryData.today}
        </h2>
        <div style={{ display: "flex", flexFlow: "column", alignItems: "flex-end" }}>
        <h4 style={{ fontSize: "16px" }}>
          {summaryData.today - summaryData.yesterday}
          {summaryData.today - summaryData.yesterday < 0 
            ? <Icon type="arrow-down" style={{ color: "red" }} />
            : summaryData.today - summaryData.yesterday > 0 
              ? <Icon type="arrow-up" style={{ color: "green" }} />
              : <Icon type="arrow-up" style={{ color: "cornflowerblue" }} />  
          }
        </h4>
        <h5>чем вчера</h5>
        </div>
        
      </div>
    </Fragment>
  );
};

export default RevenueWidget;
