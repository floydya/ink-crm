import React, { Fragment } from "react"
import PropTypes from "prop-types"
import { Container, Divider } from "./Styles"
import { Link } from "react-router-dom"

const propTypes = {
  items: PropTypes.array.isRequired
}

const Breadcrumb = (item, index) => (
  item.link
    ? (<Link key={index} to={item.link}>
      {index !== 0 && <Divider>/</Divider>}
      {item.name}
    </Link>)
    : (
      <Fragment key={index}>
        {index !== 0 && <Divider>/</Divider>}
        {item.name}
      </Fragment>
    )
)

const Breadcrumbs = ({ items }) => (
  <Container>
    {items.map(Breadcrumb)}
  </Container>
)

Breadcrumbs.propTypes = propTypes

export default Breadcrumbs
