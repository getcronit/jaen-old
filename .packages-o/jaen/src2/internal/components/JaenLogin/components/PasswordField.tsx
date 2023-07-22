import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  useDisclosure,
  useMergeRefs
} from '@chakra-ui/react'
import {forwardRef, useRef} from 'react'
import {HiEye, HiEyeOff} from 'react-icons/hi'

export const PasswordField = forwardRef<HTMLInputElement, InputProps>(
  ({isInvalid, ...props}, ref) => {
    const {isOpen, onToggle} = useDisclosure()
    const inputRef = useRef<HTMLInputElement>(null)

    const mergeRef = useMergeRefs(inputRef, ref)
    const onClickReveal = () => {
      onToggle()
      if (inputRef.current) {
        inputRef.current.focus({preventScroll: true})
      }
    }

    return (
      <FormControl isInvalid={isInvalid}>
        <FormLabel htmlFor="password">Password</FormLabel>
        <InputGroup>
          <Input
            id="password"
            ref={mergeRef}
            name="password"
            type={isOpen ? 'text' : 'password'}
            autoComplete="current-password"
            required
            {...props}
          />
          <InputRightElement>
            <IconButton
              variant="text"
              color="icon"
              aria-label={isOpen ? 'Mask password' : 'Reveal password'}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={onClickReveal}
            />
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>
          {props.name === 'password' && 'Password is required'}
        </FormErrorMessage>
      </FormControl>
    )
  }
)

PasswordField.displayName = 'PasswordField'
