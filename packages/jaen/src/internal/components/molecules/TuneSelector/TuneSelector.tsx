import {SearchIcon} from '@chakra-ui/icons'
import {
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import {useState} from 'react'

interface BaseTune {
  name: string
  label?: string
  props?: Record<string, any>
  onTune?: (props: Record<string, any>) => void
  Icon: React.ComponentType<{}>
  isActive?: ((props: Record<string, any>) => boolean) | boolean
  isDisableOnActive?: boolean
  isHiddenOnActive?: boolean
}

interface Tune extends BaseTune {
  type: 'tune'
  label: string
}

interface GroupTune {
  type: 'groupTune'
  label: string
  tunes: Array<BaseTune>
}

export type TuneOption = Tune | GroupTune

export interface TuneSelectorProps {
  tunes: Array<TuneOption>
  tuneProps: Record<string, any>
  onTune: (props: Record<string, any>) => void
  onClose: () => void
}

export const TuneSelector: React.FC<TuneSelectorProps> = ({
  tunes,
  tuneProps,
  onTune,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredTunes = tunes.filter(tune => {
    if ('type' in tune && tune.type === 'groupTune') {
      return tune.tunes.some(
        subTune =>
          subTune.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subTune.label?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    } else {
      return (
        tune.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tune.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
  })

  const handleTune = (tune: BaseTune) => {
    const props = tune.props || {}

    // if isActive set all props to undefined
    const isActive =
      typeof tune.isActive === 'function'
        ? tune.isActive(tuneProps)
        : tune.isActive

    if (isActive) {
      Object.keys(props).forEach(key => {
        props[key] = undefined
      })
    }

    tune.onTune?.(props)
    onTune(props)
    onClose()
  }

  return (
    <VStack
      p="3"
      rounded="xl"
      bg="white"
      w="48"
      maxW="300px"
      shadow="lg"
      border="1px"
      borderColor="gray.100">
      <InputGroup size="sm" variant="filled" rounded="md">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          px="10"
          py="1"
          bg="gray.50"
          _hover={{
            bg: 'gray.100'
          }}
          _focus={{
            bg: 'gray.100',
            boxShadow: 'outline'
          }}
        />
      </InputGroup>
      <VStack
        w="100%"
        align="flex-start"
        spacing="1"
        maxH="xs"
        overflowY="auto">
        {filteredTunes.map((tune, index) => {
          if ('type' in tune && tune.type === 'groupTune') {
            return (
              <VStack key={index} w="full">
                <Text fontSize="sm" as="b">
                  {tune.label}
                </Text>
                <Wrap spacing="1">
                  {tune.tunes.map((subTune, subIndex) => {
                    const isActive =
                      typeof subTune.isActive === 'function'
                        ? subTune.isActive(tuneProps)
                        : subTune.isActive
                    const isDisabled = isActive && subTune.isDisableOnActive

                    const isHidden = isActive && subTune.isHiddenOnActive

                    return (
                      <WrapItem
                        key={subIndex}
                        display={isHidden ? 'none' : 'flex'}>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          aria-label={`${subTune.name}`}
                          icon={<Icon as={subTune.Icon} />}
                          {...(isActive && {
                            bg: 'gray.100',
                            cursor: 'pointer'
                          })}
                          isDisabled={isDisabled}
                          onClick={() => {
                            handleTune(subTune)
                          }}
                        />
                      </WrapItem>
                    )
                  })}
                </Wrap>
              </VStack>
            )
          }

          if ('type' in tune && tune.type === 'tune') {
            const isActive =
              typeof tune.isActive === 'function'
                ? tune.isActive(tuneProps)
                : tune.isActive

            const isDisabled = isActive && tune.isDisableOnActive

            const isHidden = isActive && tune.isHiddenOnActive

            return (
              <HStack
                key={index}
                display={isHidden ? 'none' : 'flex'}
                rounded="md"
                w="100%"
                p="2"
                transition="all 0.2s"
                _hover={{
                  bg: 'gray.100'
                }}
                {...(isActive && {
                  bg: 'gray.100',
                  cursor: 'pointer'
                })}
                {...(isDisabled && {
                  opacity: 0.5,
                  cursor: 'not-allowed'
                })}
                onClick={() => {
                  if (!isDisabled) {
                    handleTune(tune)
                  }
                }}>
                {tune.Icon && <Icon as={tune.Icon} />}
                <Text fontSize="sm">{tune.name}</Text>
              </HStack>
            )
          }

          return null
        })}
      </VStack>
    </VStack>
  )
}
