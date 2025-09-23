export const INSERT_USER = `
  INSERT INTO users (
    applicant_uuid,
    email,
    password,
    role,
    ntid
  ) VALUES (?, ?, ?, ?,?)
`;

// users.queries.ts

export const SELECT_USER_BY_EMAIL = `
  SELECT applicant_uuid, email, password, role 
  FROM users 
  WHERE email = ?
`;
export const GET_APPLICANT_BY_NTID = `
  SELECT applicant_uuid,email
  FROM users 
  WHERE ntid = ?
`;
 export const UPDATE_PASSWORD_BY_EMAIL = `
  UPDATE users set password=?
  WHERE email = ?
`;