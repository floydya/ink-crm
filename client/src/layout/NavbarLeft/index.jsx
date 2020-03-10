import React, { useCallback, useContext, useMemo } from "react"
import PropTypes from "prop-types"
import { Icon } from "../../shared/components"

import { NavLeft, LogoLink, StyledLogo, Bottom, Item, ItemText } from "./Styles"
import { authenticationActions } from "../../store/actions"
import { Link, useLocation } from "react-router-dom"
import { AuthenticationContext } from "../../services/authentication.service"

const propTypes = {
  notificationsModalOpen: PropTypes.func.isRequired,
  settingsModalOpen: PropTypes.func.isRequired
}

const ProjectNavbarLeft = ({ notificationsModalOpen, settingsModalOpen }) => {
  const location = useLocation()
  const { dispatch, user } = useContext(AuthenticationContext)

  const profileLink = useMemo(() => `/employees/${user?.id}`, [user])

  const handleLogout = useCallback(() => {
    dispatch(authenticationActions.logoutUser())
  }, [dispatch])

  return <NavLeft>
    <LogoLink to="/">
      <StyledLogo color="#fff" />
    </LogoLink>

    <Link to="/home">
      <Item className={location.pathname === "/home" && "active"}>
        <Icon type="home" size={22} top={1} left={3} />
        <ItemText>Главная</ItemText>
      </Item>
    </Link>

    <Item onClick={notificationsModalOpen}>
      <Icon type="notification" size={22} top={1} left={3} />
      <ItemText>Уведомления</ItemText>
    </Item>

    <Bottom>
      <Link to={profileLink}>
        <Item className={location.pathname === profileLink && "active"}>
          <Icon type="user" size={27} />
          <ItemText>Профиль</ItemText>
        </Item>
      </Link>
      <Item onClick={settingsModalOpen}>
        <Icon type="settings" size={27} />
        <ItemText>Настройки</ItemText>
      </Item>
      <Item onClick={handleLogout}>
        <Icon type="exit" size={27} />
        <ItemText>Выйти</ItemText>
      </Item>
    </Bottom>
  </NavLeft>
}

ProjectNavbarLeft.propTypes = propTypes

export default ProjectNavbarLeft