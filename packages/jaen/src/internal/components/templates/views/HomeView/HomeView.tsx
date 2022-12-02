import {Box, Icon, SimpleGrid, useColorModeValue} from '@chakra-ui/react'
import {FaRocket} from 'react-icons/fa'

import {
  List,
  ListItem,
  Stat,
  StatLabel,
  StatNumber
} from '../../../molecules/index.js'

import {useOptions} from '../../../../hooks/useOptions.js'
import {useStatistics} from '../../../../hooks/useStatistics.js'
import {ViewLayout} from '../../../organisms/index.js'

export interface HomeViewProps {}

export const HomeView: React.FC<HomeViewProps> = () => {
  const {totalChanges, totalPages, totalNotificatons, migrations} =
    useStatistics()

  const data = [
    {label: 'Total pages', value: totalPages},
    {label: 'Total notifications', value: totalNotificatons},
    {label: 'Unpublished changes', value: totalChanges}
  ]

  const {isPublishing} = useOptions()

  return (
    <ViewLayout
      px={{
        base: 2,
        md: 4
      }}
      py={{
        base: 4,
        md: 8
      }}>
      <SimpleGrid columns={{base: 1, md: 3}} spacing="6">
        {data.map(({label, value}) => (
          <Stat key={label}>
            <StatLabel>{label}</StatLabel>
            <StatNumber>{value}</StatNumber>
          </Stat>
        ))}
        <Box>
          <List
            spacing="12"
            overflowY="auto"
            h={'xs'}
            label="Previouse releases">
            {isPublishing && (
              <ListItem
                title="In progress"
                subTitle={`Your website will be live in a few minutes.`}
                circleColor={useColorModeValue('orange.500', 'orange.300')}
                icon={<Icon as={FaRocket} boxSize="6" />}
              />
            )}

            {migrations.map((m, i) => (
              <ListItem
                key={i}
                title="Published site"
                subTitle={`Published on ${new Date(
                  m.createdAt
                ).toLocaleString()}`}
                circleColor={useColorModeValue('teal.500', 'teal.300')}
                icon={<Icon as={FaRocket} boxSize="6" />}
                isLastItem={i === migrations.length - 1}
              />
            ))}
          </List>
        </Box>
        {/* <UndrawThoughts /> */}
      </SimpleGrid>
    </ViewLayout>
  )
}
