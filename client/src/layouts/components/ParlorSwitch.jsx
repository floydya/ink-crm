import React, { useCallback, useContext, useMemo } from "react"
import { AuthenticationContext } from "services/authentication.service"
import { authenticationActions } from "store/actions"
import { Select } from "./ParlorSwitch.components"

const getParlorFromProfile = (profile) => {
  return { id: profile.parlor.id, name: profile.parlor.name }
}

export const ParlorSwitch = ({ logo }) => {
  const { user, dispatch, parlor: currentParlor } = useContext(AuthenticationContext)
  const onChange = useCallback(
    (selected) => dispatch(authenticationActions.setParlor(selected.id)),
    [dispatch]
  )
  const parlors = useMemo(
    () => (user?.profile || []).map(getParlorFromProfile),
    [user]
  )
  return (<a href="#" onClick={event => event.preventDefault()}>
    {logo}
    <h1 style={{ width: "100%" }}>
      <Select value={currentParlor} bordered={false} onChange={onChange}>
        {parlors.map(el => <Select.Option key={el.id} value={el.id}>{el.name}</Select.Option>)}
      </Select>
    </h1>
  </a>)
}
