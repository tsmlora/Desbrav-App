import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Achievement } from '@/types/achievements';
import { getRarityColor, getRarityGradient } from '@/constants/achievements';
import { useAchievementStore } from '@/store/achievementStore';
import Colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Trophy, Target } from 'lucide-react-native';

interface AchievementCardProps {
  achievement: Achievement;
  showProgress?: boolean;
}

export default function AchievementCard({ achievement, showProgress = true }: AchievementCardProps) {
  const { getProgressForAchievement } = useAchievementStore();
  const progress = getProgressForAchievement(achievement.id);
  const rarityColors = getRarityGradient(achievement.rarity);

  return (
    <TouchableOpacity style={styles.container}>
      <LinearGradient
        colors={achievement.unlocked ? rarityColors as [string, string, ...string[]] : ['#333', '#222']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {achievement.unlocked ? (
              <View style={styles.achievementIcon}>
                <Image 
                  source={{ uri: achievement.badge_url }} 
                  style={styles.badgeImage}
                />
                <View style={styles.trophyOverlay}>
                  <Trophy size={16} color="#FFD700" />
                </View>
              </View>
            ) : (
              <View style={[styles.achievementIcon, styles.lockedIcon]}>
                <Lock size={24} color={Colors.textSecondary} />
              </View>
            )}
          </View>

          <View style={styles.textContent}>
            <View style={styles.header}>
              <Text style={[styles.name, !achievement.unlocked && styles.lockedText]}>
                {achievement.name}
              </Text>
              <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(achievement.rarity) }]}>
                <Text style={styles.rarityText}>{achievement.rarity.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={[styles.description, !achievement.unlocked && styles.lockedText]}>
              {achievement.description}
            </Text>

            <View style={styles.footer}>
              <View style={styles.pointsContainer}>
                <Target size={14} color={achievement.unlocked ? Colors.primary : Colors.textSecondary} />
                <Text style={[styles.points, !achievement.unlocked && styles.lockedText]}>
                  {achievement.points} pts
                </Text>
              </View>

              {achievement.dateEarned && (
                <Text style={styles.dateEarned}>
                  Conquistada em {achievement.dateEarned}
                </Text>
              )}
            </View>

            {showProgress && !achievement.unlocked && progress.max > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${progress.percentage}%`, backgroundColor: getRarityColor(achievement.rarity) }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {progress.current} / {progress.max}
                </Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 16,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lockedIcon: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  badgeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  trophyOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 2,
  },
  textContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  points: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  dateEarned: {
    fontSize: 12,
    color: Colors.primary,
    fontStyle: 'italic',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  lockedText: {
    color: Colors.textSecondary,
    opacity: 0.7,
  },
});