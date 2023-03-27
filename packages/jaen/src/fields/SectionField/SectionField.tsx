import {DeleteIcon} from '@chakra-ui/icons'
import {Box, Button, HStack, IconButton, Text} from '@chakra-ui/react'
import * as React from 'react'
import {FiBox} from 'react-icons/fi'

import {IBlockConnection} from '../../connectors/index.js'
import {
  HighlightTooltip,
  SectionBlockSelectorButton,
  SelectorBlockAddType,
  SelectorBlockType
} from '../../internal/components/index.js'
import {useModals} from '../../internal/context/Modals/ModalContext.js'
import {JaenSectionBlockProvider} from '../../internal/context/SectionBlockContext.js'
import {useSectionField} from '../../internal/hooks/field/useSectionField.js'
import {useStatus} from '../../internal/index.js'
import {withRedux} from '../../internal/redux/index.js'
import {IJaenBlock} from '../../types.js'

type SectionPropsCallback = (args: {
  count: number
  totalSections: number
  section: IJaenBlock
}) => Record<string, any>

export interface SectionFieldProps {
  name: string // chapterName
  label: string
  blocks: IBlockConnection[]
  as?: React.ComponentType<React.HTMLAttributes<HTMLElement>>
  sectionAs?: React.ComponentType<React.HTMLAttributes<HTMLElement>>
  props?: Record<string, any>
  sectionProps?: Record<string, any> | SectionPropsCallback
  className?: string
  style?: React.CSSProperties
  sectionClassName?: string
  sectionStyle?: React.CSSProperties
}

export const SectionField = withRedux(
  ({name, label, blocks, ...rest}: SectionFieldProps) => {
    const {confirm, toast} = useModals()

    const {
      onSectionAdd,
      onSectionDelete,
      onSectionAppend,
      onSectionPrepend,
      section,
      sectionsDict,
      sectionPath
    } = useSectionField({sectionName: name, blocks})

    const {isEditing} = useStatus()

    const Wrapper = rest.as || Box

    let tooltipButtons = [
      <Button
        key="section-field-tooltip-button-add"
        variant="jaenHighlightTooltipText"
        size="xs">
        <Text as="span" noOfLines={1}>
          {label}
        </Text>
      </Button>
    ]

    const blocksForSelector: SelectorBlockType[] = blocks.map(({options}) => ({
      slug: options.name,
      label: options.label,
      Icon: options.Icon || FiBox
    }))

    const handleSectionAdd = (
      block: SelectorBlockType,
      type: SelectorBlockAddType,
      item?: IJaenBlock
    ) => {
      if (item) {
        if (type === 'prepend') {
          onSectionPrepend(block.slug, item.id, item.ptrPrev)
        } else if (type === 'append') {
          onSectionAppend(block.slug, item.id, item.ptrNext)
        } else {
          onSectionAdd(block.slug, [item.id, item.ptrNext])
        }
      } else {
        if (type === 'prepend' && section.ptrHead) {
          onSectionPrepend(block.slug, section.ptrHead, null)
        } else if (type === 'append' && section.ptrTail) {
          onSectionAppend(block.slug, section.ptrTail, null)
        } else {
          onSectionAdd(block.slug, [null, null])
        }
      }

      toast({
        title: 'Block added',
        description: `Block has been added to the ${label} section`,
        status: 'info'
      })
    }

    const handleSectionDelete = async (
      id: string,
      ptrPrev: string | null,
      ptrNext: string | null
    ) => {
      const shouldDelete = await confirm(
        `Are you sure you want to remove this block from the ${label} section?`
      )

      if (shouldDelete) {
        onSectionDelete(id, ptrPrev, ptrNext)

        toast({
          title: 'Block deleted',
          description: `Block has been removed from the ${label} section`,
          status: 'info',
          variant: 'subtle'
        })
      }
    }

    if (blocks.length > 0) {
      tooltipButtons = tooltipButtons.concat([
        <HStack spacing="0.5" key="section-field-tooltip-buttons">
          <SectionBlockSelectorButton
            onBlockAdd={handleSectionAdd}
            blocks={blocksForSelector}
            onlyAdd={section.items.length === 0}
          />
        </HStack>
      ])
    }

    return (
      <HighlightTooltip isEditing={isEditing} actions={tooltipButtons}>
        <Box boxSize="full">
          <Wrapper
            minH="64"
            w="full"
            {...rest.props}
            className={rest.className}
            style={rest.style}>
            {section.items.map((item, index) => {
              const s = sectionsDict[item.type]

              if (s == null) {
                console.error(
                  `Section type ${item.type} is not found in sections dictionary!`
                )
                return null
              }

              const SectionWrapper = rest.sectionAs || Box

              const sectionProps =
                typeof rest.sectionProps === 'function'
                  ? rest.sectionProps({
                      count: index + 1,
                      totalSections: section.items.length,
                      section: item
                    })
                  : rest.sectionProps

              return (
                <HighlightTooltip
                  key={item.id}
                  as={SectionWrapper}
                  isEditing={isEditing}
                  actions={[
                    <Button
                      variant="jaenHighlightTooltipText"
                      key={`section-field-tooltip-button-${item.id}`}>
                      <Text as="span" noOfLines={1}>
                        {s.Component.options.label}
                      </Text>
                    </Button>,
                    <HStack
                      spacing="0.5"
                      key={`section-field-tooltip-buttons-${item.id}`}>
                      <SectionBlockSelectorButton
                        onBlockAdd={(block, type) => {
                          handleSectionAdd(block, type, item)
                        }}
                        blocks={blocksForSelector}
                        onlyAdd={false}
                      />
                      <IconButton
                        variant="jaenHighlightTooltip"
                        icon={<DeleteIcon />}
                        aria-label="Delete"
                        onClick={() => {
                          void handleSectionDelete(
                            item.id,
                            item.ptrPrev,
                            item.ptrNext
                          )
                        }}
                      />
                    </HStack>
                  ]}
                  asProps={{
                    ...sectionProps
                  }}>
                  <Box>
                    <JaenSectionBlockProvider
                      path={sectionPath}
                      id={item.id}
                      position={index}
                      Component={s.Component}
                    />
                  </Box>
                </HighlightTooltip>
              )
            })}
          </Wrapper>
        </Box>
      </HighlightTooltip>
    )
  }
)
