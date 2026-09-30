import { Text } from '@react-three/drei'
import { EntryPicture } from './EntryPicture'
import { HOME } from '../three/homePalette'

export function EntryLogo({ position = [0, 0, -6] }) {
  return (
    <group position={position}>
      <Text
        position={[0, 3.05, 0]}
        fontSize={1.1}
        font={undefined}
        letterSpacing={0.02}
        color={HOME.cream}
        outlineWidth={0.045}
        outlineColor={HOME.ink}
        anchorX="center"
        anchorY="middle"
      >
        YANG'S WORLD
      </Text>
      <EntryPicture position={[0, 0, 0.6]} />
      <Text
        position={[0, 0.3, 0.9]}
        fontSize={0.22}
        color={HOME.cream}
        anchorX="center"
        anchorY="middle"
      >
        {'‹ frontend & pencils /›'}
      </Text>
    </group>
  )
}
