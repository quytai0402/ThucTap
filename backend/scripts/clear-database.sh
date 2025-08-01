#!/bin/bash

# Clear All Mock Data Script
# This script will remove all sample/mock data from the database
# Admin users will be preserved

echo "🧹 Database Cleanup Script"
echo "=========================="
echo "This will remove ALL mock/sample data from the database:"
echo "- All products"
echo "- All categories" 
echo "- All orders"
echo "- All customer users (admin users preserved)"
echo "- All guest customers"
echo "- All reviews"
echo ""

# Ask for confirmation
read -p "Are you sure you want to proceed? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting cleanup process..."
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "❌ node_modules not found. Please run 'npm install' first."
        exit 1
    fi
    
    # Run the TypeScript cleanup script
    npx ts-node scripts/clear-all-mock-data.ts
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Cleanup completed successfully!"
        echo "🎯 Your database is now clean and ready for production data."
        echo ""
        echo "💡 Next steps:"
        echo "   1. Add real categories for your business"
        echo "   2. Add real products"
        echo "   3. Configure your admin settings"
    else
        echo ""
        echo "❌ Cleanup failed. Please check the error messages above."
        exit 1
    fi
else
    echo "❌ Cleanup cancelled."
    exit 0
fi
