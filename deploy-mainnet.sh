
#!/bin/bash

echo "🚀 Deploying ICP VR Genesis to Internet Computer Mainnet..."

# Build the frontend
echo "📦 Building frontend..."
npm run build

# Deploy to mainnet
echo "🌐 Deploying to mainnet..."
dfx deploy --network ic

echo "✅ Deployment complete!"
echo "📝 Don't forget to update the canister IDs in src/services/icp.ts"
echo "🔗 Your frontend will be available at: https://<frontend-canister-id>.ic0.app"
