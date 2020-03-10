import React, { Fragment } from "react";
import { useCurrentProfile } from "shared/hooks/currentUser";
import useApi from "shared/hooks/api";

const RemainWidget = () => {
  const profile = useCurrentProfile();
  const [{ data }] = useApi.get(
    `/parlors/${profile?.parlor?.id}/`,
    { balance: true },
    { mountFetch: true }
  );
  return (
    <Fragment>
      <span>Остаток в кассе</span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          alignItems: "center"
        }}
      >
        <h2>{data?.balance}</h2>
      </div>
    </Fragment>
  );
};

export default RemainWidget;
