-- Create RPC function to handle deleting GitHub connections and setting a new active connection
CREATE OR REPLACE FUNCTION public.delete_github_connection(p_installation_id text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_deleted_rows INTEGER;
  v_updated_rows INTEGER;
  v_result json;
BEGIN
  -- First, get the user_id for the connection being deleted
  SELECT user_id INTO v_user_id
  FROM public.github_connections
  WHERE github_installation_id = p_installation_id
  LIMIT 1;
  
  -- Delete the connection
  DELETE FROM public.github_connections
  WHERE github_installation_id = p_installation_id;
  
  GET DIAGNOSTICS v_deleted_rows = ROW_COUNT;
  
  -- If we found and deleted a connection
  IF v_deleted_rows > 0 AND v_user_id IS NOT NULL THEN
    -- Find the latest connection for this user and make it active
    UPDATE public.github_connections
    SET is_active = TRUE,
        updated_at = NOW()
    WHERE user_id = v_user_id
    AND id = (
      SELECT id
      FROM public.github_connections
      WHERE user_id = v_user_id
      ORDER BY created_at DESC
      LIMIT 1
    );
    
    GET DIAGNOSTICS v_updated_rows = ROW_COUNT;
  ELSE
    v_updated_rows := 0;
  END IF;
  
  -- Prepare result
  v_result := json_build_object(
    'deleted', v_deleted_rows,
    'updated', v_updated_rows,
    'user_id', v_user_id
  );
  
  RETURN v_result;
END;
$$;

-- Add comment for the function
COMMENT ON FUNCTION public.delete_github_connection IS 
  'Deletes GitHub connections for a specific installation ID and sets the most recent remaining connection as active';

-- Grant proper access to the function
GRANT EXECUTE ON FUNCTION public.delete_github_connection TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_github_connection TO service_role; 