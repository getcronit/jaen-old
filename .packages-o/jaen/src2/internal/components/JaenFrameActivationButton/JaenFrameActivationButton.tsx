import {MenuButton} from '../shared/MenuButton/index.js'

export interface JaenFrameActivationButtonProps {}

export const JaenFrameActivationButton: React.FC<JaenFrameActivationButtonProps> =
  props => {
    return (
      <>
        <MenuButton pos="fixed" bottom="0" left="50%">
          Test
        </MenuButton>
      </>
    )
  }
