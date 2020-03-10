import React from "react"
import PropTypes from "prop-types"
import { Row } from "./Styles"
import Settings from "./Settings"
import ChangePassword from "./ChangePassword"

const propTypes = {
  modalClose: PropTypes.func.isRequired
}

const SettingsModal = ({ modalClose }) => {
  return <Row>
    <Settings modalClose={modalClose} />
    <ChangePassword modalClose={modalClose} />
  </Row>
}

SettingsModal.propTypes = propTypes

export default SettingsModal
