import {AddIcon} from '@chakra-ui/icons'
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useTheme
} from '@chakra-ui/react'
import React, {useState} from 'react'
import {ThemeProvider} from '../../../internal/styles/ChakraThemeProvider.js'

interface ComponentInfoProps {
  items: Array<{
    label: string
    onClick: () => void
  }>
}

export const ComponentInfo: React.FC<ComponentInfoProps> = ({items}) => (
  <Menu>
    <MenuButton
      as={Button}
      leftIcon={<AddIcon />}
      size="sm"
      variant="link"
      mx="2">
      Components
    </MenuButton>

    <MenuList>
      {items.map(item => (
        <MenuItem key={item.label} onClick={item.onClick}>
          {item.label}
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
)

export interface TabsProps {
  tabs: Array<{
    label: React.ReactNode
    content: React.ReactNode
  }>
  selectedTab: number
  componentsInfo?: ComponentInfoProps['items']
}

const TabsTemplate: React.FC<TabsProps> = props => {
  const [selectedTab, setSelectedTab] = useState(props.selectedTab)

  const handleTabChange = (index: number) => {
    setSelectedTab(index)
  }

  const currentTheme = useTheme()

  return (
    <Box position="relative">
      <Tabs index={selectedTab} onChange={handleTabChange} pos="relative">
        <ThemeProvider>
          <TabList pos="sticky" top="0" zIndex="1" bg="gray.100">
            {props.tabs.map((tab, i) => (
              <Tab key={i}>{tab.label}</Tab>
            ))}
            <Spacer />
            <ComponentInfo items={props.componentsInfo || []} />
          </TabList>
        </ThemeProvider>

        <ThemeProvider theme={currentTheme} cssVarsRoot={':root'}>
          <TabPanels>
            {props.tabs.map((tab, i) => (
              <TabPanel key={i} p="0">
                {tab.content}
              </TabPanel>
            ))}
          </TabPanels>
        </ThemeProvider>
      </Tabs>
    </Box>
  )
}

export default TabsTemplate
