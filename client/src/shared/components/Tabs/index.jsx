import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Label, TabBodyWrapper, TabNavWrapper, TabWrapper } from "./Styles"


const propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    render: PropTypes.element.isRequired
  })).isRequired
}

const Tabs = ({ tabs }) => {
  const [tab, setTab] = useState(0)

  useEffect(() => {
    setTab(0)
  }, [tabs])

  return tabs.length
    ? <TabWrapper>
      <TabNavWrapper>
        {tabs.map((tabData, index) => <Label key={index} className={index === tab && "active"} onClick={() => setTab(index)}>{tabData.label}</Label>)}
      </TabNavWrapper>
      <TabBodyWrapper>
        {tabs[tab].render}
      </TabBodyWrapper>
    </TabWrapper>
    : null
}

Tabs.propTypes = propTypes

export default Tabs
