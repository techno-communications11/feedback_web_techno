export const INSERT_USER = `
  INSERT INTO users (
    applicant_uuid,
    email,
    password,
    role,
    market_id
  ) VALUES (?, ?, ?, ?,?)
`;

// users.queries.ts

export const SELECT_USER_BY_EMAIL = `
  SELECT applicant_uuid, email, password, role, market_id 
  FROM users 
  WHERE email = ?
`;

export const UPDATE_PASSWORD_BY_EMAIL = `
  UPDATE users set password=?
  WHERE email = ?
`;
export const SELECT_ALL_MARKETS = `
  SELECT market_id, market_name FROM markets
`;
