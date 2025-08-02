# GitHub Secrets Setup for Vercel Deployment

## Required Secrets

To enable automatic deployment to Vercel via GitHub Actions, you need to set up these secrets in your GitHub repository:

### 1. VERCEL_TOKEN
- **Purpose**: Authenticates GitHub Actions with your Vercel account
- **How to get it**:
  1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
  2. Click "Create Token"
  3. Give it a name (e.g., "GitHub Actions Deploy")
  4. Copy the generated token

### 2. ORG_ID
- **Purpose**: Identifies your Vercel organization/team
- **How to get it**:
  1. Go to your Vercel dashboard
  2. Open your project settings
  3. Go to the "General" tab
  4. Copy the "Organization ID" (found under Project Information)

### 3. PROJECT_ID
- **Purpose**: Identifies your specific Vercel project
- **How to get it**:
  1. In your project settings on Vercel
  2. Go to the "General" tab
  3. Copy the "Project ID" (found under Project Information)

### 4. GA_MEASUREMENT_ID (Optional)
- **Purpose**: Google Analytics tracking ID
- **How to get it**:
  1. Go to Google Analytics
  2. Create a new property or use existing
  3. Copy the Measurement ID (format: G-XXXXXXXXXX)

## Setting Up Secrets in GitHub

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click "Secrets and variables" → "Actions"
4. Click "New repository secret" for each secret
5. Add the name and value for each secret:

```
Name: VERCEL_TOKEN
Value: [your-vercel-token]

Name: ORG_ID  
Value: [your-org-id]

Name: PROJECT_ID
Value: [your-project-id]

Name: GA_MEASUREMENT_ID
Value: [your-ga-id] (optional)
```

## Alternative: Using Vercel CLI to Get IDs

You can also get the ORG_ID and PROJECT_ID using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (run this in your project directory)
vercel link

# Get project info
vercel project ls
```

After running `vercel link`, check the `.vercel/project.json` file created in your project - it contains both IDs.

## Workflow Behavior

With these secrets configured:

- **Pull Requests**: Deploy to Vercel preview environment
- **Push to main branch**: Deploy to Vercel production environment
- **All deployments**: Run tests and build checks first

## Troubleshooting

If deployment fails:

1. **Check secrets**: Ensure all required secrets are set correctly
2. **Token permissions**: Make sure your Vercel token has deployment permissions
3. **Project linking**: Verify your project is correctly linked to Vercel
4. **Build errors**: Check the GitHub Actions logs for build failures

## Security Notes

- Never commit these values to your repository
- Rotate your Vercel token periodically
- Use environment-specific tokens if you have multiple environments
- Consider using Vercel's GitHub integration as an alternative to manual token setup
