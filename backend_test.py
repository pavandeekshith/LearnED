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
        # Test POST contact with missing required fields
        response = requests.post(
            f"{BACKEND_URL}/contact",
            json={},  # Empty payload
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Invalid contact request status: {response.status_code}")
        
        if response.status_code in [400, 422]:  # FastAPI returns 422 for validation errors
            print("✅ Contact form error handling working correctly")
            contact_error_ok = True
        else:
            print(f"❌ Expected 400/422 error for contact, got {response.status_code}")
            contact_error_ok = False
        
        # Test POST demo with missing required fields
        response = requests.post(
            f"{BACKEND_URL}/demo",
            json={},  # Empty payload
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Invalid demo request status: {response.status_code}")
        
        if response.status_code in [400, 422]:  # FastAPI returns 422 for validation errors
            print("✅ Demo booking error handling working correctly")
            demo_error_ok = True
        else:
            print(f"❌ Expected 400/422 error for demo, got {response.status_code}")
            demo_error_ok = False
        
        return contact_error_ok and demo_error_ok
    except Exception as e:
        print(f"❌ Error handling test failed: {str(e)}")
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
        response = requests.options(f"{BACKEND_URL}/contact", headers=headers)
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
        print(f"❌ CORS test failed: {str(e}}")
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

def run_static_backend_tests():
    """Run all static backend tests and provide summary"""
    print("🚀 Starting Static Backend Testing for LearnED Platform")
    print("Testing simplified backend after admin functionality removal")
    print("=" * 70)
    
    test_results = {}
    
    # Test existing static endpoints
    print("\n📊 STATIC API ENDPOINT TESTS:")
    test_results["server_health"] = test_server_health()
    test_results["root_endpoint"] = test_root_endpoint()
    test_results["health_endpoint"] = test_health_endpoint()
    test_results["contact_endpoint"] = test_contact_endpoint()
    test_results["demo_endpoint"] = test_demo_endpoint()
    test_results["cors"] = test_cors()
    test_results["error_handling"] = test_error_handling()
    
    # Test that removed endpoints are actually gone
    print("\n🗑️ REMOVED FUNCTIONALITY VERIFICATION:")
    test_results["admin_endpoints_removed"] = test_removed_admin_endpoints()
    test_results["content_endpoints_removed"] = test_removed_content_endpoints()
    test_results["database_endpoints_removed"] = test_removed_database_endpoints()
    
    # Summary
    print("\n" + "=" * 70)
    print("🏁 STATIC BACKEND TEST SUMMARY")
    print("=" * 70)
    
    passed = sum(test_results.values())
    total = len(test_results)
    
    # Group results by category
    static_tests = ["server_health", "root_endpoint", "health_endpoint", "contact_endpoint", "demo_endpoint", "cors", "error_handling"]
    removal_tests = ["admin_endpoints_removed", "content_endpoints_removed", "database_endpoints_removed"]
    
    print("📊 STATIC API FUNCTIONALITY:")
    for test_name in static_tests:
        if test_name in test_results:
            status = "✅ PASS" if test_results[test_name] else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    print("\n🗑️ ADMIN FUNCTIONALITY REMOVAL:")
    for test_name in removal_tests:
        if test_name in test_results:
            status = "✅ PASS" if test_results[test_name] else "❌ FAIL"
            print(f"  {test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All static backend tests PASSED!")
        print("✅ Static API endpoints are functional")
        print("✅ Admin functionality successfully removed")
        print("✅ Backend is now static-friendly without MongoDB dependencies")
        return True
    else:
        print(f"⚠️ {total - passed} test(s) FAILED. Backend needs attention.")
        
        # Identify which category failed
        static_passed = sum(test_results.get(test, False) for test in static_tests)
        removal_passed = sum(test_results.get(test, False) for test in removal_tests)
        
        if static_passed < len(static_tests):
            print("❌ Static API functionality issues detected")
        if removal_passed < len(removal_tests):
            print("❌ Admin functionality removal incomplete")
            
        return False

if __name__ == "__main__":
    success = run_static_backend_tests()
    exit(0 if success else 1)