import Choice from './ChoiceField/index.js'
import Image from './ImageField/index.js'
import Index from './IndexField/index.js'
import Mdx from './MdxField/index.js'
import RichText from './RichTextField/index.js'
import Section from './SectionField/index.js'
import Text from './TextField/index.js'

export const Field = {
  Text,
  RichText,
  Section,
  Index,
  Choice,
  Image,
  Mdx
}

export {useJaenPageIndex as useIndexField} from '../internal/context/PageProvider.js'
export {useField} from '../internal/hooks/field/useField.js'
export {
  useSectionField,
  UseSectionField
} from '../internal/hooks/field/useSectionField.js'
