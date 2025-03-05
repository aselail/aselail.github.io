
// Query for fetching user information
const USER_QUERY = `
{
  user {
    id
    login
  }
}
`;

// Query for fetching XP transactions from the transaction table
const TRANSACTION_QUERY = `
{
  transaction(where: { type: { _eq: "xp" }}) {
    amount
    createdAt
  }
}
`;

// Query for fetching progress data
const PROGRESS_QUERY = `
{
  progress {
    grade
    createdAt
  }
}
`;
