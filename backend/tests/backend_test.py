"""Backend API tests for Asphalt Armour."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://asphal-armour.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@asphaltarmour.com"
ADMIN_PASSWORD = "admin123"


@pytest.fixture(scope="session")
def public_session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def auth_session():
    """Authenticated session via login (cookie-based)."""
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return s


# ---------- Health ----------
class TestHealth:
    def test_root(self, public_session):
        r = public_session.get(f"{API}/")
        assert r.status_code == 200
        assert "message" in r.json()


# ---------- Auth ----------
class TestAuth:
    def test_login_bad_credentials(self, public_session):
        r = public_session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrongpass"})
        assert r.status_code == 401

    def test_login_success_sets_cookie(self, public_session):
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert "access_token" in s.cookies.get_dict()

    def test_me_without_cookie(self, public_session):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_cookie(self, auth_session):
        r = auth_session.get(f"{API}/auth/me")
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_logout_clears_cookie(self):
        s = requests.Session()
        s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        r = s.post(f"{API}/auth/logout")
        assert r.status_code == 200
        # /me should be 401 after logout
        r2 = s.get(f"{API}/auth/me")
        assert r2.status_code == 401


# ---------- Quotes ----------
class TestQuotes:
    quote_id = None

    def test_create_quote_public(self, public_session):
        payload = {
            "name": f"TEST_User_{uuid.uuid4().hex[:6]}",
            "email": "test_quote@example.com",
            "phone": "555-1234",
            "address": "123 Test St",
            "service_type": "sealcoating",
            "property_type": "residential",
            "square_footage": "1500",
            "notes": "TEST quote",
        }
        r = public_session.post(f"{API}/quotes", json=payload)
        assert r.status_code == 201, r.text
        d = r.json()
        assert d["status"] == "new"
        assert d["name"] == payload["name"]
        assert "id" in d
        TestQuotes.quote_id = d["id"]

    def test_list_quotes_unauthorized(self):
        r = requests.get(f"{API}/quotes")
        assert r.status_code == 401

    def test_list_quotes_authorized(self, auth_session):
        r = auth_session.get(f"{API}/quotes")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert any(q["id"] == TestQuotes.quote_id for q in data)

    def test_update_status_valid(self, auth_session):
        assert TestQuotes.quote_id
        r = auth_session.patch(f"{API}/quotes/{TestQuotes.quote_id}/status", json={"status": "contacted"})
        assert r.status_code == 200
        assert r.json()["status"] == "contacted"

    def test_update_status_invalid(self, auth_session):
        assert TestQuotes.quote_id
        r = auth_session.patch(f"{API}/quotes/{TestQuotes.quote_id}/status", json={"status": "bogus"})
        assert r.status_code == 400

    def test_update_status_unauthorized(self):
        r = requests.patch(f"{API}/quotes/{TestQuotes.quote_id}/status", json={"status": "quoted"})
        assert r.status_code == 401


# ---------- Contact ----------
class TestContact:
    contact_id = None

    def test_create_contact_public(self, public_session):
        payload = {
            "name": f"TEST_Contact_{uuid.uuid4().hex[:6]}",
            "email": "test_contact@example.com",
            "phone": "555-9999",
            "message": "TEST contact message",
        }
        r = public_session.post(f"{API}/contact", json=payload)
        assert r.status_code == 201, r.text
        d = r.json()
        assert d["is_read"] is False
        assert d["message"] == payload["message"]
        TestContact.contact_id = d["id"]

    def test_list_contact_unauthorized(self):
        r = requests.get(f"{API}/contact")
        assert r.status_code == 401

    def test_list_contact_authorized(self, auth_session):
        r = auth_session.get(f"{API}/contact")
        assert r.status_code == 200
        assert any(c["id"] == TestContact.contact_id for c in r.json())

    def test_mark_read(self, auth_session):
        r = auth_session.patch(f"{API}/contact/{TestContact.contact_id}/read")
        assert r.status_code == 200
        assert r.json()["is_read"] is True
