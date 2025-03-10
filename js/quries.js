
const xp = `
    query Transaction {
        transaction(order_by: { createdAt: asc }, where: { type: { _eq: "xp" }, path: { _niregex: "piscine-js/|piscine-bh"  _iregex: "bh-module"} }) {
            amount
            attrs
            createdAt
            originEventId
            path
            type
        }
    }
`;

const userQury = `
    user {
        id
        firstName
        lastName
        login
        email
        campus
        totalUp
        totalDown
        createdAt
        updatedAt        
    }
`;

const level = `
    query Transaction {
        transaction(order_by: { amount: asc }, where: { type: { _eq: "level" }, path: { _niregex: "piscine" }}) {
            amount
            attrs
            createdAt
            path
        }
    }
`;

const skills = `
    query Transaction {
        transaction(order_by: { createdAt: asc }, where: { type: {_iregex: "skill" }}) {
            type
            amount
            attrs
            createdAt
            path
        }
    }
`;