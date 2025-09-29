export const INSERT_FORM = `
  INSERT INTO form_data (
    form_uuid,
    first_name,
    last_name,
    market_id,
    ntid,
    market_manager_firstname,
    market_manager_lastname,
    hours_worked,
    boxes_completed,
    accessories_sold,
    feature_revenue,
    csat,
    day_35_activation_retention,
    day_35_future_mrc_retention,
    day_65_activation_retention,
    day_65_future_mrc_retention,
    day_95_activation_retention,
    day_95_future_mrc_retention,
    day_125_activation_retention,
    day_125_future_mrc_retention,
    day_155_activation_retention,
    day_155_future_mrc_retention
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const GET_APPLICANT_Form_DETAILS_BY_NTID = `
  SELECT form_uuid, ntid, created_at
FROM form_data
WHERE ntid = ?
  AND MONTH(created_at) = MONTH(CURRENT_DATE())
  AND YEAR(created_at) = YEAR(CURRENT_DATE());

`;

export const GET_FORM_BY_ID = `
  SELECT * FROM form_data WHERE form_uuid = ?
`;

export const GET_FULL_FORM_DATA_BY_USER_MONTH_YEAR = `
SELECT 
    f.*,
    c.comment_text,
    c.manager_comment,
    c.form_uuid AS comment_by,
    c.created_at AS comment_created_at
FROM form_data f
LEFT JOIN comments c
    ON f.form_uuid = c.form_uuid
WHERE f.ntid = ?
  AND MONTH(f.created_at) = ?
  AND YEAR(f.created_at) = ?
ORDER BY f.created_at DESC
LIMIT 1;


`;

export const GET_FULL_FORM_DETAILS_BY_APPLICANT_UUUID = `
  SELECT 
      f.*,
      c.comment_id,
      c.comment_text,
      c.market_manager_comment
      c.created_at AS comment_created_at,
      c.form_uuid AS comment_form_uuid
  FROM form_data f
  LEFT JOIN comments c
    ON c.form_uuid = f.form_uuid
  WHERE f.form_uuid= ?
  ORDER BY f.created_at DESC, c.created_at ASC;
`;

export const GET_FORMS_WITHOUT_COMMENTS_BY_FORM_ID = `
  SELECT 
      f.*
  FROM form_data f
  LEFT JOIN comments c
    ON c.form_id = f.form_id
   AND c.form_uuid = f.form_uuid
  WHERE f.form_id = ?
    AND c.comment_id IS NULL
  ORDER BY f.created_at DESC;
`;

export const GET_YEAR_FROM_FORMS = `
  SELECT DISTINCT YEAR(created_at) AS year FROM form_data ORDER BY year DESC;
`;

export const GET_USERNAMES_FROM_FORMS = `
  SELECT DISTINCT first_name, last_name, form_uuid,ntid FROM form_data ORDER BY first_name, last_name;
`;
export const GET_USERNAMES_FROM_FORMS_BY_MARKET = `
  SELECT DISTINCT 
    f.first_name,
    f.last_name,
    f.form_uuid,
    f.ntid
FROM form_data f
JOIN users u ON f.market_id = u.market_id
WHERE u.market_id = ?
ORDER BY f.first_name, f.last_name;

`;
