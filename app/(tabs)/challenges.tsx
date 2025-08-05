import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Trophy, Leaf, Activity, Heart, Zap, Calendar, Star } from 'lucide-react-native';

const ChallengeCard = ({ title, description, participants, timeLeft, progress, reward, difficulty, onJoin }: any) => (
  <View style={styles.challengeCard}>
    <View style={styles.challengeHeader}>
      <View style={styles.challengeInfo}>
        <Text style={styles.challengeTitle}>{title}</Text>
        <Text style={styles.challengeDescription}>{description}</Text>
      </View>
      <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) }]}>
        <Text style={styles.difficultyText}>{difficulty}</Text>
      </View>
    </View>
    
    <View style={styles.challengeStats}>
      <View style={styles.stat}>
        <Users size={16} color="#6b7280" />
        <Text style={styles.statText}>{participants} joined</Text>
      </View>
      <View style={styles.stat}>
        <Calendar size={16} color="#6b7280" />
        <Text style={styles.statText}>{timeLeft}</Text>
      </View>
    </View>

    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Progress</Text>
        <Text style={styles.progressValue}>{progress}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>

    <View style={styles.challengeFooter}>
      <View style={styles.reward}>
        <Trophy size={16} color="#F59E0B" />
        <Text style={styles.rewardText}>{reward} points</Text>
      </View>
      <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
        <Text style={styles.joinButtonText}>Join Challenge</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const LeaderboardItem = ({ rank, name, points, avatar, isCurrentUser }: any) => (
  <View style={[styles.leaderboardItem, isCurrentUser && styles.currentUserItem]}>
    <View style={styles.rankContainer}>
      <Text style={[styles.rank, isCurrentUser && styles.currentUserText]}>#{rank}</Text>
    </View>
    <View style={[styles.avatar, { backgroundColor: avatar }]}>
      <Text style={styles.avatarText}>{name.charAt(0)}</Text>
    </View>
    <Text style={[styles.playerName, isCurrentUser && styles.currentUserText]}>{name}</Text>
    <View style={styles.pointsContainer}>
      <Star size={16} color="#F59E0B" />
      <Text style={[styles.points, isCurrentUser && styles.currentUserText]}>{points}</Text>
    </View>
  </View>
);

const AchievementBadge = ({ icon: Icon, title, description, unlocked }: any) => (
  <View style={[styles.achievementBadge, !unlocked && styles.lockedBadge]}>
    <View style={[styles.achievementIcon, !unlocked && styles.lockedIcon]}>
      <Icon size={20} color={unlocked ? "#F59E0B" : "#9CA3AF"} />
    </View>
    <Text style={[styles.achievementTitle, !unlocked && styles.lockedText]}>{title}</Text>
    <Text style={[styles.achievementDescription, !unlocked && styles.lockedText]}>{description}</Text>
  </View>
);

const getDifficultyColor = (difficulty: string) => {
  const colors: { [key: string]: string } = {
    'Easy': '#22C55E',
    'Medium': '#F59E0B',
    'Hard': '#EF4444',
  };
  return colors[difficulty] || '#6B7280';
};

export default function Challenges() {
  const [activeTab, setActiveTab] = useState('challenges');

  const challenges = [
    {
      title: '7-Day Green Commute',
      description: 'Use sustainable transport for a full week',
      participants: 1247,
      timeLeft: '5 days left',
      progress: 60,
      reward: 500,
      difficulty: 'Medium',
    },
    {
      title: 'Hydration Hero',
      description: 'Drink 8 glasses of water daily for 30 days',
      participants: 892,
      timeLeft: '12 days left',
      progress: 85,
      reward: 300,
      difficulty: 'Easy',
    },
    {
      title: 'Carbon Crusher',
      description: 'Reduce your carbon footprint by 50% this month',
      participants: 543,
      timeLeft: '18 days left',
      progress: 35,
      reward: 1000,
      difficulty: 'Hard',
    },
  ];

  const leaderboard = [
    { rank: 1, name: 'Emma Green', points: 2450, avatar: '#22C55E', isCurrentUser: false },
    { rank: 2, name: 'Alex Chen', points: 2380, avatar: '#3B82F6', isCurrentUser: true },
    { rank: 3, name: 'Sam Wilson', points: 2210, avatar: '#EF4444', isCurrentUser: false },
    { rank: 4, name: 'Maya Patel', points: 2180, avatar: '#8B5CF6', isCurrentUser: false },
    { rank: 5, name: 'Jordan Lee', points: 2050, avatar: '#F59E0B', isCurrentUser: false },
  ];

  const achievements = [
    { icon: Leaf, title: 'Eco Warrior', description: 'Complete 10 environmental challenges', unlocked: true },
    { icon: Activity, title: 'Fitness Fanatic', description: 'Maintain workout streak for 30 days', unlocked: true },
    { icon: Heart, title: 'Wellness Champion', description: 'Perfect health score for a week', unlocked: false },
    { icon: Zap, title: 'Energy Optimizer', description: 'Improve life score by 25 points', unlocked: false },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#8B5CF6', '#A855F7']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.communityIcon}>
            <Users size={24} color="#ffffff" />
          </View>
          <Text style={styles.headerTitle}>Community</Text>
          <Text style={styles.headerSubtitle}>Challenge yourself with others</Text>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'challenges' && styles.activeTab]}
          onPress={() => setActiveTab('challenges')}
        >
          <Text style={[styles.tabText, activeTab === 'challenges' && styles.activeTabText]}>
            Challenges
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'challenges' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            <View style={styles.challengesContainer}>
              {challenges.map((challenge, index) => (
                <ChallengeCard
                  key={index}
                  {...challenge}
                  onJoin={() => {
                    Alert.alert(
                      'Join Challenge',
                      `Are you ready to join "${challenge.title}"?`,
                      [
                        { 
                          text: 'Join Now', 
                          onPress: () => Alert.alert('Welcome!', `You've successfully joined ${challenge.title}! Good luck!`) 
                        },
                        { text: 'Maybe later', style: 'cancel' }
                      ]
                    );
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {activeTab === 'leaderboard' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Week's Leaders</Text>
            <View style={styles.leaderboardContainer}>
              {leaderboard.map((player, index) => (
                <LeaderboardItem key={index} {...player} />
              ))}
            </View>
          </View>
        )}

        {activeTab === 'achievements' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Achievements</Text>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement, index) => (
                <AchievementBadge key={index} {...achievement} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Community Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Challenges Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2,380</Text>
              <Text style={styles.statLabel}>Total Points</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>147</Text>
              <Text style={styles.statLabel}>Friends Helped</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  communityIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  challengesContainer: {
    gap: 16,
  },
  challengeCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  challengeInfo: {
    flex: 1,
    marginRight: 12,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  challengeStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#22C55E',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  joinButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  leaderboardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  currentUserItem: {
    backgroundColor: '#f0f9ff',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rank: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6b7280',
  },
  currentUserText: {
    color: '#3B82F6',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  points: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F59E0B',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  achievementBadge: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  lockedBadge: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  lockedIcon: {
    backgroundColor: '#f3f4f6',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});