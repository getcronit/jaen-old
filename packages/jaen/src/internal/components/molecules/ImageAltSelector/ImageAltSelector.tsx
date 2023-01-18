import {Box, Button, ButtonProps, Stack, Text, Textarea} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import {BsTag} from 'react-icons/bs'

import {SelectorButton} from '../../organisms/index.js'

export interface ImageAltSelectorProps {
  value: string
  onSave: (value: string) => void
}

export const ImageAltSelector: React.FC<ImageAltSelectorProps> = props => {
  const [value, setValue] = useState<string>(props.value)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const isEmpty = value === ''
  const canSave = props.value !== value

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  const optionalProps: ButtonProps = {}

  if (isEmpty) {
    optionalProps.variant = 'solid'
    optionalProps.backgroundColor = 'orange.100'
    optionalProps.color = 'orange.500'
  }

  return (
    <SelectorButton icon={<BsTag />} {...optionalProps}>
      {({onClose}) => (
        <Stack w="xs">
          <Box w="100%">
            <Text fontSize="md" fontWeight="bold" textAlign="left">
              Image description
            </Text>
            <Text fontSize="xs" color="gray.400">
              Add a description to your image for better accessibility
            </Text>
          </Box>
          <Textarea maxLength={125} value={value} onChange={handleChange} />
          <Text fontSize="xx-small" color="gray.400" textAlign="right">
            {value.length}/125
          </Text>
          <Button
            disabled={!canSave}
            size="sm"
            onClick={() => {
              props.onSave(value)
              onClose()
            }}>
            Save
          </Button>
        </Stack>
      )}
    </SelectorButton>
  )
}
