import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAchievementStore } from '@/store/achievementStore';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';

export default function LevelProgress() {
  const { level, totalPoints } = useAchievementStore();
  
  const currentLevelPoints = (level - 1) * 1000;
  const nextLevelPoints = level * 1000;
  const progressInLevel = totalPoints - currentLevelPoints;
  const progressPercentage = (progressInLevel / 1000) * 100;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, Colors.accent]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.levelInfo}>
            <View style={styles.levelBadge}>
              <Star size={20} color={Colors.text} />
              <Text style={styles.levelText}>Nível {level}</Text>
            </View>
            <Text style={styles.pointsText}>{totalPoints.toLocaleString()} pts</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${progressPercentage}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>
              {progressInLevel} / 1000 para o próximo nível
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
  },
  content: {
    alignItems: 'center',
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.text,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
    opacity: 0.9,
  },
});