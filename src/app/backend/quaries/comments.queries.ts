export const INSERT_COMMENT = `
  INSERT INTO comments (
    form_id,
    applicant_uuid,
    comment_text,
    version
  ) VALUES (?, ?, ?, ?)
`;


export const GET_COMMENTS_BY_FORM_ID=`
SELECT * FROM comments WHERE form_id = ?`
export const GET_COMMENTS_BY_APPLICANT_UUID=`
SELECT * FROM comments WHERE applicant_uuid = ?`

export const GET_COMMENTS_BY_FORM = `
  SELECT * FROM comments WHERE form_id = ? ORDER BY version ASC
`;

export const GET_LATEST_COMMENT = `
  SELECT * FROM comments 
  WHERE form_id = ? AND field_name = ? 
  ORDER BY version DESC LIMIT 1
`;

 export const UPDATE_COMMENT_BY_MANAGER = `
 UPDATE comments
SET manager_comment = ? ,manager_commented_at= CURRENT_TIMESTAMP
WHERE form_id = ?;

`;
export const UPDATE_COMMENT_BY_COMMENT_ID = `
UPDATE comments set manager_comment=?,market_manager_edit_date= CURRENT_TIMESTAMP
WHERE comment_id = ?;
`;

export const UPDATE_COMMENT_TEXT_BY_MANAGER = `
UPDATE comments set comment_text=?,market_manager_edit_date= CURRENT_TIMESTAMP
WHERE comment_id = ?;
`;
