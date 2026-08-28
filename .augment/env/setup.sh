#!/bin/bash
set -e

# Update system packages
sudo apt-get update

# Install Node.js 20 (LTS) and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js and npm installation
node --version
npm --version

# Navigate to the project directory
cd /mnt/persist/workspace

# Install project dependencies
npm install

# Fix security vulnerabilities
npm audit fix --force

# Add npm global bin to PATH in user's profile
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> $HOME/.profile

# Create npm global directory
mkdir -p $HOME/.npm-global
npm config set prefix '$HOME/.npm-global'

# Source the profile to update PATH
source $HOME/.profile

# Keep ESLint config in sync with the repo: Next 16.3 ships native flat
# config and FlatCompat.extends("next/core-web-vitals") fails.
cat > eslint.config.mjs << 'EOF'
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
EOF

echo "Setup completed successfully!"