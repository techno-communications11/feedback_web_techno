export const INSERT_COMMENT_EMPLOYEE = `
  INSERT INTO comments (
    form_uuid,
    comment_text,
    ntid
  ) VALUES (?, ?,?)
`;

export const INSERT_COMMENT_MANAGER = `
  INSERT INTO comments (
    form_uuid,
    manager_comment,
    ntid
  ) VALUES (?, ?,?)
`;
export const UPDATE_MANAGER_COMMENT = `
  UPDATE comments 
  SET manager_comment = ?, 
  manager_commented_at = CURRENT_TIMESTAMP 
  WHERE form_uuid = ? AND comment_id = ?
`;

export const GET_COMMENTS_BY_FORM_ID = `
SELECT * FROM comments WHERE form_uuid = ?`;
export const GET_COMMENTS_BY_NTID = `
SELECT * FROM comments WHERE NTID = ?`;

export const GET_COMMENTS_BY_FORM = `
  SELECT * FROM comments WHERE form_uuid = ? ORDER BY version ASC
`;

export const GET_LATEST_COMMENT = `
  SELECT * FROM comments 
  WHERE form_uuid = ? AND field_name = ? 
  ORDER BY version DESC LIMIT 1
`;

export const UPDATE_COMMENT_BY_MANAGER = `
 UPDATE comments
SET manager_comment = ? ,manager_commented_at= CURRENT_TIMESTAMP
WHERE form_uuid = ?;

`;
export const UPDATE_COMMENT_BY_COMMENT_ID = `
UPDATE comments set manager_comment=?,market_manager_edit_date= CURRENT_TIMESTAMP
WHERE comment_id = ?;
`;

export const UPDATE_COMMENT_TEXT_BY_MANAGER = `
UPDATE comments set comment_text=?,market_manager_edit_date= CURRENT_TIMESTAMP
WHERE comment_id = ?;
`;
// src/app/backend/quaries/comments.queries.ts

export const GET_LATEST_COMMENT_BY_FORM_UUID = `
  SELECT comment_id 
  FROM comments 
  WHERE form_uuid = ? 
  ORDER BY created_at DESC 
  LIMIT 1
`;
