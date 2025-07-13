import React from 'react';
import { StyleSheet, View } from 'react-native';
import Colors from '@/constants/colors';

export default function AnimatedBackground() {
  return (
    <View style={styles.container}>
      <View style={[styles.staticElement, styles.element1]} />
      <View style={[styles.staticElement, styles.element2]} />
      <View style={[styles.staticElement, styles.element3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  staticElement: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  element1: {
    top: '10%',
    left: '20%',
    backgroundColor: Colors.primary,
    opacity: 0.03,
  },
  element2: {
    top: '60%',
    right: '15%',
    backgroundColor: Colors.accent,
    opacity: 0.02,
  },
  element3: {
    bottom: '20%',
    left: '10%',
    backgroundColor: Colors.primary,
    opacity: 0.04,
  },
});