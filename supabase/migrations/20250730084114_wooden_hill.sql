-- Add RPC function to increment user points
CREATE OR REPLACE FUNCTION increment_user_points(user_id uuid, points integer)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET 
    total_points = total_points + points,
    updated_at = now()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_id uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_goals', (SELECT COUNT(*) FROM goals WHERE goals.user_id = get_user_stats.user_id),
    'completed_goals', (SELECT COUNT(*) FROM goals WHERE goals.user_id = get_user_stats.user_id AND status = 'completed'),
    'active_challenges', (SELECT COUNT(*) FROM challenge_participants WHERE challenge_participants.user_id = get_user_stats.user_id AND completed = false),
    'total_carbon_saved', (SELECT COALESCE(SUM(carbon_impact), 0) FROM environmental_actions WHERE environmental_actions.user_id = get_user_stats.user_id AND carbon_impact > 0),
    'achievements_count', (SELECT COUNT(*) FROM user_achievements WHERE user_achievements.user_id = get_user_stats.user_id)
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;