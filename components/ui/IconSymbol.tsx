import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolScale } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

// Add your SFSymbol to TypeScript's type definitions.
type SFSymbol =
  | 'house'
  | 'paperplane'
  | 'chevron.left.forwardslash.chevron.right'
  | 'chevron.right'
  | 'person.crop.circle.fill';

export type IconSymbolName = SFSymbol | keyof typeof MaterialIcons.glyphMap;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
  scale = 'default',
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
  scale?: SymbolScale;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={name as keyof typeof MaterialIcons.glyphMap}
      style={style}
    />
  );
}