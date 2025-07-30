import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface LifeScoreRequest {
  user_id: string;
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

    const { user_id }: LifeScoreRequest = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get recent health metrics (last 7 days)
    const { data: healthMetrics } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', user_id)
      .gte('recorded_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    // Get recent environmental actions (last 30 days)
    const { data: envActions } = await supabase
      .from('environmental_actions')
      .select('*')
      .eq('user_id', user_id)
      .gte('recorded_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Get active goals progress
    const { data: goals } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'active');

    // Get completed challenges (last 30 days)
    const { data: challenges } = await supabase
      .from('challenge_participants')
      .select('*, challenges(*)')
      .eq('user_id', user_id)
      .eq('completed', true)
      .gte('joined_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Calculate life score components
    const healthScore = calculateHealthScore(healthMetrics || []);
    const environmentScore = calculateEnvironmentScore(envActions || []);
    const goalsScore = calculateGoalsScore(goals || []);
    const communityScore = calculateCommunityScore(challenges || []);

    // Weighted life score calculation
    const lifeScore = Math.round(
      healthScore * 0.35 +
      environmentScore * 0.25 +
      goalsScore * 0.25 +
      communityScore * 0.15
    );

    // Update user's life score
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        life_score: lifeScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', user_id);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        life_score: lifeScore,
        components: {
          health: healthScore,
          environment: environmentScore,
          goals: goalsScore,
          community: communityScore,
        },
        breakdown: {
          health_weight: 35,
          environment_weight: 25,
          goals_weight: 25,
          community_weight: 15,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error calculating life score:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to calculate life score' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function calculateHealthScore(metrics: any[]): number {
  if (metrics.length === 0) return 50; // Default score

  let score = 50;
  const metricScores: { [key: string]: number } = {};

  // Calculate scores for different metric types
  metrics.forEach(metric => {
    switch (metric.metric_type) {
      case 'steps':
        metricScores.steps = Math.min(100, (metric.value / 10000) * 100);
        break;
      case 'sleep_hours':
        metricScores.sleep = metric.value >= 7 && metric.value <= 9 ? 100 : 
                            Math.max(0, 100 - Math.abs(8 - metric.value) * 20);
        break;
      case 'heart_rate':
        // Resting heart rate scoring (60-100 bpm is normal)
        metricScores.heart_rate = metric.value >= 60 && metric.value <= 80 ? 100 :
                                 Math.max(0, 100 - Math.abs(70 - metric.value) * 2);
        break;
      case 'hydration':
        metricScores.hydration = Math.min(100, (metric.value / 8) * 100);
        break;
    }
  });

  // Average the available metric scores
  const scores = Object.values(metricScores);
  if (scores.length > 0) {
    score = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  }

  return Math.round(Math.max(0, Math.min(100, score)));
}

function calculateEnvironmentScore(actions: any[]): number {
  if (actions.length === 0) return 50;

  const totalCarbonSaved = actions.reduce((sum, action) => sum + (action.carbon_impact || 0), 0);
  const sustainableActions = actions.filter(action => action.carbon_impact > 0).length;

  // Score based on carbon saved and frequency of sustainable actions
  const carbonScore = Math.min(100, (totalCarbonSaved / 10) * 100); // 10kg CO2 = 100 points
  const frequencyScore = Math.min(100, (sustainableActions / 20) * 100); // 20 actions = 100 points

  return Math.round((carbonScore + frequencyScore) / 2);
}

function calculateGoalsScore(goals: any[]): number {
  if (goals.length === 0) return 50;

  const progressScores = goals.map(goal => {
    const progress = Math.min(100, (goal.current_value / goal.target_value) * 100);
    return progress;
  });

  const averageProgress = progressScores.reduce((sum, score) => sum + score, 0) / progressScores.length;
  return Math.round(averageProgress);
}

function calculateCommunityScore(challenges: any[]): number {
  if (challenges.length === 0) return 50;

  // Score based on number of completed challenges and their difficulty
  const baseScore = Math.min(100, challenges.length * 20); // 5 challenges = 100 points
  
  const difficultyBonus = challenges.reduce((bonus, challenge) => {
    const difficulty = challenge.challenges?.difficulty || 'medium';
    switch (difficulty) {
      case 'easy': return bonus + 5;
      case 'medium': return bonus + 10;
      case 'hard': return bonus + 20;
      default: return bonus;
    }
  }, 0);

  return Math.round(Math.min(100, baseScore + difficultyBonus));
}