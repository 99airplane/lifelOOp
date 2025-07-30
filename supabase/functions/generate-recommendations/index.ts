import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface RecommendationRequest {
  user_id: string;
  health_data?: any;
  environmental_data?: any;
  goals?: any[];
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, health_data, environmental_data, goals }: RecommendationRequest = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get user's recent health metrics
    const { data: healthMetrics } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', user_id)
      .gte('recorded_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('recorded_at', { ascending: false });

    // Get user's environmental actions
    const { data: envActions } = await supabase
      .from('environmental_actions')
      .select('*')
      .eq('user_id', user_id)
      .gte('recorded_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('recorded_at', { ascending: false });

    // Get user's active goals
    const { data: userGoals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'active');

    // Generate AI-powered recommendations based on data
    const recommendations = generatePersonalizedRecommendations({
      healthMetrics: healthMetrics || [],
      envActions: envActions || [],
      goals: userGoals || [],
    });

    // Clear old recommendations
    await supabase
      .from('recommendations')
      .delete()
      .eq('user_id', user_id)
      .lt('expires_at', new Date().toISOString());

    // Insert new recommendations
    const { data: insertedRecs, error } = await supabase
      .from('recommendations')
      .insert(
        recommendations.map(rec => ({
          ...rec,
          user_id,
        }))
      )
      .select();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        recommendations: insertedRecs,
        count: insertedRecs?.length || 0 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate recommendations' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generatePersonalizedRecommendations({ healthMetrics, envActions, goals }: any) {
  const recommendations = [];

  // Health-based recommendations
  const recentSteps = healthMetrics.find((m: any) => m.metric_type === 'steps');
  if (!recentSteps || recentSteps.value < 8000) {
    recommendations.push({
      category: 'health',
      title: 'Boost Your Daily Steps',
      description: 'Take a 15-minute walk to reach your daily step goal and improve cardiovascular health.',
      impact_level: 'medium',
      difficulty: 'easy',
      priority_score: 80,
    });
  }

  const recentSleep = healthMetrics.find((m: any) => m.metric_type === 'sleep_hours');
  if (!recentSleep || recentSleep.value < 7) {
    recommendations.push({
      category: 'wellness',
      title: 'Optimize Your Sleep',
      description: 'Start your bedtime routine 30 minutes earlier to improve sleep quality and recovery.',
      impact_level: 'high',
      difficulty: 'medium',
      priority_score: 90,
    });
  }

  // Environmental recommendations
  const recentTransport = envActions.filter((a: any) => a.action_type === 'transport');
  if (recentTransport.length < 3) {
    recommendations.push({
      category: 'environment',
      title: 'Green Commute Challenge',
      description: 'Try biking or public transport today to reduce your carbon footprint by 2-4kg CO₂.',
      impact_level: 'high',
      difficulty: 'medium',
      priority_score: 75,
    });
  }

  // Goal-based recommendations
  const fitnessGoals = goals.filter((g: any) => g.category === 'fitness');
  if (fitnessGoals.length > 0) {
    const behindGoals = fitnessGoals.filter((g: any) => 
      (g.current_value / g.target_value) < 0.7
    );
    
    if (behindGoals.length > 0) {
      recommendations.push({
        category: 'fitness',
        title: 'Catch Up on Fitness Goals',
        description: 'You\'re behind on some fitness goals. A quick 20-minute workout can get you back on track.',
        impact_level: 'medium',
        difficulty: 'medium',
        priority_score: 70,
      });
    }
  }

  // Energy and mood recommendations
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour <= 10) {
    recommendations.push({
      category: 'energy',
      title: 'Morning Sunlight Boost',
      description: 'Get 10-15 minutes of natural sunlight to boost energy and regulate your circadian rhythm.',
      impact_level: 'high',
      difficulty: 'easy',
      priority_score: 85,
    });
  }

  return recommendations.slice(0, 4); // Return top 4 recommendations
}