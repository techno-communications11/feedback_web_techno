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
