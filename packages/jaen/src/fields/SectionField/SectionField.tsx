import {DeleteIcon} from '@chakra-ui/icons'
import {Box, Button, HStack, IconButton, Text} from '@chakra-ui/react'
import * as React from 'react'
import {FiBox} from 'react-icons/fi'

import {ISectionConnection} from '../../connectors/index.js'
import {
  HighlightTooltip,
  SectionBlockSelectorButton,
  SelectorBlockAddType,
  SelectorBlockType
} from '../../internal/components/index.js'
import {HighlightProviderContext} from '../../internal/context/HighlightContext.js'
import {useModals} from '../../internal/context/Modals/ModalContext.js'
import {JaenSectionProvider} from '../../internal/context/SectionContext.js'
import {useSectionField} from '../../internal/hooks/field/useSectionField.js'
import {useStatus} from '../../internal/index.js'
import {withRedux} from '../../internal/redux/index.js'
import {IJaenSectionItem} from '../../types.js'

type SectionPropsCallback = (args: {
  count: number
  totalSections: number
  section: IJaenSectionItem
}) => Record<string, any>

export interface SectionFieldProps {
  name: string // chapterName
  displayName: string
  sections: ISectionConnection[]
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
  ({name, displayName, sections, ...rest}: SectionFieldProps) => {
    const {confirm, toast} = useModals()

    const {
      onSectionAdd,
      onSectionDelete,
      onSectionAppend,
      onSectionPrepend,
      section,
      sectionsDict,
      sectionPath
    } = useSectionField({sectionName: name, sections})

    const {isEditing} = useStatus()

    const {refresh} = React.useContext(HighlightProviderContext)

    const Wrapper = rest.as || Box

    let tooltipButtons = [
      <Button
        key="section-field-tooltip-button-add"
        variant="jaenHighlightTooltipText"
        size="xs">
        <Text as="span" noOfLines={1}>
          Section {name}
        </Text>
      </Button>
    ]

    const blocks: SelectorBlockType[] = sections.map(({options}) => ({
      slug: options.name,
      title: options.displayName,
      icon: FiBox
    }))

    const handleSectionAdd = (
      block: SelectorBlockType,
      type: SelectorBlockAddType,
      item?: IJaenSectionItem
    ) => {
      console.log('handleSectionAdd', block, type, item)

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

      refresh()
    }

    const handleSectionDelete = async (
      id: string,
      ptrPrev: string | null,
      ptrNext: string | null
    ) => {
      const shouldDelete = await confirm(
        `Are you sure you want to delete this section?`
      )

      if (shouldDelete) {
        onSectionDelete(id, ptrPrev, ptrNext)

        toast({
          title: 'Section deleted',
          description: `Section ${displayName} has been deleted`,
          status: 'info',
          variant: 'subtle'
        })
      }
    }

    if (sections.length > 0) {
      tooltipButtons = tooltipButtons.concat([
        <HStack spacing="0.5" key="section-field-tooltip-buttons">
          <SectionBlockSelectorButton
            onBlockAdd={handleSectionAdd}
            blocks={blocks}
            onlyAdd={section.items.length === 0}
          />
          {/* <IconButton
            size="xs"
            variant="jaenHighlightTooltip"
            icon={<DeleteIcon />}
            aria-label="Add"
          /> */}
        </HStack>
      ])
    }

    return (
      <HighlightTooltip isEditing={isEditing} actions={tooltipButtons}>
        <Wrapper
          {...rest.props}
          className={rest.className}
          style={rest.style}
          minH="64"
          w="full">
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
                isEditing={isEditing}
                actions={[
                  <Button
                    variant="jaenHighlightTooltipText"
                    key={`section-field-tooltip-button-${item.id}`}>
                    <Text as="span" noOfLines={1}>
                      Block {s.Component.options.name}
                    </Text>
                  </Button>,
                  <HStack
                    spacing="0.5"
                    key={`section-field-tooltip-buttons-${item.id}`}>
                    <SectionBlockSelectorButton
                      onBlockAdd={(block, type) => {
                        handleSectionAdd(block, type, item)
                      }}
                      blocks={blocks}
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
                  // <Box bg="pink.100" py={1} px={2}>
                  //   SectionItem {s.Component.options.name}
                  // </Box>,
                  // <Box bg="white">
                  //   <Box>
                  //     <Box>
                  //       <Text>Text</Text>
                  //     </Box>
                  //     <StackDivider />
                  //     <Box>
                  //       <Button w="full" variant="ghost">
                  //         Item Type
                  //       </Button>
                  //       <Button w="full" variant="ghost">
                  //         Item Type
                  //       </Button>
                  //     </Box>
                  //   </Box>

                  //   <ButtonGroup isAttached>
                  //     <Button
                  //       size="xs"
                  //       onClick={() => {
                  //         console.log(item.type, [item.ptrPrev, item.ptrNext])
                  //         onSectionPrepend(item.type, item.id, item.ptrPrev)
                  //       }}>
                  //       Prepend
                  //     </Button>
                  //     <Button
                  //       size="xs"
                  //       onClick={() => {
                  //         console.log(item.type, [item.ptrPrev, item.ptrNext])
                  //         onSectionAppend(item.type, item.id, item.ptrNext)
                  //       }}>
                  //       Append
                  //     </Button>
                  //   </ButtonGroup>
                  // </Box>
                ]}>
                <SectionWrapper {...sectionProps}>
                  <JaenSectionProvider
                    path={sectionPath}
                    id={item.id}
                    position={index}
                    Component={s.Component}
                  />
                </SectionWrapper>
              </HighlightTooltip>
            )
          })}
        </Wrapper>
      </HighlightTooltip>
    )
  }
)
