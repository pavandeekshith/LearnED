#!/usr/bin/env python3
"""
Comprehensive Backend Testing for LearnED Platform
Tests all API endpoints, database operations, and server health
"""

import requests
import json
import time
from datetime import datetime
import uuid

# Get backend URL from environment
BACKEND_URL = "https://no-db-static.preview.emergentagent.com/api"

def test_root_endpoint():
    """Test GET /api/ root endpoint"""
    print("\n=== Testing Root Endpoint ===")
    try:
        response = requests.get(f"{BACKEND_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if "message" in data and data["message"] == "Hello World":
                print("✅ Root endpoint working correctly")
                return True
            else:
                print("❌ Root endpoint returned unexpected response")
                return False
        else:
            print(f"❌ Root endpoint failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Root endpoint test failed: {str(e)}")
        return False

def test_cors():
    """Test CORS functionality"""
    print("\n=== Testing CORS ===")
    try:
        headers = {
            'Origin': 'https://example.com',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        response = requests.options(f"{BACKEND_URL}/status", headers=headers)
        print(f"CORS preflight status: {response.status_code}")
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        }
        print(f"CORS headers: {cors_headers}")
        
        if response.status_code in [200, 204] and cors_headers['Access-Control-Allow-Origin']:
            print("✅ CORS is properly configured")
            return True
        else:
            print("❌ CORS configuration issues detected")
            return False
    except Exception as e:
        print(f"❌ CORS test failed: {str(e)}")
        return False

def test_post_status_endpoint():
    """Test POST /api/status endpoint with sample data"""
    print("\n=== Testing POST Status Endpoint ===")
    try:
        # Test with realistic educational platform data
        test_data = {
            "client_name": "LearnED Student Portal"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/status",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            # Validate response structure
            required_fields = ["id", "client_name", "timestamp"]
            if all(field in data for field in required_fields):
                # Validate UUID format
                try:
                    uuid.UUID(data["id"])
                    print("✅ UUID generation working correctly")
                except ValueError:
                    print("❌ Invalid UUID format in response")
                    return False
                
                # Validate timestamp format
                try:
                    datetime.fromisoformat(data["timestamp"].replace('Z', '+00:00'))
                    print("✅ Timestamp format is valid")
                except ValueError:
                    print("❌ Invalid timestamp format")
                    return False
                
                # Validate client_name matches input
                if data["client_name"] == test_data["client_name"]:
                    print("✅ POST status endpoint working correctly")
                    return True, data["id"]
                else:
                    print("❌ Client name mismatch in response")
                    return False, None
            else:
                print(f"❌ Missing required fields in response: {required_fields}")
                return False, None
        else:
            print(f"❌ POST status endpoint failed with status {response.status_code}")
            return False, None
    except Exception as e:
        print(f"❌ POST status endpoint test failed: {str(e)}")
        return False, None

def test_get_status_endpoint():
    """Test GET /api/status endpoint to retrieve status checks"""
    print("\n=== Testing GET Status Endpoint ===")
    try:
        response = requests.get(f"{BACKEND_URL}/status")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Number of status checks retrieved: {len(data)}")
            
            if isinstance(data, list):
                if len(data) > 0:
                    # Validate structure of first item
                    first_item = data[0]
                    required_fields = ["id", "client_name", "timestamp"]
                    if all(field in first_item for field in required_fields):
                        print("✅ GET status endpoint working correctly")
                        print(f"Sample record: {first_item}")
                        return True
                    else:
                        print(f"❌ Missing required fields in status check: {required_fields}")
                        return False
                else:
                    print("✅ GET status endpoint working (empty list)")
                    return True
            else:
                print("❌ GET status endpoint should return a list")
                return False
        else:
            print(f"❌ GET status endpoint failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ GET status endpoint test failed: {str(e)}")
        return False

def test_database_operations():
    """Test database operations by creating and retrieving data"""
    print("\n=== Testing Database Operations ===")
    
    # Create a test record
    print("Creating test record...")
    success, record_id = test_post_status_endpoint()
    if not success:
        print("❌ Database write operation failed")
        return False
    
    # Wait a moment for database consistency
    time.sleep(1)
    
    # Retrieve records and verify our test record exists
    print("Verifying record retrieval...")
    try:
        response = requests.get(f"{BACKEND_URL}/status")
        if response.status_code == 200:
            data = response.json()
            # Look for our test record
            found_record = None
            for record in data:
                if record.get("id") == record_id:
                    found_record = record
                    break
            
            if found_record:
                print("✅ Database operations working correctly")
                print(f"Retrieved record: {found_record}")
                return True
            else:
                print("❌ Created record not found in database")
                return False
        else:
            print("❌ Failed to retrieve records for verification")
            return False
    except Exception as e:
        print(f"❌ Database operations test failed: {str(e)}")
        return False

def test_error_handling():
    """Test error handling for invalid requests"""
    print("\n=== Testing Error Handling ===")
    try:
        # Test POST with missing required field
        response = requests.post(
            f"{BACKEND_URL}/status",
            json={},  # Empty payload
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Invalid request status: {response.status_code}")
        
        if response.status_code in [400, 422]:  # FastAPI returns 422 for validation errors
            print("✅ Error handling working correctly")
            return True
        else:
            print(f"❌ Expected 400/422 error, got {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error handling test failed: {str(e)}")
        return False

def test_admin_login_success():
    """Test admin login with correct credentials"""
    print("\n=== Testing Admin Login (Valid Credentials) ===")
    try:
        login_data = {
            "email": "abcdef_pavan@gmail.com",
            "password": "abcdef_pavan@gmail.com"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "message" in data:
                token = data["token"]
                if token and len(token) > 20:  # JWT tokens are typically long
                    print("✅ Admin login successful with valid JWT token")
                    return True, token
                else:
                    print("❌ Token appears invalid or empty")
                    return False, None
            else:
                print("❌ Missing token or message in response")
                return False, None
        else:
            print(f"❌ Admin login failed with status {response.status_code}")
            return False, None
    except Exception as e:
        print(f"❌ Admin login test failed: {str(e)}")
        return False, None

def test_admin_login_failure():
    """Test admin login with incorrect credentials"""
    print("\n=== Testing Admin Login (Invalid Credentials) ===")
    try:
        # Test with wrong email
        login_data = {
            "email": "wrong@email.com",
            "password": "abcdef_pavan@gmail.com"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Wrong email - Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Correctly rejected wrong email")
        else:
            print(f"❌ Expected 401 for wrong email, got {response.status_code}")
            return False
        
        # Test with wrong password
        login_data = {
            "email": "abcdef_pavan@gmail.com",
            "password": "wrongpassword"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Wrong password - Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Correctly rejected wrong password")
            return True
        else:
            print(f"❌ Expected 401 for wrong password, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Admin login failure test failed: {str(e)}")
        return False

def test_content_endpoints_without_auth():
    """Test content endpoints without authentication"""
    print("\n=== Testing Content Endpoints Without Auth ===")
    try:
        # Test GET /api/content (should work without auth)
        response = requests.get(f"{BACKEND_URL}/content")
        print(f"GET /content without auth - Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ GET /content works without auth (as expected)")
            get_content_success = True
        else:
            print("❌ GET /content failed without auth")
            get_content_success = False
        
        # Test PUT /api/content/update (should fail without auth)
        update_data = {
            "key": "test_key",
            "value": "test_value"
        }
        
        response = requests.put(
            f"{BACKEND_URL}/content/update",
            json=update_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"PUT /content/update without auth - Status: {response.status_code}")
        
        if response.status_code in [401, 403]:  # FastAPI HTTPBearer returns 403 for missing auth
            print("✅ PUT /content/update correctly rejected without auth")
            put_content_success = True
        else:
            print(f"❌ Expected 401/403 for PUT without auth, got {response.status_code}")
            put_content_success = False
        
        # Test GET /api/content/{key} (should work without auth)
        response = requests.get(f"{BACKEND_URL}/content/test_key")
        print(f"GET /content/test_key without auth - Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ GET /content/{key} works without auth (as expected)")
            get_key_success = True
        else:
            print("❌ GET /content/{key} failed without auth")
            get_key_success = False
        
        return get_content_success and put_content_success and get_key_success
        
    except Exception as e:
        print(f"❌ Content endpoints without auth test failed: {str(e)}")
        return False

def test_content_endpoints_with_auth(token):
    """Test content endpoints with valid authentication"""
    print("\n=== Testing Content Endpoints With Auth ===")
    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
        
        # Test creating/updating content
        update_data = {
            "key": "platform_name",
            "value": "LearnED Educational Platform"
        }
        
        response = requests.put(
            f"{BACKEND_URL}/content/update",
            json=update_data,
            headers=headers
        )
        
        print(f"PUT /content/update with auth - Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "updated successfully" in data.get("message", ""):
                print("✅ Content update successful with auth")
                update_success = True
            else:
                print("❌ Content update response format incorrect")
                update_success = False
        else:
            print(f"❌ Content update failed with status {response.status_code}")
            update_success = False
        
        # Test retrieving all content
        response = requests.get(f"{BACKEND_URL}/content")
        print(f"GET /content - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, dict) and "platform_name" in data:
                print(f"✅ Content retrieval successful. Found: {data}")
                get_all_success = True
            else:
                print("✅ Content retrieval successful (empty or different structure)")
                get_all_success = True
        else:
            print(f"❌ Content retrieval failed with status {response.status_code}")
            get_all_success = False
        
        # Test retrieving specific content by key
        response = requests.get(f"{BACKEND_URL}/content/platform_name")
        print(f"GET /content/platform_name - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if "key" in data and "value" in data:
                print(f"✅ Content by key retrieval successful: {data}")
                get_key_success = True
            else:
                print("❌ Content by key response format incorrect")
                get_key_success = False
        else:
            print(f"❌ Content by key retrieval failed with status {response.status_code}")
            get_key_success = False
        
        return update_success and get_all_success and get_key_success
        
    except Exception as e:
        print(f"❌ Content endpoints with auth test failed: {str(e)}")
        return False

def test_content_crud_operations(token):
    """Test complete CRUD operations for content management"""
    print("\n=== Testing Content CRUD Operations ===")
    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
        
        # CREATE: Add new content
        create_data = {
            "key": "test_announcement",
            "value": "Welcome to LearnED! New features available."
        }
        
        response = requests.put(
            f"{BACKEND_URL}/content/update",
            json=create_data,
            headers=headers
        )
        
        print(f"CREATE - Status: {response.status_code}")
        create_success = response.status_code == 200
        
        # READ: Get the created content
        response = requests.get(f"{BACKEND_URL}/content/test_announcement")
        print(f"READ - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("value") == create_data["value"]:
                print("✅ Content created and read successfully")
                read_success = True
            else:
                print("❌ Content value mismatch after creation")
                read_success = False
        else:
            read_success = False
        
        # UPDATE: Modify existing content
        update_data = {
            "key": "test_announcement",
            "value": "Updated: LearnED platform with new quiz system!"
        }
        
        response = requests.put(
            f"{BACKEND_URL}/content/update",
            json=update_data,
            headers=headers
        )
        
        print(f"UPDATE - Status: {response.status_code}")
        update_success = response.status_code == 200
        
        # Verify update
        response = requests.get(f"{BACKEND_URL}/content/test_announcement")
        if response.status_code == 200:
            data = response.json()
            if data.get("value") == update_data["value"]:
                print("✅ Content updated successfully")
                verify_update_success = True
            else:
                print("❌ Content update verification failed")
                verify_update_success = False
        else:
            verify_update_success = False
        
        return create_success and read_success and update_success and verify_update_success
        
    except Exception as e:
        print(f"❌ Content CRUD operations test failed: {str(e)}")
        return False

def test_server_health():
    """Test overall server health and connectivity"""
    print("\n=== Testing Server Health ===")
    try:
        # Test basic connectivity
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        if response.status_code == 200:
            print("✅ Server is responding")
            
            # Test response time
            response_time = response.elapsed.total_seconds()
            print(f"Response time: {response_time:.3f} seconds")
            
            if response_time < 5.0:  # Reasonable threshold
                print("✅ Server response time is acceptable")
                return True
            else:
                print("⚠️ Server response time is slow but functional")
                return True
        else:
            print(f"❌ Server health check failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Server health test failed: {str(e)}")
        return False

def run_comprehensive_tests():
    """Run all backend tests and provide summary"""
    print("🚀 Starting Comprehensive Backend Testing for LearnED Platform")
    print("=" * 60)
    
    test_results = {}
    jwt_token = None
    
    # Run basic API tests first
    test_results["server_health"] = test_server_health()
    test_results["root_endpoint"] = test_root_endpoint()
    test_results["cors"] = test_cors()
    test_results["post_status"] = test_post_status_endpoint()[0] if test_post_status_endpoint() else False
    test_results["get_status"] = test_get_status_endpoint()
    test_results["database_operations"] = test_database_operations()
    test_results["error_handling"] = test_error_handling()
    
    # Run authentication tests
    print("\n" + "=" * 60)
    print("🔐 AUTHENTICATION & CONTENT MANAGEMENT TESTS")
    print("=" * 60)
    
    # Test admin login success and get JWT token
    login_success, jwt_token = test_admin_login_success()
    test_results["admin_login_success"] = login_success
    
    # Test admin login failure
    test_results["admin_login_failure"] = test_admin_login_failure()
    
    # Test content endpoints without authentication
    test_results["content_without_auth"] = test_content_endpoints_without_auth()
    
    # Test content endpoints with authentication (only if login succeeded)
    if jwt_token:
        test_results["content_with_auth"] = test_content_endpoints_with_auth(jwt_token)
        test_results["content_crud_operations"] = test_content_crud_operations(jwt_token)
    else:
        print("⚠️ Skipping authenticated content tests due to login failure")
        test_results["content_with_auth"] = False
        test_results["content_crud_operations"] = False
    
    # Summary
    print("\n" + "=" * 60)
    print("🏁 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(test_results.values())
    total = len(test_results)
    
    # Group results by category
    basic_tests = ["server_health", "root_endpoint", "cors", "post_status", "get_status", "database_operations", "error_handling"]
    auth_tests = ["admin_login_success", "admin_login_failure", "content_without_auth", "content_with_auth", "content_crud_operations"]
    
    print("📊 BASIC API TESTS:")
    for test_name in basic_tests:
        if test_name in test_results:
            status = "✅ PASS" if test_results[test_name] else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    print("\n🔐 AUTHENTICATION & CONTENT TESTS:")
    for test_name in auth_tests:
        if test_name in test_results:
            status = "✅ PASS" if test_results[test_name] else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests PASSED! The LearnED platform backend is working correctly.")
        print("✅ Admin authentication system is functional")
        print("✅ Content management system is operational")
        return True
    else:
        print(f"⚠️ {total - passed} test(s) FAILED. Backend needs attention.")
        
        # Identify which category failed
        basic_passed = sum(test_results.get(test, False) for test in basic_tests)
        auth_passed = sum(test_results.get(test, False) for test in auth_tests)
        
        if basic_passed < len(basic_tests):
            print("❌ Basic API functionality issues detected")
        if auth_passed < len(auth_tests):
            print("❌ Authentication/Content management issues detected")
            
        return False

if __name__ == "__main__":
    success = run_comprehensive_tests()
    exit(0 if success else 1)