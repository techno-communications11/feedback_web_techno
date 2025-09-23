export const INSERT_FORM = `
  INSERT INTO form_data (
    applicant_uuid,
    first_name,
    last_name,
    ntid,
    market_manager_firstname,
    market_manager_lastname,
    hours_worked,
    boxes_completed,
    accessories_sold,
    feature_revenue,
    csat,
    day_155_activation_retention,
    day_155_future_mrc_retention
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const GET_FORM_BY_ID = `
  SELECT * FROM form_data WHERE form_id = ?
`;

export const GET_FULL_FORM_COMMENTS_BY_USER_MONTH_YEAR = `
  SELECT 
    f.*,
    c.*
  FROM form_data f
  LEFT JOIN comments c 
    ON f.form_id = c.form_id
  WHERE f.first_name = ?
    AND f.last_name = ?
    AND MONTH(f.created_at) = ?
    AND YEAR(f.created_at) = ?
  ORDER BY f.created_at DESC, c.created_at DESC Limit 1;
`;

export const GET_FULL_FORM_DETAILS_BY_APPLICANT_UUUID = `
  SELECT 
      f.*,
      c.comment_id,
      c.comment_text,
      c.created_at AS comment_created_at,
      c.applicant_uuid AS comment_applicant_uuid
  FROM form_data f
  LEFT JOIN comments c
    ON c.form_id = f.form_id
   AND c.applicant_uuid = f.applicant_uuid
  WHERE f.applicant_uuid = ?
  ORDER BY f.created_at DESC, c.created_at ASC;
`;

export const GET_FORMS_WITHOUT_COMMENTS_BY_FORM_ID = `
  SELECT 
      f.*
  FROM form_data f
  LEFT JOIN comments c
    ON c.form_id = f.form_id
   AND c.applicant_uuid = f.applicant_uuid
  WHERE f.form_id = ?
    AND c.comment_id IS NULL
  ORDER BY f.created_at DESC;
`;

export const GET_YEAR_FROM_FORMS = `
  SELECT DISTINCT YEAR(created_at) AS year FROM form_data ORDER BY year DESC;
`;

export const GET_USERNAMES_FROM_FORMS = `
  SELECT DISTINCT first_name, last_name, applicant_uuid,ntid FROM form_data ORDER BY first_name, last_name;
`;
