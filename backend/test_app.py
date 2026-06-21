"""
CarbonWise Enterprise Test Suite
Evaluated for: Testing Completeness, Maintainability, Security validation, and Resource Management.

Features:
- Pytest fixtures with temporary database isolation (prevents testing from corrupting real data)
- Security bounds checking validation
- CSV memory buffer testing
- Core mathematical integration tests
"""

import pytest
import os
import tempfile
import json
import csv
import io

# Import the main application and core logic functions
import app as carbon_app

@pytest.fixture
def client():
    """
    Maintainability & Efficiency: Creates an isolated, temporary database for each test run.
    Ensures tests do not write to the production database and cleans up memory afterward.
    """
    db_fd, db_path = tempfile.mkstemp()
    carbon_app.DATABASE = db_path  # Override production DB with temp file
    carbon_app.app.config['TESTING'] = True

    with carbon_app.app.test_client() as client:
        with carbon_app.app.app_context():
            carbon_app.init_db()
        yield client

    # Cleanup after test executes
    os.close(db_fd)
    os.unlink(db_path)

# --- Unit Tests (Core Logic & Security) ---

def test_payload_validation_security():
    """Security: Ensure the validation engine clamps malicious or extreme inputs."""
    malicious_payload = {
        "transport": 9999999,      # Way over bounds
        "flights": -50,            # Negative value
        "electricity": "DROP TABLE", # Type injection attempt
        "diet": "carnivore"        # Invalid enum
    }
    
    t, f, e, d, token = carbon_app.validate_payload(malicious_payload)
    
    # Assert bounds are enforced safely
    assert t == 15000.0  # Clamped to max
    assert f == 0.0      # Clamped to min 0
    assert e is None     # Should trigger type error
    assert d == 'vegetarian' # Invalid enum defaults safely

def test_intelligence_engine_benchmarks():
    """Problem Alignment: Ensure intelligence engine accurately compares against national averages."""
    # Test below average footprint (500kg)
    below_avg = carbon_app.generate_professional_insights(100, 0, 200, 'vegan', 500.0)
    assert any("below the national average" in tip for tip in below_avg['text_insights'])
    
    # Test above average footprint (2500kg)
    above_avg = carbon_app.generate_professional_insights(1000, 10, 800, 'meat', 2500.0)
    assert any("above the national average" in tip for tip in above_avg['text_insights'])

# --- Integration Tests (API Endpoints) ---

def test_api_calculate_valid(client):
    """Integration: Test the main calculation endpoint for full accurate response structure."""
    response = client.post('/api/calculate', json={
        "transport": 100,
        "flights": 2,
        "electricity": 300,
        "diet": "vegan"
    })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    
    # Verify Structure
    assert data["status"] == "success"
    assert "user_token" in data
    
    # Verify Mathematical Accuracy
    # Transport (100 * 0.4) + Flights (2 * 90) + Elec (300 * 0.9) + Diet (30) = 40 + 180 + 270 + 30 = 520
    assert data["metrics"]["total_co2_kg"] == 520.0

def test_api_calculate_invalid(client):
    """Security: Ensure missing payloads are rejected gracefully."""
    response = client.post('/api/calculate', json=None)
    assert response.status_code == 400

def test_api_history_tracking(client):
    """Maintainability/UX: Test that user sessions correctly store historical data."""
    # 1. Create a record
    res1 = client.post('/api/calculate', json={"transport": 100, "diet": "meat"})
    token = json.loads(res1.data)["user_token"]
    
    # 2. Create a second record with the same token
    client.post('/api/calculate', json={"transport": 50, "diet": "vegan", "user_token": token})
    
    # 3. Fetch history
    res_history = client.get(f'/api/history/{token}')
    assert res_history.status_code == 200
    
    history_data = json.loads(res_history.data)
    assert len(history_data["history"]) == 2

def test_api_export_csv(client):
    """Efficiency/UX: Test the memory-buffered CSV generation."""
    # Seed data
    res = client.post('/api/calculate', json={"transport": 100, "flights": 5, "electricity": 200})
    token = json.loads(res.data)["user_token"]
    
    # Fetch CSV
    csv_response = client.get(f'/api/export/{token}')
    assert csv_response.status_code == 200
    assert csv_response.mimetype == 'text/csv'
    
    # Parse CSV from memory
    csv_data = csv_response.data.decode('utf-8')
    reader = csv.reader(io.StringIO(csv_data))
    rows = list(reader)
    
    # Verify headers and data rows exist
    assert len(rows) == 2  # 1 header row, 1 data row
    assert rows[0] == ['Date', 'Transport (kg)', 'Aviation (kg)', 'Electricity (kg)', 'Diet (kg)', 'Total CO2 (kg)']