import Index from './IndexField/index.js'
import Section from './SectionField/index.js'
import Text from './TextField/index.js'

export const Field = {
  Text,
  Section,
  Index
}

export {useJaenPageIndex as useIndexField} from '../internal/context/PageProvider.js'
