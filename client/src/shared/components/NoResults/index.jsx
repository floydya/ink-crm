import React from "react"
import PropTypes from "prop-types"
import NoResultsSVG from "./NoResultsSVG"
import styled from "styled-components"
import { font } from "../../utils/styles"

export const NoResultsContainer = styled.div`
  padding-top: 50px;
  text-align: center;
`

export const NoResultsTitle = styled.div`
  padding-top: 30px;
  ${font.medium}
  ${font.size(20)}
`

export const NoResultsTip = styled.div`
  padding-top: 10px;
  ${font.size(15)}
`

const propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.element]).isRequired,
  tip: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.element])
}

const defaultProps = {
  tip: "",
}

const NoResults = ({ title, tip }) => (
  <NoResultsContainer>
    <NoResultsSVG />
    <NoResultsTitle>{title}</NoResultsTitle>
    <NoResultsTip>{tip}</NoResultsTip>
  </NoResultsContainer>
)

NoResults.propTypes = propTypes
NoResults.defaultProps = defaultProps

export default NoResults