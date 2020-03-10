import { useContext, useMemo } from "react"
import { AuthenticationContext } from "../../services/authentication.service"

export const useCurrentProfile = () => {
  const { user, parlor } = useContext(AuthenticationContext)
  return useMemo(
    () => user?.profile?.find(el => el.parlor.id === parlor),
    [user, parlor]
  )
}