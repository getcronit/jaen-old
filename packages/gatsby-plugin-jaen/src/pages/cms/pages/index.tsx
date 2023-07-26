import {PageProps} from 'gatsby'

import {Pages} from '../../../components/cms/Pages/Pages'
import {JaenPageLayout} from '../../../components/JaenPageLayout/JaenPageLayout'
import {withTheme} from '../../../theme/with-theme'
import {
  CMSManagement,
  useCMSManagement
} from '../../../connectors/cms-management'
import {useMemo} from 'react'

const PagesPage: React.FC = withTheme(() => {
  const manager = useCMSManagement()

  const currentPage = manager.page()

  const children = useMemo(() => {
    const pages = manager.pages(currentPage.id)

    console.log('Child pages', pages, currentPage.id)

    return pages.map(p => {
      return {
        title: p.jaenPageMetadata.title || 'No title',
        description: p.jaenPageMetadata.description || 'No description',
        publishedDate: p.jaenPageMetadata.datePublished || '',
        author: 'Nico Schett'
      }
    })
  }, [currentPage.id])

  return (
    <JaenPageLayout>
      <Pages page={currentPage} children={children} />
    </JaenPageLayout>
  )
})

const Page: React.FC<PageProps> = () => {
  return (
    <CMSManagement>
      <PagesPage />
    </CMSManagement>
  )
}

export default Page
