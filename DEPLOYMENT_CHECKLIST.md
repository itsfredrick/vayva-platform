# Vercel Deployment Checklist

Use this checklist to ensure you complete all deployment steps correctly.

## ✅ Pre-Deployment

### Database Setup
- [ ] Choose database provider (Neon/Vercel Postgres/Supabase)
- [ ] Create production database
- [ ] Copy connection string
- [ ] Save connection string securely

### Environment Secrets
- [ ] Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Save NEXTAUTH_SECRET securely
- [ ] Document all required environment variables

### External Services
- [ ] Sign up for Paystack
- [ ] Get Paystack API keys (test and live)
- [ ] Sign up for Resend
- [ ] Get Resend API key
- [ ] (Optional) Sign up for Groq AI
- [ ] (Optional) Set up Meta/WhatsApp

### Database Migrations
- [ ] Set DATABASE_URL locally
- [ ] Run: `cd packages/db && pnpm prisma migrate deploy`
- [ ] Verify migrations succeeded
- [ ] (Optional) Run seed script

### Code Preparation
- [ ] All code pushed to GitHub main branch
- [ ] All tests passing locally
- [ ] Build succeeds locally for all apps
- [ ] No sensitive data in code

---

## ✅ Marketing Site Deployment

### Create Project
- [ ] Go to vercel.com/new
- [ ] Import vayva-platform repository
- [ ] Set project name: `vayva-marketing`
- [ ] Set framework: Next.js
- [ ] Set root directory: `apps/marketing`
- [ ] Enable: "Include source files outside Root Directory"

### Environment Variables
- [ ] Add DATABASE_URL
- [ ] Add DIRECT_URL
- [ ] Add NEXTAUTH_SECRET
- [ ] Add NEXTAUTH_URL (use Vercel preview URL for now)
- [ ] Add APP_URL (use placeholder for now)
- [ ] Add MARKETING_URL (use Vercel preview URL)
- [ ] Add OPS_URL (use placeholder for now)
- [ ] Add NODE_ENV=production
- [ ] Set all variables for Production, Preview, Development

### Deploy
- [ ] Click Deploy
- [ ] Wait for build to complete
- [ ] Check for build errors
- [ ] Visit deployed site
- [ ] Copy deployment URL
- [ ] Verify homepage loads

---

## ✅ Merchant Admin Deployment

### Create Project
- [ ] Go to vercel.com/new
- [ ] Import vayva-platform repository (same repo)
- [ ] Set project name: `vayva-merchant-admin`
- [ ] Set framework: Next.js
- [ ] Set root directory: `apps/merchant-admin`
- [ ] Enable: "Include source files outside Root Directory"

### Environment Variables
- [ ] Add all variables from Marketing
- [ ] Add PAYSTACK_SECRET_KEY
- [ ] Add PAYSTACK_PUBLIC_KEY
- [ ] Add RESEND_API_KEY
- [ ] Add GROQ_API_KEY (optional)
- [ ] Update APP_URL to this project's URL
- [ ] Set all variables for Production, Preview, Development

### Deploy
- [ ] Click Deploy
- [ ] Wait for build to complete
- [ ] Check for build errors
- [ ] Visit deployed site
- [ ] Copy deployment URL
- [ ] Test signup page loads
- [ ] Test database connection (create account)

---

## ✅ Ops Console Deployment

### Create Project
- [ ] Go to vercel.com/new
- [ ] Import vayva-platform repository (same repo)
- [ ] Set project name: `vayva-ops-console`
- [ ] Set framework: Next.js
- [ ] Set root directory: `apps/ops-console`
- [ ] Enable: "Include source files outside Root Directory"

### Environment Variables
- [ ] Add DATABASE_URL
- [ ] Add DIRECT_URL
- [ ] Add NEXTAUTH_SECRET (same as others)
- [ ] Add NEXTAUTH_URL (use Vercel preview URL)
- [ ] Add APP_URL (merchant admin URL)
- [ ] Add MARKETING_URL (marketing URL)
- [ ] Add OPS_URL (this project's URL)
- [ ] Add NODE_ENV=production
- [ ] Set all variables for Production, Preview, Development

### Deploy
- [ ] Click Deploy
- [ ] Wait for build to complete
- [ ] Check for build errors
- [ ] Visit deployed site
- [ ] Copy deployment URL
- [ ] Test login page loads

---

## ✅ Update Cross-References

### Update All Projects
For each project (Marketing, Merchant Admin, Ops Console):

- [ ] Go to Settings → Environment Variables
- [ ] Update NEXTAUTH_URL to actual deployment URL
- [ ] Update APP_URL to merchant admin URL
- [ ] Update MARKETING_URL to marketing URL
- [ ] Update OPS_URL to ops console URL
- [ ] Click Save
- [ ] Go to Deployments → Redeploy latest

---

## ✅ External Service Configuration

### Paystack
- [ ] Go to Paystack dashboard
- [ ] Navigate to Settings → API Keys & Webhooks
- [ ] Add webhook: `https://[merchant-admin-url]/api/webhooks/paystack`
- [ ] Copy webhook secret
- [ ] Test webhook with test transaction

### Resend
- [ ] Go to Resend dashboard
- [ ] Create API key
- [ ] Add domain for sending emails
- [ ] Add DNS records to domain registrar
- [ ] Wait for domain verification
- [ ] Add webhook: `https://[merchant-admin-url]/api/webhooks/resend`
- [ ] Send test email

### WhatsApp (Optional)
- [ ] Go to Meta for Developers
- [ ] Create business app
- [ ] Add WhatsApp product
- [ ] Get phone number ID and access token
- [ ] Set webhook: `https://[merchant-admin-url]/api/whatsapp/webhook/inbound`
- [ ] Set verify token
- [ ] Test webhook verification

---

## ✅ Custom Domains (Optional)

### Marketing Site
- [ ] Go to project Settings → Domains
- [ ] Add domain: `www.yourdomain.com`
- [ ] Copy DNS records from Vercel
- [ ] Add DNS records to domain registrar
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate issued
- [ ] Update MARKETING_URL in all projects
- [ ] Redeploy all projects

### Merchant Admin
- [ ] Go to project Settings → Domains
- [ ] Add domain: `app.yourdomain.com`
- [ ] Copy DNS records from Vercel
- [ ] Add DNS records to domain registrar
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate issued
- [ ] Update APP_URL in all projects
- [ ] Update NEXTAUTH_URL in merchant admin
- [ ] Update Paystack webhook URL
- [ ] Update Resend webhook URL
- [ ] Redeploy all projects

### Ops Console
- [ ] Go to project Settings → Domains
- [ ] Add domain: `ops.yourdomain.com`
- [ ] Copy DNS records from Vercel
- [ ] Add DNS records to domain registrar
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate issued
- [ ] Update OPS_URL in all projects
- [ ] Update NEXTAUTH_URL in ops console
- [ ] Redeploy all projects

---

## ✅ Post-Deployment Testing

### Marketing Site
- [ ] Homepage loads
- [ ] All pages accessible
- [ ] Links to merchant admin work
- [ ] Images load correctly
- [ ] Forms work (if any)
- [ ] No console errors

### Merchant Admin
- [ ] Signup page loads
- [ ] Can create new account
- [ ] Email verification works (if enabled)
- [ ] Can login
- [ ] Dashboard loads
- [ ] Can create products
- [ ] Can process test payment
- [ ] Paystack webhook receives events
- [ ] Email sending works
- [ ] No console errors

### Ops Console
- [ ] Login page loads
- [ ] Can login with ops credentials
- [ ] Dashboard loads
- [ ] Can view merchants
- [ ] Can view orders
- [ ] Can perform admin actions
- [ ] No console errors

### Integration Testing
- [ ] Create merchant account
- [ ] Create product
- [ ] Make test purchase
- [ ] Verify payment in Paystack
- [ ] Verify order in database
- [ ] Verify email sent
- [ ] Check webhook logs
- [ ] Test WhatsApp (if configured)

---

## ✅ Monitoring & Maintenance

### Set Up Monitoring
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up error tracking (Sentry, optional)
- [ ] Configure uptime monitoring
- [ ] Set up database backups
- [ ] Document backup restoration process

### Security
- [ ] Verify all environment variables are set
- [ ] Ensure no secrets in code
- [ ] Check security headers are applied
- [ ] Verify HTTPS is enforced
- [ ] Test rate limiting (if configured)
- [ ] Review Vercel security settings

### Documentation
- [ ] Document deployment process
- [ ] Document rollback procedure
- [ ] Document environment variables
- [ ] Create runbook for common issues
- [ ] Share access with team members

---

## 🎉 Deployment Complete!

Once all items are checked, your Vayva platform is fully deployed and ready for production use.

**Next Steps:**
- Monitor application performance
- Set up staging environment
- Configure CI/CD for automatic deployments
- Plan scaling strategy
- Set up regular database backups

**Estimated Time:** 2-3 hours for first-time deployment
