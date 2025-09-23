export const INSERT_NOTIFICATIONS = `INSERT INTO notifications (id,user_id,role,type,is_read,form_id) VALUES (?,?,?,?,?,?)`;
export const SELECT_NOTIFICATIONS_BY_APPLICANT = `
SELECT n.id AS notification_id,
       n.user_id,
       n.form_id,
       n.role,
       n.type,
       n.is_read,
       n.created_at
FROM notifications n
WHERE n.user_id = ?
  AND n.form_id != 0
  AND NOT EXISTS (
        SELECT 1
        FROM comments c
        WHERE c.form_id = n.form_id
          AND c.applicant_uuid = n.user_id
    )
ORDER BY n.created_at DESC;
`;

export const SELECT_NOTIFICATIONS_BY_role = `SELECT * from notifications where role="admin"?`;
