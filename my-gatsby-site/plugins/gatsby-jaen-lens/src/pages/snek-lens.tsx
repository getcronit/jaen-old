import {PageConfig} from '@snek-at/jaen'
import {graphql} from 'gatsby'

const Page: React.FC = () => {
  return <div>Snek Access</div>
}

export default Page

export const pageConfig: PageConfig = {
  label: 'Snek Lens',
  icon: 'FaBullseye',
  menu: {
    type: 'app',
    order: 500
  },
  layout: {
    name: 'jaen'
  }
}

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
    allJaenPage {
      nodes {
        ...JaenPageData
        children {
          ...JaenPageData
        }
      }
    }
  }
`
