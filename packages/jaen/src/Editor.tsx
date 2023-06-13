import {Box, Heading} from '@chakra-ui/react'
import {connectBlock} from './connectors/connectBlock.js'
import {Field} from './fields/index.js'

export interface EditorProps {}

export const Editor: React.FC<EditorProps> = () => {
  return (
    <Field.Section
      name="editor"
      label="Editor"
      blocks={[HeadingBlock, TextBlock, ImageBlock]}
    />
  )
}

const TextBlock = connectBlock(
  () => {
    return <Field.Text name="text" defaultValue="Example Text" />
  },
  {
    label: 'TextBlock',
    name: 'TextBlock'
  }
)

const HeadingBlock = connectBlock(
  () => {
    return (
      <Field.Text
        as={Heading}
        name="heading"
        defaultValue="Example Heading"
        textAlign="center"
        tunes={[
          {
            type: 'groupTune',
            label: 'Heading',
            tunes: new Array(6).fill(0).map((_, i) => {
              const n = i + 1

              const tag = `h${n}`

              return {
                type: 'tune',
                name: tag,
                label: `Heading ${i}`,
                Icon: () => <Box>{tag.toUpperCase()}</Box>,
                props: {
                  asAs: tag,
                  fontSize: `${i === 5 ? 'xl' : 6 - i + 'xl'}`
                },
                isActive: props => props.asAs === tag
              }
            })
          }
        ]}
      />
    )
  },
  {
    label: 'HeadingBlock',
    name: 'HeadingBlock'
  }
)

const ImageBlock = connectBlock(
  () => {
    return (
      <Box>
        <Box h="md" m="4" objectFit="contain">
          <Field.Image name="image" objectFit="contain" />
        </Box>
        <Field.Text
          name="caption"
          textAlign="center"
          variant={'cursive'}
          fontSize="xs"
        />
      </Box>
    )
  },
  {
    label: 'ImageBlock',
    name: 'ImageBlock'
  }
)
