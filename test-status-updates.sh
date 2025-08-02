#!/bin/bash

# Script test cập nhật trạng thái
BASE_URL="http://localhost:3001/api"

echo "🔍 Test Status Updates API..."

# Lấy token admin
echo "🔑 Đăng nhập admin..."
ADMIN_LOGIN=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@admin.com", "password": "admin"}')

ADMIN_TOKEN=$(echo $ADMIN_LOGIN | jq -r '.token // .access_token')
echo "Admin token: $ADMIN_TOKEN"

# Test 1: Lấy danh sách orders
echo "📋 Lấy danh sách orders..."
ORDERS=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "${BASE_URL}/admin/orders")
echo "Orders response: $(echo $ORDERS | jq '.data | length') orders found"

# Lấy order ID đầu tiên để test
ORDER_ID=$(echo $ORDERS | jq -r '.data[0].id // .data[0]._id')
echo "Testing with Order ID: $ORDER_ID"

if [ "$ORDER_ID" != "null" ] && [ "$ORDER_ID" != "" ]; then
  # Test 2: Cập nhật trạng thái order
  echo "🔄 Test cập nhật trạng thái order..."
  UPDATE_ORDER=$(curl -s -X PATCH "${BASE_URL}/admin/orders/$ORDER_ID/status" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d '{"status": "processing"}')
  
  echo "Update order response: $(echo $UPDATE_ORDER | jq '.success')"
  
  # Test 3: Kiểm tra trạng thái đã được cập nhật
  echo "✅ Kiểm tra trạng thái đã cập nhật..."
  CHECK_ORDER=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "${BASE_URL}/admin/orders/$ORDER_ID")
  echo "Current order status: $(echo $CHECK_ORDER | jq -r '.data.status')"
fi

# Test 4: Lấy danh sách customers
echo "👥 Lấy danh sách customers..."
CUSTOMERS=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "${BASE_URL}/admin/customers")
echo "Customers response: $(echo $CUSTOMERS | jq '.data | length') customers found"

# Lấy customer ID đầu tiên để test
CUSTOMER_ID=$(echo $CUSTOMERS | jq -r '.data[0].id // .data[0]._id')
echo "Testing with Customer ID: $CUSTOMER_ID"

if [ "$CUSTOMER_ID" != "null" ] && [ "$CUSTOMER_ID" != "" ]; then
  # Test 5: Cập nhật trạng thái customer
  echo "🔄 Test cập nhật trạng thái customer..."
  UPDATE_CUSTOMER=$(curl -s -X PATCH "${BASE_URL}/admin/customers/$CUSTOMER_ID/status" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d '{"status": "active"}')
  
  echo "Update customer response: $(echo $UPDATE_CUSTOMER | jq '.success')"
fi

# Test 6: Lấy danh sách products
echo "📦 Lấy danh sách products..."
PRODUCTS=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "${BASE_URL}/admin/products")
echo "Products response: $(echo $PRODUCTS | jq '.data | length') products found"

# Lấy product ID đầu tiên để test
PRODUCT_ID=$(echo $PRODUCTS | jq -r '.data[0].id // .data[0]._id')
echo "Testing with Product ID: $PRODUCT_ID"

if [ "$PRODUCT_ID" != "null" ] && [ "$PRODUCT_ID" != "" ]; then
  # Test 7: Cập nhật trạng thái product
  echo "🔄 Test cập nhật trạng thái product..."
  UPDATE_PRODUCT=$(curl -s -X PATCH "${BASE_URL}/admin/products/$PRODUCT_ID/status" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d '{"status": "active"}')
  
  echo "Update product response: $(echo $UPDATE_PRODUCT | jq '.success')"
fi

echo "✅ Test hoàn thành!"
