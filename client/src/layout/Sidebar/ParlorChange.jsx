import React, { Fragment, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { authenticationActions } from "../../store/actions"
import { Actions, Content, ProjectCategory, ProjectInfo, ProjectName, ProjectTexts, SubmitButton } from "./Styles"
import { Modal, ProjectAvatar, Select } from "../../shared/components"
import { AuthenticationContext } from "../../services/authentication.service"


const ParlorChange = () => {
  const { dispatch, user, parlor: currentParlor } = useContext(AuthenticationContext)
  const parlors = useMemo(() => user?.profile || [], [user])
  const parlor = useMemo(
    () => parlors.find(el => el.parlor.id === currentParlor),
    [parlors, currentParlor]
  )
  const [modal, setModal] = useState(false)
  const toggleModal = useCallback(() => {
    setModal(prev => !prev)
  }, [])
  const [selectedParlor, setSelectedParlor] = useState()
  const setParlor = useCallback((parlorId = null) => {
    dispatch(authenticationActions.setParlor(selectedParlor || parlorId))
    setModal(false)
  }, [selectedParlor, dispatch])

  useEffect(() => {
    if (!currentParlor && parlors.length === 1) {
      setParlor(parlors[0].parlor.id)
    } else if (currentParlor && parlors.length === 1) {
      if (!parlors.find(el => el.parlor.id === currentParlor)) {
        setParlor(parlors[0].parlor.id)
      }
    }
  }, [setParlor, parlors, currentParlor])

  return <ProjectInfo>
    <ProjectAvatar onClick={parlors.length > 1 ? toggleModal : undefined} />
    <ProjectTexts>
      <ProjectName>{parlor?.parlor?.name}</ProjectName>
      <ProjectCategory>{parlor?.role}</ProjectCategory>
      <Modal
        isOpen={!parlor || modal}
        testid="modal:change-parlor"
        width={400}
        withCloseIcon={false}
        renderContent={() => (
          <Fragment>
            <Content>
              <Select
                onChange={setSelectedParlor}
                options={parlors.map(el => ({ label: el.parlor.name, value: el.parlor.id }))}
              />
              <Actions>
                <SubmitButton
                  onClick={setParlor}
                  variant="primary"
                  disabled={!selectedParlor}
                >
                  Выбрать
                </SubmitButton>
                {!!parlor && <SubmitButton onClick={toggleModal} variant="empty">
                  Отменить
                </SubmitButton>}
              </Actions>
            </Content>
          </Fragment>
        )
        }
      />
    </ProjectTexts>
  </ProjectInfo>
}


export default ParlorChange