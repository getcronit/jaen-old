import {Box, Button, HStack, Stack, Text} from '@chakra-ui/react'
import * as React from 'react'
import {FaArrowDown, FaArrowUp, FaTrash} from 'react-icons/fa'
import {FiBox} from 'react-icons/fi'

import {IBlockConnection} from '../../connectors/index.js'
import {
  HighlightTooltip,
  SectionBlockSelectorButton,
  SelectorBlockAddType,
  SelectorBlockType,
  TuneSelectorButton
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
      onSectionMove,
      onSectionAppend,
      onSectionPrepend,
      section,
      sectionsDict,
      sectionPath
    } = useSectionField(name, blocks)

    const {isEditing} = useStatus()

    const Wrapper = rest.as || Stack

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

    console.log('section', section)

    return (
      <HighlightTooltip
        id={name}
        isEditing={isEditing}
        actions={tooltipButtons}
        as={Wrapper}
        minH="64"
        p="4"
        className={rest.className}
        style={rest.style}
        {...rest.props}>
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
              id={`${name}-${index}`}
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
                <SectionBlockSelectorButton
                  key={`section-field-tooltip-block-selector-${item.id}`}
                  onBlockAdd={(block, type) => {
                    handleSectionAdd(block, type, item)
                  }}
                  blocks={blocksForSelector}
                  onlyAdd={false}
                />,
                <TuneSelectorButton
                  aria-label="Section tune selector"
                  key={`section-field-tooltip-tune-selector-${item.id}`}
                  activeTunes={
                    item.id === section.ptrHead
                      ? [{name: 'move-up'}]
                      : item.id === section.ptrTail
                      ? [{name: 'move-down'}]
                      : []
                  }
                  tunes={[
                    {
                      type: 'tune',
                      name: 'move-up',
                      label: 'Move up',
                      Icon: FaArrowUp,
                      onTune: () => {
                        const prevItem =
                          section.items.find(el => el.id === item.ptrPrev)
                            ?.ptrPrev || null

                        onSectionMove(
                          item.id,
                          item.ptrPrev,
                          item.ptrNext,
                          prevItem,
                          'up'
                        )
                      },
                      isHiddenOnActive: true
                    },
                    {
                      type: 'tune',
                      name: 'move-down',
                      label: 'Move down',
                      Icon: FaArrowDown,
                      onTune: () => {
                        const nextItem =
                          section.items.find(el => el.id === item.ptrNext)
                            ?.ptrNext || null

                        onSectionMove(
                          item.id,
                          item.ptrPrev,
                          item.ptrNext,
                          nextItem,
                          'down'
                        )
                      },
                      isHiddenOnActive: true
                    },
                    {
                      type: 'tune',
                      name: 'delete',
                      label: 'Delete',
                      Icon: FaTrash,
                      onTune: () => {
                        void handleSectionDelete(
                          item.id,
                          item.ptrPrev,
                          item.ptrNext
                        )
                      }
                    }
                  ]}
                />
              ]}
              p="2"
              {...sectionProps}>
              <JaenSectionBlockProvider
                path={sectionPath}
                id={item.id}
                position={index}
                Component={s.Component}
              />
            </HighlightTooltip>
          )
        })}
      </HighlightTooltip>
    )
  }
)
