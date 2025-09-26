export const GET_ALL_FORM_WITH_COMMENTS_AND_MARKET = `
  SELECT 
      f.form_uuid,
      f.first_name,
      f.last_name,
      f.ntid,
      f.market_id,
      m.market_name,
      f.market_manager_firstname,
      f.market_manager_lastname,
      f.hours_worked,
      f.boxes_completed,
      f.accessories_sold,
      f.feature_revenue,
      f.csat,
      f.day_35_activation_retention,
      f.day_35_future_mrc_retention,
      f.day_65_activation_retention,
      f.day_65_future_mrc_retention,
      f.day_95_activation_retention,
      f.day_95_future_mrc_retention,
      f.day_125_activation_retention,
      f.day_125_future_mrc_retention,
      f.day_155_activation_retention,
      f.day_155_future_mrc_retention,
      f.created_at AS form_created_at,

      c.comment_id,
      c.comment_text,
      c.manager_comment,
      c.form_uuid AS form_uuid_comment,
      c.created_at AS comment_created_at

  FROM form_data f
  LEFT JOIN comments c 
    ON f.form_uuid = c.form_uuid
  LEFT JOIN markets m 
    ON f.market_id = m.market_id
  ORDER BY f.created_at DESC, c.created_at ASC;
`;


 export const GET_ALL_WRITEUPS_WITH_COMMENTS_AND_MARKET=`
SELECT 
    w.writeup_uuid,
    w.ntid,
    f.first_name,
    f.last_name,
    f.market_id,
    m.market_name,
    w.document_url,
    w.created_at AS writeup_created_at
FROM employee_evaluation_writeups w
JOIN form_data f 
    ON w.ntid = f.ntid
LEFT JOIN markets m
    ON f.market_id = m.market_id
ORDER BY w.created_at DESC;

`