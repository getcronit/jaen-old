import {PageConfig} from '@snek-at/jaen'
import {graphql, PageProps} from 'gatsby'

import {JaenPageLayout} from '../../components/JaenPageLayout/JaenPageLayout'
import MediaContainer from '../../containers/media'

const MediaPage: React.FC<PageProps> = () => {
  return <MediaContainer />
}

export default MediaPage

export const pageConfig: PageConfig = {
  label: 'Media',
  icon: 'FaImage',
  menu: {
    type: 'app',
    group: 'cms',
    order: 300
  },
  breadcrumbs: [
    {
      label: 'CMS',
      path: '/cms/'
    },
    {
      label: 'Media',
      path: '/cms/media/'
    }
  ],
  withoutJaenFrameStickyHeader: true,
  auth: {
    isRequired: true
  },
  layout: {
    name: 'jaen',
    type: 'full'
  }
}

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
  }
`

export {Head} from '@snek-at/jaen'
