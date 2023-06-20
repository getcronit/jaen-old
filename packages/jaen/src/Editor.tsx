import {Box, Heading} from '@chakra-ui/react'
import {connectBlock} from './connectors/connectBlock.js'
import {Field} from './fields/index.js'
import {SectionFieldProps} from './fields/SectionField/SectionField.js'

export interface EditorProps {
  blocks?: SectionFieldProps['blocks']
}

export const Editor: React.FC<EditorProps> = ({blocks = []}) => {
  return (
    <Field.Section
      name="editor"
      label="Editor"
      blocks={[HeadingBlock, TextBlock, ImageBlock, ...blocks]}
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
            name: 'heading',
            label: 'Heading',
            tunes: new Array(6).fill(0).map((_, i) => {
              const n = i + 1

              const tag = `h${n}`
              const fontSize = `${i === 5 ? 'xl' : `${6 - i}xl`}`
              const marginTop = `${2 + (7 - i) * 0.5}rem`

              return {
                type: 'tune',
                name: tag,
                label: `Heading ${i}`,
                Icon: () => <Box>{tag.toUpperCase()}</Box>,
                // Disable on active if tag is h2 because it is the default
                isDisableOnActive: tag === 'h2',
                requiredProps: ['asAs'],
                props: {
                  asAs: tag,
                  fontSize,
                  marginTop
                }
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
          variant="cursive"
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
