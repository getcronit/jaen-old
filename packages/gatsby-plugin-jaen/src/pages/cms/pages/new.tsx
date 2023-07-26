import {PageProps} from 'gatsby'

import {New} from '../../../components/cms/Pages/New'
import {JaenPageLayout} from '../../../components/JaenPageLayout/JaenPageLayout'
import {withTheme} from '../../../theme/with-theme'
import {
  CMSManagement,
  useCMSManagement
} from '../../../connectors/cms-management'

const PagesNew: React.FC = withTheme(() => {
  const manager = useCMSManagement()

  return (
    <JaenPageLayout layout="form">
      <New
        form={{
          parentPages: {
            'JaenPage /': {
              label: 'HomePage'
            }
          },
          templates: {
            Example: {
              label: 'Example'
            }
          },
          onSubmit: data => {
            manager.addPage({
              slug: data.slug,
              template: data.template,
              parent: {
                id: data.parent
              },
              excludedFromIndex: data.isExcludedFromIndex,
              jaenPageMetadata: {
                title: data.title,
                image: data.image?.useImage ? data.image.src : undefined,

                isBlogPost: data.blogPost?.isBlogPost,
                datePublished: data.blogPost?.date
              }
            })
          }
        }}
      />
    </JaenPageLayout>
  )
})

const Page: React.FC<PageProps> = () => {
  return (
    <CMSManagement>
      <PagesNew />
    </CMSManagement>
  )
}

export default Page
