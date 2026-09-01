# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in Vyayama, please email [your-email@example.com] with:
- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (if any)

Please do **not** open a public GitHub issue for security vulnerabilities.

---

## Security Practices

### Environment Variables
- **NEVER** commit `.env` files to version control
- Always use `.env.example` as a template
- Generate strong secrets:
  ```bash
  # Generate a strong JWT_SECRET
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### API Keys & Credentials
- Keep `GEMINI_API_KEY` and `JWT_SECRET` private
- Rotate secrets periodically in production
- Use environment variables or secrets management tools (e.g., AWS Secrets Manager, GitHub Secrets)

### Database Security
- For production, use MongoDB Atlas with strong authentication
- Enable network access restrictions
- Use encrypted connections (SSL/TLS)

### Authentication
- Passwords are hashed using bcryptjs with salt
- JWT tokens expire after 100 hours (360000 seconds)
- Change `JWT_SECRET` regularly and rotate tokens accordingly

### Frontend Security
- Use environment variables for API endpoints (`REACT_NATIVE_API_URL`)
- Avoid hardcoding sensitive URLs or keys in source code
- Store sensitive data securely (AsyncStorage with encryption for mobile)

---

## Deployment Checklist

Before deploying to production:

- [ ] Set all required environment variables
- [ ] Use strong, unique secrets
- [ ] Enable HTTPS/SSL for all API communications
- [ ] Configure CORS properly (restrict to your domain)
- [ ] Enable rate limiting on API endpoints
- [ ] Set up monitoring and logging
- [ ] Use a WAF (Web Application Firewall) if available
- [ ] Keep dependencies updated
- [ ] Run security audits: `npm audit`, `pip audit`

---

## Dependency Security

Regularly check for vulnerabilities in dependencies:

```bash
# For Node.js
npm audit

# For Python
pip audit
```

Update dependencies regularly and monitor GitHub security alerts.
