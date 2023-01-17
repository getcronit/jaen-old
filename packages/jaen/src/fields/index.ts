import Choice from './ChoiceField/index.js'
import Index from './IndexField/index.js'
import Section from './SectionField/index.js'
import Text from './TextField/index.js'

export const Field = {
  Text,
  Section,
  Index,
  Choice
}

export {useJaenPageIndex as useIndexField} from '../internal/context/PageProvider.js'
