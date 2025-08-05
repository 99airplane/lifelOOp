import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard as Edit, Star, Award, Activity, Leaf } from 'lucide-react-native';

const ProfileStat = ({ icon: Icon, label, value, color }: any) => (
  <View style={styles.statItem}>
    <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
      <Icon size={20} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const SettingItem = ({ icon: Icon, title, subtitle, hasSwitch, switchValue, onSwitchChange, onPress }: any) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={hasSwitch}>
    <View style={styles.settingLeft}>
      <View style={styles.settingIcon}>
        <Icon size={20} color="#6b7280" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.settingRight}>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#f3f4f6', true: '#22C55E' }}
          thumbColor={switchValue ? '#ffffff' : '#ffffff'}
        />
      ) : (
        <ChevronRight size={20} color="#d1d5db" />
      )}
    </View>
  </TouchableOpacity>
);

const AchievementBadge = ({ icon: Icon, title, color }: any) => (
  <View style={styles.achievementBadge}>
    <View style={[styles.achievementIcon, { backgroundColor: color }]}>
      <Icon size={16} color="#ffffff" />
    </View>
    <Text style={styles.achievementTitle}>{title}</Text>
  </View>
);

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const profileStats = [
    { icon: Star, label: 'Life Score', value: '87', color: '#F59E0B' },
    { icon: Activity, label: 'Streak', value: '12', color: '#3B82F6' },
    { icon: Award, label: 'Badges', value: '8', color: '#8B5CF6' },
    { icon: Leaf, label: 'CO₂ Saved', value: '45kg', color: '#22C55E' },
  ];

  const achievements = [
    { icon: Leaf, title: 'Eco Warrior', color: '#22C55E' },
    { icon: Activity, title: 'Fitness Pro', color: '#3B82F6' },
    { icon: Star, title: 'Top Performer', color: '#F59E0B' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        style={styles.header}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AC</Text>
          </View>
          <Text style={styles.userName}>Alex Chen</Text>
          <Text style={styles.userEmail}>alex.chen@email.com</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => Alert.alert('Edit Profile', 'Profile editing feature coming soon!')}
          >
            <Edit size={16} color="#6366F1" />
            <Text style={styles.editButtonText}>Edit Profile</Text>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <ProfileStat key={index} {...stat} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement, index) => (
              <AchievementBadge key={index} {...achievement} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsContainer}>
            <SettingItem
              icon={Bell}
              title="Notifications"
              subtitle="Get personalized insights and reminders"
              hasSwitch={true}
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
            />
            <SettingItem
              icon={Shield}
              title="Privacy & Data"
              subtitle="Control how your data is used"
              onPress={() => console.log('Privacy settings')}
            />
            <SettingItem
              icon={Settings}
              title="App Preferences"
              subtitle="Customize your LifeLoop experience"
              onPress={() => console.log('App preferences')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          <View style={styles.settingsContainer}>
            <SettingItem
              icon={Shield}
              title="Anonymous Data Sharing"
              subtitle="Help improve LifeLoop for everyone"
              hasSwitch={true}
              switchValue={dataSharing}
              onSwitchChange={setDataSharing}
            />
          </View>
          <View style={styles.privacyNote}>
            <Text style={styles.privacyText}>
              Your personal data is always encrypted and never shared without your consent. 
              Learn more about our privacy practices.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsContainer}>
            <SettingItem
              icon={HelpCircle}
              title="Help & FAQ"
              subtitle="Get answers to common questions"
              onPress={() => console.log('Help')}
            />
            <SettingItem
              icon={User}
              title="Contact Support"
              subtitle="Get personalized help from our team"
              onPress={() => console.log('Contact support')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>LifeLoop v1.0.0</Text>
          <Text style={styles.footerSubtext}>Optimize your life, every day</Text>
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
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
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
  statsContainer: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  achievementsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  achievementBadge: {
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
  achievementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  settingsContainer: {
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  settingRight: {
    marginLeft: 12,
  },
  privacyNote: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  privacyText: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
});