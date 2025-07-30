import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Leaf, Activity, Sun, Moon, Droplets, Zap } from 'lucide-react-native';

const MetricCard = ({ icon: Icon, title, value, unit, color, trend }: any) => (
  <View style={[styles.metricCard, { borderLeftColor: color }]}>
    <View style={styles.metricHeader}>
      <Icon size={20} color={color} />
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
    <View style={styles.metricContent}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricUnit}>{unit}</Text>
    </View>
    <Text style={[styles.metricTrend, { color: trend > 0 ? '#22C55E' : '#EF4444' }]}>
      {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from yesterday
    </Text>
  </View>
);

const QuickAction = ({ icon: Icon, title, color, onPress }: any) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: `${color}20` }]}>
      <Icon size={24} color={color} />
    </View>
    <Text style={styles.quickActionTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function Dashboard() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#22C55E', '#16A34A']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Good morning, Alex!</Text>
          <Text style={styles.subtitle}>Ready to optimize your day?</Text>
        </View>
        <View style={styles.lifeScore}>
          <Text style={styles.lifeScoreLabel}>Life Score</Text>
          <Text style={styles.lifeScoreValue}>87</Text>
          <Text style={styles.lifeScoreMax}>/100</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Metrics</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              icon={Heart}
              title="Heart Rate"
              value="72"
              unit="bpm"
              color="#EF4444"
              trend={-2}
            />
            <MetricCard
              icon={Activity}
              title="Steps"
              value="8,430"
              unit="steps"
              color="#3B82F6"
              trend={12}
            />
            <MetricCard
              icon={Leaf}
              title="Carbon Saved"
              value="2.3"
              unit="kg CO₂"
              color="#22C55E"
              trend={8}
            />
            <MetricCard
              icon={Droplets}
              title="Hydration"
              value="6"
              unit="glasses"
              color="#06B6D4"
              trend={-1}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction
              icon={Sun}
              title="Log Mood"
              color="#F59E0B"
              onPress={() => {}}
            />
            <QuickAction
              icon={Activity}
              title="Start Workout"
              color="#EF4444"
              onPress={() => {}}
            />
            <QuickAction
              icon={Leaf}
              title="Eco Challenge"
              color="#22C55E"
              onPress={() => {}}
            />
            <QuickAction
              icon={Moon}
              title="Sleep Mode"
              color="#6366F1"
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Insights</Text>
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Zap size={20} color="#F59E0B" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Perfect time for a walk!</Text>
              <Text style={styles.insightDescription}>
                Air quality is excellent and you're 1,570 steps away from your daily goal.
              </Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Leaf size={20} color="#22C55E" />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Great eco choices today!</Text>
              <Text style={styles.insightDescription}>
                Your sustainable transport choices saved 2.3kg CO₂. Keep it up!
              </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  lifeScore: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
  },
  lifeScoreLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 4,
  },
  lifeScoreValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  lifeScoreMax: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
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
  metricsGrid: {
    gap: 16,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 8,
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
  },
  metricUnit: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  metricTrend: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
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
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  insightCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});