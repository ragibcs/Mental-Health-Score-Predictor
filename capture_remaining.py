import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://127.0.0.1:5173"
SCREENSHOT_DIR = "screenshots"

def capture_more():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()

        timestamp = int(time.time())
        user_email = f"calm_visual_{timestamp}@school.edu"
        user_pwd = "calmpassword123"

        # Register fresh user
        page.goto(f"{BASE_URL}/register")
        page.wait_for_load_state("networkidle")
        page.fill("input[name='name'], input[placeholder='e.g. Alex']", "Aria Thorne")
        page.fill("input[name='email'], input[placeholder='alex@school.edu']", user_email)
        page.fill("input[type='password']", user_pwd)
        page.click("button[type='submit']")
        page.wait_for_url("**/dashboard", timeout=8000)
        time.sleep(1)

        # Helper to set slider
        def set_val(target_page, selector, val):
            target_page.evaluate(f"""() => {{
                const el = document.querySelector('{selector}');
                if (el) {{
                    el.value = {val};
                    el.dispatchEvent(new Event('input', {{ bubbles: true }}));
                    el.dispatchEvent(new Event('change', {{ bubbles: true }}));
                }}
            }}""")

        # 1st assessment: Moderate score (Single-step page)
        page.goto(f"{BASE_URL}/assessment")
        page.wait_for_load_state("networkidle")
        page.fill("input[name='Age']", "21")
        page.click("button:has-text('Female')")
        page.select_option("select[name='country']", "Canada")
        page.select_option("select[name='academic_level']", "Undergraduate")
        page.click("button.platform-pill-btn:has-text('Youtube')")
        page.select_option("select[name='purpose_of_use']", "Education")
        page.fill("input[name='daily_unlocks']", "45")
        set_val(page, '#screen-time-slider', 3.0)
        set_val(page, '#sleep-hours-slider', 7.5)
        set_val(page, '#activity-hours-slider', 1.5)
        set_val(page, '#study-hours-slider', 5.0)
        page.click("button.stress-pill-btn:has-text('Low')")
        time.sleep(0.5)
        page.click("button:has-text('See my check-in')")
        page.wait_for_url("**/result", timeout=8000)
        time.sleep(1.5)

        # 2nd assessment: Higher wellbeing (Good / Balanced) (Single-step page)
        page.goto(f"{BASE_URL}/assessment")
        page.wait_for_load_state("networkidle")
        page.fill("input[name='Age']", "21")
        page.click("button:has-text('Female')")
        page.select_option("select[name='country']", "Canada")
        page.select_option("select[name='academic_level']", "Undergraduate")
        page.click("button.platform-pill-btn:has-text('Instagram')")
        page.select_option("select[name='purpose_of_use']", "Entertainment")
        page.fill("input[name='daily_unlocks']", "30")
        set_val(page, '#screen-time-slider', 2.0)
        set_val(page, '#sleep-hours-slider', 8.5)
        set_val(page, '#activity-hours-slider', 3.0)
        set_val(page, '#study-hours-slider', 6.0)
        page.click("button.stress-pill-btn:has-text('Low')")
        time.sleep(0.5)
        page.click("button:has-text('See my check-in')")
        page.wait_for_url("**/result", timeout=8000)
        time.sleep(1.5)

        # Capture Support / Crisis Modal from Result page
        page.click("button.need-support-link")
        time.sleep(0.8)
        page.screenshot(path=f"{SCREENSHOT_DIR}/18_support_crisis_modal_desktop.png")
        print("✓ Captured 18_support_crisis_modal_desktop.png")
        page.click("button:has-text('Close')")
        time.sleep(0.5)

        # 1. Desktop Dashboard with active ScoreTrend cubic spline curve
        page.goto(f"{BASE_URL}/dashboard")
        page.wait_for_load_state("networkidle")
        time.sleep(1.2)
        page.screenshot(path=f"{SCREENSHOT_DIR}/16_dashboard_with_trend_chart_desktop.png", full_page=True)
        print("✓ Captured 16_dashboard_with_trend_chart_desktop.png")

        # 2. History Page and Detail Modal
        page.goto(f"{BASE_URL}/history")
        page.wait_for_load_state("networkidle")
        time.sleep(1)
        # Click Details button on the first assessment card
        page.click("button:has-text('Details')")
        time.sleep(0.8)
        page.screenshot(path=f"{SCREENSHOT_DIR}/17_history_detail_modal_desktop.png")
        print("✓ Captured 17_history_detail_modal_desktop.png")
        page.click("button:has-text('Close')")
        time.sleep(0.5)

        # Save session for mobile
        storage = ctx.storage_state()
        ctx.close()

        # --- Mobile 390px captures ---
        m_ctx = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, storage_state=storage)
        m_page = m_ctx.new_page()

        # Mobile Dashboard
        m_page.goto(f"{BASE_URL}/dashboard")
        m_page.wait_for_load_state("networkidle")
        time.sleep(1.2)
        m_page.screenshot(path=f"{SCREENSHOT_DIR}/19_dashboard_mobile_logged_in_390.png", full_page=True)
        print("✓ Captured 19_dashboard_mobile_logged_in_390.png")

        # Mobile Assessment Single-Step (All 12 items on one mobile page)
        m_page.goto(f"{BASE_URL}/assessment")
        m_page.wait_for_load_state("networkidle")
        time.sleep(0.5)
        m_page.fill("input[name='Age']", "21")
        m_page.click("button:has-text('Female')")
        m_page.select_option("select[name='country']", "Canada")
        m_page.select_option("select[name='academic_level']", "Undergraduate")
        m_page.click("button.platform-pill-btn:has-text('Instagram')")
        m_page.select_option("select[name='purpose_of_use']", "Entertainment")
        m_page.fill("input[name='daily_unlocks']", "35")
        set_val(m_page, '#screen-time-slider', 2.5)
        set_val(m_page, '#sleep-hours-slider', 8.0)
        set_val(m_page, '#activity-hours-slider', 2.0)
        set_val(m_page, '#study-hours-slider', 5.0)
        m_page.click("button.stress-pill-btn:has-text('Low')")
        time.sleep(0.5)
        m_page.screenshot(path=f"{SCREENSHOT_DIR}/20_assessment_single_page_mobile_390.png", full_page=True)
        print("✓ Captured 20_assessment_single_page_mobile_390.png")

        # Submit to see Result on mobile 390px
        m_page.click("button:has-text('See my check-in')")
        m_page.wait_for_url("**/result", timeout=8000)
        time.sleep(1.5)
        m_page.screenshot(path=f"{SCREENSHOT_DIR}/22_result_mobile_390.png", full_page=True)
        print("✓ Captured 22_result_mobile_390.png")

        # Mobile History
        m_page.goto(f"{BASE_URL}/history")
        m_page.wait_for_load_state("networkidle")
        time.sleep(1)
        m_page.screenshot(path=f"{SCREENSHOT_DIR}/23_history_mobile_390.png", full_page=True)
        print("✓ Captured 23_history_mobile_390.png")

        m_ctx.close()
        browser.close()
        print("✓ All extended visual captures completed successfully!")

if __name__ == "__main__":
    capture_more()
