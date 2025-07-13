import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  showIcon?: boolean;
}

export default function Logo({ size = 'medium', color, showIcon = false }: LogoProps) {
  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 18;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 36;
      default:
        return 28;
    }
  };

  return (
    <View style={styles.container}>
      {showIcon && (
        <View style={[styles.iconContainer, { width: getIconSize(), height: getIconSize() }]}>
          <View style={[styles.icon, { backgroundColor: color || Colors.primary }]} />
        </View>
      )}
      <Text style={[styles.logo, { 
        fontSize: getFontSize(),
        color: color || Colors.primary,
        marginLeft: showIcon ? 8 : 0
      }]}>
        DESBRAV
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '70%',
    height: '70%',
    borderRadius: 4,
  },
  logo: {
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
});