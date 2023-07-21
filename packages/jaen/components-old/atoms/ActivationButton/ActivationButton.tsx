import {
  Box,
  CloseButton,
  Divider,
  Flex,
  HStack,
  Link,
  Spacer,
  Text,
  Tooltip
} from '@chakra-ui/react'
import React from 'react'
import {JaenLogo} from '../icons/index.js'

export interface ActivationButtonProps {
  onClick: () => void
}

export const ActivationButton = (props: ActivationButtonProps) => {
  const [isClicked, setIsClicked] = React.useState(false)

  const divider = <Divider orientation="vertical" borderColor="gray.500" />

  if (isClicked) {
    return (
      <HStack
        zIndex={2147483647}
        mt={{
          md: 16,
          base: 24
        }}
        spacing={6}
        h={{
          md: 16,
          base: 24
        }}
        w="full"
        px={4}
        py={2}
        position="fixed"
        bottom={0}
        left={0}
        boxShadow="dark-lg"
        bg="white"
        color="black"
        alignItems="center">
        <Flex
          h="full"
          w="auto"
          cursor="pointer"
          justifyContent="space-around"
          align="center"
          gap={2}
          py={{
            md: 0,
            base: 2
          }}
          onClick={props.onClick}>
          <JaenLogo h="full" w="auto" />
          <Text
            fontSize="sm"
            fontWeight="bold"
            display={{
              base: 'none',
              md: 'block'
            }}>
            Snek Jaen
          </Text>
        </Flex>

        {divider}

        <Box>
          <Text fontSize="sm" as="span">
            This site is powered by Snek Jaen. Visit the{' '}
            <Link onClick={props.onClick}>admin panel</Link> to edit this site.
          </Text>
        </Box>
        <Spacer />

        <HStack h="full">
          {divider}

          <CloseButton
            size="lg"
            onClick={() => {
              setIsClicked(false)
            }}
          />
        </HStack>
      </HStack>
    )
  }

  return (
    <Tooltip hasArrow label="Manage site" placement="right">
      <JaenLogo
        zIndex={2147483647}
        cursor="pointer"
        boxSize="14"
        position="fixed"
        left="5"
        bottom="5"
        onClick={() => {
          setIsClicked(true)
        }}
      />
    </Tooltip>
  )
}

export default ActivationButton
