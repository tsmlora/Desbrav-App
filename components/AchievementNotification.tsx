import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { AchievementNotification as NotificationType } from '@/types/achievements';
import { useAchievementStore } from '@/store/achievementStore';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, X } from 'lucide-react-native';

interface AchievementNotificationProps {
  notification: NotificationType;
  onDismiss: () => void;
}

export default function AchievementNotification({ notification, onDismiss }: AchievementNotificationProps) {
  const slideAnim = new Animated.Value(-100);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        }
      ]}
    >
      <LinearGradient
        colors={['#FFD700', '#FFA000']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Trophy size={24} color={Colors.background} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.message}>{notification.message}</Text>
          </View>
          
          <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
            <X size={20} color={Colors.background} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.background,
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: Colors.background,
    opacity: 0.9,
  },
  closeButton: {
    padding: 4,
  },
});