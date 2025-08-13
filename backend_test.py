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
BACKEND_URL = "https://quick-preview-17.preview.emergentagent.com/api"

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
    
    # Run all tests
    test_results["server_health"] = test_server_health()
    test_results["root_endpoint"] = test_root_endpoint()
    test_results["cors"] = test_cors()
    test_results["post_status"] = test_post_status_endpoint()[0] if test_post_status_endpoint() else False
    test_results["get_status"] = test_get_status_endpoint()
    test_results["database_operations"] = test_database_operations()
    test_results["error_handling"] = test_error_handling()
    
    # Summary
    print("\n" + "=" * 60)
    print("🏁 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(test_results.values())
    total = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall Result: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All backend tests PASSED! The LearnED platform backend is working correctly.")
        return True
    else:
        print(f"⚠️ {total - passed} test(s) FAILED. Backend needs attention.")
        return False

if __name__ == "__main__":
    success = run_comprehensive_tests()
    exit(0 if success else 1)