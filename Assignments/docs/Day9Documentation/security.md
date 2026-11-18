## Login Rate Limiting

Implemented login rate limiting using express-rate-limit.

- Maximum attempts: 5
- Time window: 15 minutes
- HTTP status after limit: 429 Too Many Requests

### Testing

Sent repeated login requests using an incorrect password.

- First 5 requests: 401 Unauthorized
- Further requests: 429 Too Many Requests

### Purpose

Prevents attackers from repeatedly guessing passwords
through brute-force login attempts.


###=================================================================================================================

# SQL Injection — Prevention and Protection

## 1. What is SQL Injection?

SQL Injection is a security vulnerability where an attacker inserts malicious SQL statements through user input to manipulate database queries.

It occurs when an application directly concatenates user input into SQL queries instead of safely passing it as data.

## 2. How SQL Injection Works

Consider the following unsafe SQL query:

```sql
SELECT * FROM tasks WHERE title = 'USER_INPUT';
```

If user input is directly concatenated into this query, an attacker could provide:

```text
' OR 1=1 --
```

This can manipulate the SQL condition and potentially expose unintended database records.

## 3. Common Security Risks

- Unauthorized access to database records.
- Exposure of sensitive information.
- Modification or deletion of database records.
- Bypassing application-level restrictions.
- Potential compromise of database integrity.

## 4. Prevention Using Parameterized Queries

Parameterized queries prevent SQL Injection by separating SQL commands from user-supplied values.

**Unsafe approach:**

```typescript
const result = await pool.query(
    `SELECT * FROM tasks WHERE title = '${title}'`
);
```

**Secure approach:**

```typescript
const result = await pool.query(
    "SELECT * FROM tasks WHERE title = $1",
    [title]
);
```

Here:

- `$1` is a parameter placeholder.
- The actual value is passed separately.
- PostgreSQL treats the supplied value as data rather than executable SQL.

## 5. Security Practices Followed

The following practices help prevent SQL Injection:

1. Use parameterized queries for database operations.
2. Never directly concatenate user input into SQL statements.
3. Validate and sanitize input where appropriate.
4. Use database accounts with only the permissions they require.
5. Avoid exposing database errors and internal details to users.
6. Review database queries during development.

## 6. Implementation in Our Task Management Application

Our backend uses:

- Node.js and Express.js.
- TypeScript.
- PostgreSQL.
- The `pg` package for database connectivity.

We use parameterized queries with `$1`, `$2`, and other placeholders when passing values to PostgreSQL.

This ensures that user input is treated as data and cannot directly change the intended SQL query structure.

## 7. Conclusion

SQL Injection is a serious database security vulnerability.

Using parameterized queries is one of the primary ways to prevent it. Our Task Management Application follows this approach to make database operations safer and protect application data.