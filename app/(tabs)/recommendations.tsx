import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Zap, Leaf, Heart, Sun, Moon, Activity, Clock } from 'lucide-react-native';

const RecommendationCard = ({ icon: Icon, category, title, description, impact, difficulty, onAction }: any) => (
  <View style={styles.recommendationCard}>
    <View style={styles.cardHeader}>
      <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(category) }]}>
        <Icon size={20} color="#ffffff" />
      </View>
      <View style={styles.cardHeaderText}>
        <Text style={styles.categoryLabel}>{category}</Text>
        <View style={styles.badges}>
          <View style={[styles.badge, styles.impactBadge]}>
            <Text style={styles.badgeText}>Impact: {impact}</Text>
          </View>
          <View style={[styles.badge, styles.difficultyBadge]}>
            <Text style={styles.badgeText}>Effort: {difficulty}</Text>
          </View>
        </View>
      </View>
    </View>
    <Text style={styles.recommendationTitle}>{title}</Text>
    <Text style={styles.recommendationDescription}>{description}</Text>
    <TouchableOpacity style={styles.actionButton} onPress={onAction}>
      <Text style={styles.actionButtonText}>Try This</Text>
    </TouchableOpacity>
  </View>
);

const ScenarioCard = ({ title, description, metrics, isSelected, onSelect }: any) => (
  <TouchableOpacity 
    style={[styles.scenarioCard, isSelected && styles.scenarioCardSelected]} 
    onPress={onSelect}
  >
    <Text style={styles.scenarioTitle}>{title}</Text>
    <Text style={styles.scenarioDescription}>{description}</Text>
    <View style={styles.scenarioMetrics}>
      {metrics.map((metric: any, index: number) => (
        <View key={index} style={styles.scenarioMetric}>
          <Text style={styles.scenarioMetricValue}>{metric.value}</Text>
          <Text style={styles.scenarioMetricLabel}>{metric.label}</Text>
        </View>
      ))}
    </View>
  </TouchableOpacity>
);

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Health': '#EF4444',
    'Environment': '#22C55E',
    'Wellness': '#3B82F6',
    'Energy': '#F59E0B',
    'Sleep': '#6366F1',
    'Activity': '#8B5CF6',
  };
  return colors[category] || '#6B7280';
};

export default function Recommendations() {
  const [selectedScenario, setSelectedScenario] = useState(0);

  const recommendations = [
    {
      icon: Sun,
      category: 'Energy',
      title: 'Optimize Your Morning Light',
      description: 'Get 15 minutes of natural sunlight within 1 hour of waking to boost energy and regulate circadian rhythm.',
      impact: 'High',
      difficulty: 'Easy',
    },
    {
      icon: Leaf,
      category: 'Environment',
      title: 'Bike to Work Today',
      description: 'Replace your car commute with cycling. Perfect weather conditions and you\'ll save 4.2kg CO₂.',
      impact: 'High',
      difficulty: 'Medium',
    },
    {
      icon: Heart,
      category: 'Health',
      title: 'Take Walking Breaks',
      description: 'Your heart rate variability suggests stress. Take 5-minute walks every hour to improve circulation.',
      impact: 'Medium',
      difficulty: 'Easy',
    },
    {
      icon: Moon,
      category: 'Sleep',
      title: 'Wind Down Earlier',
      description: 'Start your bedtime routine 30 minutes earlier tonight. Your sleep quality score could improve by 15%.',
      impact: 'High',
      difficulty: 'Medium',
    },
  ];

  const scenarios = [
    {
      title: 'Active Day',
      description: 'Extra workout + bike commute',
      metrics: [
        { value: '+15%', label: 'Energy' },
        { value: '-2.8kg', label: 'CO₂' },
        { value: '+12%', label: 'Mood' },
      ],
    },
    {
      title: 'Eco Focus',
      description: 'Sustainable choices priority',
      metrics: [
        { value: '-4.2kg', label: 'CO₂' },
        { value: '+8%', label: 'Life Score' },
        { value: '+5%', label: 'Community' },
      ],
    },
    {
      title: 'Recovery Mode',
      description: 'Prioritize rest and wellness',
      metrics: [
        { value: '+25%', label: 'Recovery' },
        { value: '+18%', label: 'Sleep' },
        { value: '-10%', label: 'Stress' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.aiIcon}>
            <Brain size={24} color="#ffffff" />
          </View>
          <Text style={styles.headerTitle}>AI Recommendations</Text>
          <Text style={styles.headerSubtitle}>Personalized insights powered by your digital twin</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What-If Scenarios</Text>
          <Text style={styles.sectionDescription}>
            Explore how different choices could impact your day
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scenariosContainer}>
            {scenarios.map((scenario, index) => (
              <ScenarioCard
                key={index}
                {...scenario}
                isSelected={selectedScenario === index}
                onSelect={() => setSelectedScenario(index)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Recommendations</Text>
          <Text style={styles.sectionDescription}>
            AI-curated actions to optimize your health and environmental impact
          </Text>
          <View style={styles.recommendationsContainer}>
            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={index}
                {...rec}
                onAction={() => {
                  Alert.alert(
                    'Recommendation Started',
                    `Great choice! You've started: ${rec.title}`,
                    [
                      { 
                        text: 'Mark as Done', 
                        onPress: () => Alert.alert('Completed!', 'Recommendation marked as completed. +25 points earned!') 
                      },
                      { text: 'Remind me later', style: 'cancel' }
                    ]
                  );
                }}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.aiInsight}>
            <View style={styles.aiInsightHeader}>
              <Zap size={20} color="#F59E0B" />
              <Text style={styles.aiInsightTitle}>AI Insight</Text>
            </View>
            <Text style={styles.aiInsightText}>
              Based on your sleep pattern and stress levels, implementing the morning sunlight and walking breaks recommendations could improve your overall wellbeing score by up to 20% this week.
            </Text>
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
  aiIcon: {
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
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  scenariosContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  scenarioCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginRight: 16,
    width: 200,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  scenarioCardSelected: {
    borderColor: '#6366F1',
  },
  scenarioTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  scenarioMetrics: {
    gap: 8,
  },
  scenarioMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scenarioMetricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22C55E',
  },
  scenarioMetricLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  recommendationsContainer: {
    gap: 16,
  },
  recommendationCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  impactBadge: {},
  difficultyBadge: {},
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  aiInsight: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginLeft: 8,
  },
  aiInsightText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});