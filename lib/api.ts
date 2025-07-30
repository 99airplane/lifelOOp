import { supabase } from './supabase';
import type { Profile, HealthMetric, EnvironmentalAction, Goal, Recommendation } from './supabase';

// Auth functions
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile functions
export const getProfile = async (userId: string): Promise<{ data: Profile | null; error: any }> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Health metrics functions
export const addHealthMetric = async (metric: Omit<HealthMetric, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('health_metrics')
    .insert(metric)
    .select()
    .single();
  return { data, error };
};

export const getHealthMetrics = async (userId: string, days: number = 7) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', userId)
    .gte('recorded_at', startDate)
    .order('recorded_at', { ascending: false });
  return { data, error };
};

// Environmental actions functions
export const addEnvironmentalAction = async (action: Omit<EnvironmentalAction, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('environmental_actions')
    .insert(action)
    .select()
    .single();
  return { data, error };
};

export const getEnvironmentalActions = async (userId: string, days: number = 30) => {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('environmental_actions')
    .select('*')
    .eq('user_id', userId)
    .gte('recorded_at', startDate)
    .order('recorded_at', { ascending: false });
  return { data, error };
};

// Goals functions
export const createGoal = async (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('goals')
    .insert(goal)
    .select()
    .single();
  return { data, error };
};

export const getGoals = async (userId: string, status?: string) => {
  let query = supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single();
  return { data, error };
};

// Recommendations functions
export const getRecommendations = async (userId: string) => {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', false)
    .gt('expires_at', new Date().toISOString())
    .order('priority_score', { ascending: false });
  return { data, error };
};

export const generateRecommendations = async (userId: string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/generate-recommendations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate recommendations');
  }
  
  return response.json();
};

export const markRecommendationCompleted = async (recommendationId: string) => {
  const { data, error } = await supabase
    .from('recommendations')
    .update({ completed: true })
    .eq('id', recommendationId)
    .select()
    .single();
  return { data, error };
};

// Challenges functions
export const getChallenges = async () => {
  const { data, error } = await supabase
    .from('challenges')
    .select(`
      *,
      challenge_participants(count)
    `)
    .gte('end_date', new Date().toISOString())
    .order('created_at', { ascending: false });
  return { data, error };
};

export const joinChallenge = async (challengeId: string, userId: string) => {
  const { data, error } = await supabase
    .from('challenge_participants')
    .insert({
      challenge_id: challengeId,
      user_id: userId,
    })
    .select()
    .single();
  return { data, error };
};

export const getLeaderboard = async (challengeId?: string) => {
  let query = supabase
    .from('profiles')
    .select('id, full_name, total_points')
    .order('total_points', { ascending: false })
    .limit(10);
  
  const { data, error } = await query;
  return { data, error };
};

// Life score calculation
export const calculateLifeScore = async (userId: string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/calculate-life-score`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to calculate life score');
  }
  
  return response.json();
};

// Sync wearable data
export const syncWearableData = async (userId: string, data: any, source: string) => {
  const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/sync-wearable-data`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      user_id: userId, 
      data, 
      source 
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to sync wearable data');
  }
  
  return response.json();
};