import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, Plus, Calendar, TrendingUp, Heart, Leaf, Activity, Clock } from 'lucide-react-native';

const GoalCard = ({ title, description, progress, target, unit, deadline, category, onEdit }: any) => (
  <TouchableOpacity style={styles.goalCard} onPress={onEdit}>
    <View style={styles.goalHeader}>
      <View style={styles.goalInfo}>
        <Text style={styles.goalTitle}>{title}</Text>
        <Text style={styles.goalDescription}>{description}</Text>
      </View>
      <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(category) }]}>
        {getCategoryIcon(category, 20, '#ffffff')}
      </View>
    </View>

    <View style={styles.progressSection}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          {progress} / {target} {unit}
        </Text>
        <Text style={styles.progressPercentage}>
          {Math.round((progress / target) * 100)}%
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${Math.min((progress / target) * 100, 100)}%`,
              backgroundColor: getCategoryColor(category)
            }
          ]} 
        />
      </View>
    </View>

    <View style={styles.goalFooter}>
      <View style={styles.deadline}>
        <Calendar size={14} color="#6b7280" />
        <Text style={styles.deadlineText}>{deadline}</Text>
      </View>
      <View style={styles.trend}>
        <TrendingUp size={14} color="#22C55E" />
        <Text style={styles.trendText}>On track</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const MilestoneItem = ({ title, completed, date }: any) => (
  <View style={styles.milestoneItem}>
    <View style={[styles.milestoneIcon, completed && styles.completedMilestone]}>
      {completed && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <View style={styles.milestoneContent}>
      <Text style={[styles.milestoneTitle, completed && styles.completedText]}>
        {title}
      </Text>
      <Text style={styles.milestoneDate}>{date}</Text>
    </View>
  </View>
);

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Health': '#EF4444',
    'Environment': '#22C55E',
    'Fitness': '#3B82F6',
    'Wellness': '#8B5CF6',
  };
  return colors[category] || '#6B7280';
};

const getCategoryIcon = (category: string, size: number, color: string) => {
  const icons: { [key: string]: any } = {
    'Health': <Heart size={size} color={color} />,
    'Environment': <Leaf size={size} color={color} />,
    'Fitness': <Activity size={size} color={color} />,
    'Wellness': <Clock size={size} color={color} />,
  };
  return icons[category] || <Target size={size} color={color} />;
};

export default function Goals() {
  const [activeTab, setActiveTab] = useState('active');
  const [showAddGoal, setShowAddGoal] = useState(false);

  const goals = [
    {
      title: 'Daily Steps Challenge',
      description: 'Walk 10,000 steps every day this month',
      progress: 8500,
      target: 10000,
      unit: 'steps',
      deadline: 'Today',
      category: 'Fitness',
    },
    {
      title: 'Carbon Reduction',
      description: 'Reduce carbon footprint by 30% this quarter',
      progress: 18,
      target: 30,
      unit: '% reduction',
      deadline: 'Mar 31, 2025',
      category: 'Environment',
    },
    {
      title: 'Sleep Optimization',
      description: 'Get 8 hours of quality sleep for 30 days',
      progress: 22,
      target: 30,
      unit: 'days',
      deadline: 'Feb 28, 2025',
      category: 'Wellness',
    },
    {
      title: 'Heart Rate Variability',
      description: 'Improve HRV score to above 50',
      progress: 42,
      target: 50,
      unit: 'HRV score',
      deadline: 'Feb 15, 2025',
      category: 'Health',
    },
  ];

  const milestones = [
    { title: 'Completed first week of step challenge', completed: true, date: 'Jan 7, 2025' },
    { title: 'Achieved 3 consecutive eco-friendly commutes', completed: true, date: 'Jan 12, 2025' },
    { title: 'Reached 10-day sleep streak', completed: false, date: 'Expected: Jan 20, 2025' },
    { title: 'Hit monthly fitness target early', completed: false, date: 'Expected: Jan 25, 2025' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#EF4444', '#DC2626']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.targetIcon}>
            <Target size={24} color="#ffffff" />
          </View>
          <Text style={styles.headerTitle}>Goals</Text>
          <Text style={styles.headerSubtitle}>Track your progress and achieve more</Text>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Active Goals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>73%</Text>
          <Text style={styles.statLabel}>Avg Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Goals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'milestones' && styles.activeTab]}
          onPress={() => setActiveTab('milestones')}
        >
          <Text style={[styles.tabText, activeTab === 'milestones' && styles.activeTabText]}>
            Milestones
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'active' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Goals</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddGoal(true)}
              >
                <Plus size={16} color="#ffffff" />
                <Text style={styles.addButtonText}>Add Goal</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.goalsContainer}>
              {goals.map((goal, index) => (
                <GoalCard
                  key={index}
                  {...goal}
                  onEdit={() => console.log('Edit goal:', goal.title)}
                />
              ))}
            </View>
          </View>
        )}

        {activeTab === 'milestones' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Milestones</Text>
            <View style={styles.milestonesContainer}>
              {milestones.map((milestone, index) => (
                <MilestoneItem key={index} {...milestone} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>🎯 Keep Going!</Text>
          <Text style={styles.motivationText}>
            You're making great progress! Your consistency in pursuing your goals is paying off. 
            Remember, small daily improvements lead to stunning long-term results.
          </Text>
        </View>
      </View>

      {showAddGoal && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="Goal title"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddGoal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setShowAddGoal(false)}
              >
                <Text style={styles.saveButtonText}>Save Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  targetIcon: {
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -15,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
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
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#EF4444',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
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
    backgroundColor: '#EF4444',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalInfo: {
    flex: 1,
    marginRight: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  progressPercentage: {
    fontSize: 16,
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
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deadlineText: {
    fontSize: 12,
    color: '#6b7280',
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#22C55E',
  },
  milestonesContainer: {
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
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  milestoneIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  completedMilestone: {
    backgroundColor: '#22C55E',
  },
  checkmark: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  completedText: {
    color: '#6b7280',
  },
  milestoneDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  motivationCard: {
    backgroundColor: '#ffffff',
    padding: 24,
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
  motivationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  motivationText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    textAlign: 'center',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});