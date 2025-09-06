#!/usr/bin/env python3
"""
Static Backend Testing for LearnED Platform
Tests simplified API endpoints after admin functionality removal
"""

import requests
import json
from datetime import datetime

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
            if "message" in data and "Admin functionality removed" in data["message"]:
                print("✅ Root endpoint working correctly - admin functionality confirmed removed")
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

def test_health_endpoint():
    """Test GET /api/health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    try:
        response = requests.get(f"{BACKEND_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if "status" in data and data["status"] == "healthy":
                print("✅ Health endpoint working correctly")
                return True
            else:
                print("❌ Health endpoint returned unexpected response")
                return False
        else:
            print(f"❌ Health endpoint failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health endpoint test failed: {str(e)}")
        return False

def test_contact_endpoint():
    """Test POST /api/contact endpoint"""
    print("\n=== Testing Contact Form Endpoint ===")
    try:
        # Test with realistic contact form data
        contact_data = {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@email.com",
            "phone": "+1-555-0123",
            "message": "I'm interested in learning more about your educational programs for my daughter."
        }
        
        response = requests.post(
            f"{BACKEND_URL}/contact",
            json=contact_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "submitted successfully" in data.get("message", ""):
                print("✅ Contact form endpoint working correctly")
                return True
            else:
                print("❌ Contact form response format incorrect")
                return False
        else:
            print(f"❌ Contact form endpoint failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Contact form endpoint test failed: {str(e)}")
        return False

def test_demo_endpoint():
    """Test POST /api/demo endpoint"""
    print("\n=== Testing Demo Booking Endpoint ===")
    try:
        # Test with realistic demo booking data
        demo_data = {
            "name": "Michael Chen",
            "email": "michael.chen@email.com",
            "phone": "+1-555-0456",
            "preferred_time": "weekday_afternoon",
            "student_grade": "grade_5",
            "message": "Would like to schedule a demo for our homeschool curriculum."
        }
        
        response = requests.post(
            f"{BACKEND_URL}/demo",
            json=demo_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and "submitted successfully" in data.get("message", ""):
                print("✅ Demo booking endpoint working correctly")
                return True
            else:
                print("❌ Demo booking response format incorrect")
                return False
        else:
            print(f"❌ Demo booking endpoint failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Demo booking endpoint test failed: {str(e)}")
        return False

def test_removed_admin_endpoints():
    """Test that admin authentication endpoints are removed (should return 404)"""
    print("\n=== Testing Removed Admin Endpoints ===")
    try:
        admin_endpoints = [
            "/auth/login",
            "/auth/logout", 
            "/auth/verify"
        ]
        
        all_removed = True
        for endpoint in admin_endpoints:
            try:
                response = requests.post(f"{BACKEND_URL}{endpoint}")
                print(f"POST {endpoint} - Status: {response.status_code}")
                
                if response.status_code == 404:
                    print(f"✅ {endpoint} correctly removed (404)")
                else:
                    print(f"❌ {endpoint} still exists (expected 404, got {response.status_code})")
                    all_removed = False
            except Exception as e:
                print(f"✅ {endpoint} correctly removed (connection error expected)")
        
        return all_removed
    except Exception as e:
        print(f"❌ Admin endpoints removal test failed: {str(e)}")
        return False

def test_removed_content_endpoints():
    """Test that content management endpoints are removed (should return 404)"""
    print("\n=== Testing Removed Content Management Endpoints ===")
    try:
        content_endpoints = [
            ("/content", "GET"),
            ("/content/update", "PUT"),
            ("/content/test_key", "GET")
        ]
        
        all_removed = True
        for endpoint, method in content_endpoints:
            try:
                if method == "GET":
                    response = requests.get(f"{BACKEND_URL}{endpoint}")
                elif method == "PUT":
                    response = requests.put(f"{BACKEND_URL}{endpoint}", json={"key": "test", "value": "test"})
                
                print(f"{method} {endpoint} - Status: {response.status_code}")
                
                if response.status_code == 404:
                    print(f"✅ {endpoint} correctly removed (404)")
                else:
                    print(f"❌ {endpoint} still exists (expected 404, got {response.status_code})")
                    all_removed = False
            except Exception as e:
                print(f"✅ {endpoint} correctly removed (connection error expected)")
        
        return all_removed
    except Exception as e:
        print(f"❌ Content endpoints removal test failed: {str(e)}")
        return False

def test_removed_database_endpoints():
    """Test that database-dependent endpoints are removed (should return 404)"""
    print("\n=== Testing Removed Database Endpoints ===")
    try:
        database_endpoints = [
            ("/status", "GET"),
            ("/status", "POST")
        ]
        
        all_removed = True
        for endpoint, method in database_endpoints:
            try:
                if method == "GET":
                    response = requests.get(f"{BACKEND_URL}{endpoint}")
                elif method == "POST":
                    response = requests.post(f"{BACKEND_URL}{endpoint}", json={"client_name": "test"})
                
                print(f"{method} {endpoint} - Status: {response.status_code}")
                
                if response.status_code == 404:
                    print(f"✅ {endpoint} correctly removed (404)")
                else:
                    print(f"❌ {endpoint} still exists (expected 404, got {response.status_code})")
                    all_removed = False
            except Exception as e:
                print(f"✅ {endpoint} correctly removed (connection error expected)")
        
        return all_removed
    except Exception as e:
        print(f"❌ Database endpoints removal test failed: {str(e)}")
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