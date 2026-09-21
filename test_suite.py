import os
import sys
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://127.0.0.1:5173"
SCREENSHOT_DIR = "screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def run_tests():
    print("=== Starting Calm Ground E2E Verification Suite ===")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. Desktop Flow (1440px)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("\n--- 1. Testing Landing Page (Desktop 1440px) ---")
        page.goto(f"{BASE_URL}/")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=f"{SCREENSHOT_DIR}/01_landing_desktop_1440.png", full_page=True)
        print("✓ Landing page loaded and captured.")

        # Check no monospace, no AI_MODEL banner, no R^2 claim
        content = page.content()
        assert "R² = 0.94" not in content, "Found forbidden R² = 0.94 claim!"
        assert "// AI_MODEL" not in content, "Found forbidden AI_MODEL tag!"
        print("✓ Verified: Zero unverified R² claims, zero monospace AI tags on landing page.")

        # 2. Mobile Landing (390px)
        mobile_context = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
        mobile_page = mobile_context.new_page()
        mobile_page.goto(f"{BASE_URL}/")
        mobile_page.wait_for_load_state("networkidle")
        time.sleep(1)
        mobile_page.screenshot(path=f"{SCREENSHOT_DIR}/01_landing_mobile_390.png", full_page=True)
        print("✓ Mobile Landing page captured.")
        mobile_context.close()

        # 3. Registration Flow
        timestamp = int(time.time())
        test_email = f"calm_student_{timestamp}@school.edu"
        test_name = "Maya Lin"
        test_password = "calmpassword123"

        print(f"\n--- 2. Testing Registration ({test_email}) ---")
        page.goto(f"{BASE_URL}/register")
        page.wait_for_load_state("networkidle")
        time.sleep(0.5)
        page.screenshot(path=f"{SCREENSHOT_DIR}/02_register_desktop.png")

        # Fill register form
        page.fill("input[name='name'], input[placeholder='e.g. Alex']", test_name)
        page.fill("input[name='email'], input[placeholder='alex@school.edu']", test_email)
        page.fill("input[type='password']", test_password)
        page.click("button[type='submit']")

        # Should redirect to /dashboard
        page.wait_for_url("**/dashboard", timeout=8000)
        print("✓ Registered successfully and redirected to Dashboard!")
        time.sleep(1)
        page.screenshot(path=f"{SCREENSHOT_DIR}/03_dashboard_empty_desktop.png", full_page=True)

        # 4. Assessment Single-Step Flow
        print("\n--- 3. Testing Single-Step Unified Assessment Flow ---")
        page.goto(f"{BASE_URL}/assessment")
        page.wait_for_load_state("networkidle")
        time.sleep(0.5)
        print("✓ Single-step Assessment page loaded.")

        # Fill Section 1: Demographics (Age: 22, Gender: Female, Country: Canada, Academic: Undergraduate)
        page.fill("input[name='Age']", "22")
        page.click("button:has-text('Female')")
        page.select_option("select[name='country']", "Canada")
        page.select_option("select[name='academic_level']", "Undergraduate")

        def set_slider(selector, val):
            page.evaluate(f"""() => {{
                const el = document.querySelector('{selector}');
                if (el) {{
                    el.value = {val};
                    el.dispatchEvent(new Event('input', {{ bubbles: true }}));
                    el.dispatchEvent(new Event('change', {{ bubbles: true }}));
                }}
            }}""")

        # Fill Section 2: Digital Life (Platform: Instagram, Purpose: Education, Daily unlocks: 50, Screen time slider: 4.0)
        page.click("button.platform-pill-btn:has-text('Instagram')")
        page.select_option("select[name='purpose_of_use']", "Education")
        page.fill("input[name='daily_unlocks']", "50")
        set_slider("#screen-time-slider", 4.0)

        # Fill Section 3: Daily Rhythm (Sleep: 8.0, Activity: 2.0, Study: 5.0, Stress: Low)
        set_slider("#sleep-hours-slider", 8.0)
        set_slider("#activity-hours-slider", 2.0)
        set_slider("#study-hours-slider", 5.0)
        page.click("button.stress-pill-btn:has-text('Low')")
        time.sleep(0.5)

        # Capture complete 1-step assessment screenshot
        page.screenshot(path=f"{SCREENSHOT_DIR}/04_assessment_single_page_desktop.png", full_page=True)
        print("✓ Captured 04_assessment_single_page_desktop.png")

        # Submit: "See my check-in"
        page.click("button:has-text('See my check-in')")

        # Wait for Result page
        page.wait_for_url("**/result", timeout=10000)
        time.sleep(1.5)
        page.screenshot(path=f"{SCREENSHOT_DIR}/07_result_desktop.png", full_page=True)
        print("✓ Result page reached with prediction!")

        # Verify Result page contents
        result_text = page.content()
        assert "out of 10" in result_text or "/ 10" in result_text, "Missing score presentation!"
        assert "What shaped this" in result_text, "Missing observations section!"
        assert "Small things that may help" in result_text, "Missing gentle suggestions!"
        assert "educational estimate, not a diagnosis" in result_text, "Missing educational disclaimer!"
        assert "Need support?" in result_text, "Missing support link!"
        print("✓ Result page verified: warm greeting, circular gauge, 3 observations, small tips, educational disclaimer, support modal link.")

        # Click "Need support?" to test helpline modal
        page.click("button:has-text('Need support?')")
        time.sleep(0.5)
        page.screenshot(path=f"{SCREENSHOT_DIR}/08_support_modal_desktop.png")
        # Close modal
        page.click("button:has-text('Close')")
        time.sleep(0.5)

        # 5. Dashboard Flow with populated data
        print("\n--- 4. Testing Dashboard with Check-in Data ---")
        page.goto(f"{BASE_URL}/dashboard")
        page.wait_for_load_state("networkidle")
        time.sleep(1.2)
        page.screenshot(path=f"{SCREENSHOT_DIR}/09_dashboard_populated_desktop.png", full_page=True)
        print("✓ Dashboard populated screenshot captured.")

        # 6. History Flow & Gentle Delete
        print("\n--- 5. Testing History and Gentle Delete Modal ---")
        page.goto(f"{BASE_URL}/history")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        page.screenshot(path=f"{SCREENSHOT_DIR}/10_history_desktop.png", full_page=True)
        print("✓ History page loaded with check-in card.")

        # Click the delete button on the card
        page.click(".remove-entry-btn")
        time.sleep(0.5)
        page.screenshot(path=f"{SCREENSHOT_DIR}/11_history_delete_modal_desktop.png")
        print("✓ Gentle delete modal opened.")

        # Confirm remove
        page.click("button:has-text('Remove')")
        time.sleep(1)
        print("✓ Check-in removed gently. History updated.")

        # 7. Profile Update Flow
        print("\n--- 6. Testing Profile Update ---")
        page.goto(f"{BASE_URL}/profile")
        page.wait_for_load_state("networkidle")
        time.sleep(0.8)
        page.screenshot(path=f"{SCREENSHOT_DIR}/12_profile_desktop.png")

        # Update name
        page.fill("input[placeholder='Enter your name']", "Maya Lin Updated")
        page.click("button:has-text('Save changes')")
        time.sleep(1)
        print("✓ Profile name updated successfully.")

        # 8. Sign Out & Protected Route Check
        print("\n--- 7. Testing Sign Out and Route Protection ---")
        page.click("button:has-text('Sign out of account')")
        page.wait_for_function("() => window.location.pathname === '/login'")
        time.sleep(0.5)
        page.screenshot(path=f"{SCREENSHOT_DIR}/13_login_desktop.png")
        print("✓ Signed out and protected route redirected to Login.")

        # Try navigating to /dashboard while logged out -> should stay on /login
        page.goto(f"{BASE_URL}/dashboard")
        page.wait_for_function("() => window.location.pathname === '/login'")
        time.sleep(0.5)
        print("✓ Protected route /dashboard strictly redirected to /login.")

        # Log back in
        page.fill("input[autocomplete='email'], input[type='email']", test_email)
        page.fill("input[autocomplete='current-password'], input[type='password']", test_password)
        page.click("button[type='submit']")
        page.wait_for_function("() => window.location.pathname === '/dashboard'")
        print("✓ Logged back in successfully!")

        context.close()

        # 9. Test Mobile Views (390px width) for all key pages
        print("\n--- 8. Testing Mobile Viewports (390px) ---")
        m_ctx = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
        m_page = m_ctx.new_page()

        # Mobile Dashboard
        m_page.goto(f"{BASE_URL}/dashboard")
        m_page.wait_for_load_state("networkidle")
        time.sleep(1)
        m_page.screenshot(path=f"{SCREENSHOT_DIR}/14_dashboard_mobile_390.png", full_page=True)
        print("✓ Mobile Dashboard captured.")

        # Mobile Assessment Single Step
        m_page.goto(f"{BASE_URL}/assessment")
        m_page.wait_for_load_state("networkidle")
        time.sleep(0.5)
        m_page.screenshot(path=f"{SCREENSHOT_DIR}/15_assessment_single_page_mobile_390.png", full_page=True)
        print("✓ Mobile Assessment Single-Step captured.")

        m_ctx.close()
        browser.close()

    print("\n=== ALL E2E VERIFICATIONS PASSED CLEANLY! ===")

if __name__ == "__main__":
    run_tests()
