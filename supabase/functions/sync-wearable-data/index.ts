import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface WearableDataRequest {
  user_id: string;
  data: {
    steps?: number;
    heart_rate?: number;
    sleep_hours?: number;
    calories_burned?: number;
    active_minutes?: number;
  };
  source: string;
  recorded_at?: string;
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

    const { user_id, data, source, recorded_at }: WearableDataRequest = await req.json();

    if (!user_id || !data || !source) {
      return new Response(
        JSON.stringify({ error: 'User ID, data, and source are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const recordedTime = recorded_at ? new Date(recorded_at) : new Date();
    const metricsToInsert = [];

    // Process each metric type
    Object.entries(data).forEach(([metricType, value]) => {
      if (value !== undefined && value !== null) {
        const unit = getUnitForMetric(metricType);
        metricsToInsert.push({
          user_id,
          metric_type: metricType,
          value: Number(value),
          unit,
          source,
          recorded_at: recordedTime.toISOString(),
        });
      }
    });

    if (metricsToInsert.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid metrics provided' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert metrics
    const { data: insertedMetrics, error: insertError } = await supabase
      .from('health_metrics')
      .insert(metricsToInsert)
      .select();

    if (insertError) {
      throw insertError;
    }

    // Calculate points based on metrics
    const pointsEarned = calculatePointsFromMetrics(metricsToInsert);

    // Update user's total points
    if (pointsEarned > 0) {
      const { error: pointsError } = await supabase.rpc('increment_user_points', {
        user_id,
        points: pointsEarned,
      });

      if (pointsError) {
        console.error('Error updating points:', pointsError);
      }
    }

    // Check for achievements
    await checkAndUnlockAchievements(supabase, user_id);

    // Trigger life score recalculation
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/calculate-life-score`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id }),
    });

    return new Response(
      JSON.stringify({
        success: true,
        metrics_inserted: insertedMetrics?.length || 0,
        points_earned: pointsEarned,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error syncing wearable data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to sync wearable data' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getUnitForMetric(metricType: string): string {
  const units: { [key: string]: string } = {
    steps: 'steps',
    heart_rate: 'bpm',
    sleep_hours: 'hours',
    calories_burned: 'calories',
    active_minutes: 'minutes',
  };
  return units[metricType] || 'units';
}

function calculatePointsFromMetrics(metrics: any[]): number {
  let points = 0;

  metrics.forEach(metric => {
    switch (metric.metric_type) {
      case 'steps':
        if (metric.value >= 10000) points += 50;
        else if (metric.value >= 5000) points += 25;
        break;
      case 'sleep_hours':
        if (metric.value >= 7 && metric.value <= 9) points += 30;
        break;
      case 'active_minutes':
        if (metric.value >= 30) points += 40;
        break;
      default:
        points += 10; // Base points for any metric
    }
  });

  return points;
}

async function checkAndUnlockAchievements(supabase: any, userId: string) {
  try {
    // Get user's current achievements
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    const unlockedIds = userAchievements?.map((ua: any) => ua.achievement_id) || [];

    // Get all achievements
    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*');

    if (!allAchievements) return;

    // Check each achievement
    for (const achievement of allAchievements) {
      if (unlockedIds.includes(achievement.id)) continue;

      const shouldUnlock = await checkAchievementCriteria(supabase, userId, achievement);
      
      if (shouldUnlock) {
        await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
          });
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
}

async function checkAchievementCriteria(supabase: any, userId: string, achievement: any): Promise<boolean> {
  switch (achievement.title) {
    case 'First Steps':
      // Check if user has any health metrics
      const { count } = await supabase
        .from('health_metrics')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      return (count || 0) > 0;

    case 'Eco Warrior':
      // Check if user saved 10kg CO2
      const { data: envActions } = await supabase
        .from('environmental_actions')
        .select('carbon_impact')
        .eq('user_id', userId);
      const totalSaved = envActions?.reduce((sum: number, action: any) => 
        sum + Math.max(0, action.carbon_impact || 0), 0) || 0;
      return totalSaved >= 10;

    default:
      return false;
  }
}