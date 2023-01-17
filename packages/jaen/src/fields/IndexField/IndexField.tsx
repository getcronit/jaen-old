import {Button, Text} from '@chakra-ui/react'
import {HighlightTooltip} from '../../internal/components/index.js'
import {useJaenPageIndex} from '../../internal/context/PageProvider.js'
import {withRedux} from '../../internal/redux/index.js'
import {IJaenPage} from '../../types.js'

export interface IndexFieldProps {
  /**
   * Opts out the field from the page content on which it is applied.
   * Instead the page context of the provided jaenPageId will be used.
   *
   * Priority: jaenPageId > path > current page
   */
  jaenPageId?: string
  /**
   * Opts out the field from the page content on which it is applied.
   * Instead it resolves the page by the provided path.
   *
   * This is useful when you want to use a dynamic page as a context.
   *
   * Priority: jaenPageId > path > current page
   */
  path?: string
  /**
   * Provides page and wrapps the return jsx in a JaenPageProvider, thus allowing
   * to use fields.
   *
   * Filtering is done by the `filter` prop.
   */
  renderPage: (page: Partial<IJaenPage>) => JSX.Element
  filter?: (page: Partial<IJaenPage>) => boolean
  sort?: (a: Partial<IJaenPage>, b: Partial<IJaenPage>) => number
}

export const IndexField: React.FC<IndexFieldProps> = withRedux(
  ({renderPage, ...rest}: IndexFieldProps) => {
    const {children, withJaenPage} = useJaenPageIndex(rest)
    return (
      <HighlightTooltip
        actions={[
          <Button
            variant="jaenHighlightTooltipText"
            key="jaen-highlight-tooltip-text-index">
            <Text as="span" noOfLines={1}>
              Index
            </Text>
          </Button>
        ]}>
        {children.map(page => withJaenPage(page.id, renderPage(page)))}
      </HighlightTooltip>
    )
  }
)

export default IndexField
