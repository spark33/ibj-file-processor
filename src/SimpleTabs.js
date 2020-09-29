import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function SimpleTabs({ activeTab, setActiveTab, children }) {

  const handleChange = (event, newTab) => {
    setActiveTab(newTab)
  }

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box py={3}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  return (
    <div>
      <div>
        <Tabs value={activeTab} onChange={handleChange} aria-label="simple tabs example">
          {children.map((child, i) => {
            return child && <Tab label={child.props.label} disabled={child.props.disabled} {...a11yProps(i)} />
          })}
        </Tabs>
      </div>
      {children.map((child, i) => (
        child && (
          <TabPanel value={activeTab} index={i}>
            {child}
          </TabPanel>
        )
      ))}
    </div>
  );
}