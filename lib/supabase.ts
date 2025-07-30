import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  life_score: number;
  total_points: number;
  streak_days: number;
  created_at: string;
  updated_at: string;
}

export interface HealthMetric {
  id: string;
  user_id: string;
  metric_type: string;
  value: number;
  unit: string;
  recorded_at: string;
  source: string;
  created_at: string;
}

export interface EnvironmentalAction {
  id: string;
  user_id: string;
  action_type: string;
  description: string;
  carbon_impact: number;
  points_earned: number;
  recorded_at: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points_reward: number;
  start_date: string;
  end_date: string;
  max_participants?: number;
  created_at: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  category: string;
  title: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  priority_score: number;
  expires_at: string;
  completed: boolean;
  created_at: string;
}