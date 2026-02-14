
from playwright.sync_api import sync_playwright
import os
import time

def run_uat():
    with sync_playwright() as p:
        # Launch browser - NOT headless so we can be sure it works, 
        # but wait, the environment might require headless. 
        # HEADLESS=True is safer for server environments.
        browser = p.chromium.launch(headless=True) 
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.type}: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"BROWSER ERROR: {exc}"))

        print("Navigating to login page...")
        page.goto('http://localhost:3000/login', wait_until='networkidle')
        page.screenshot(path='uat_1_login_page.png')

        print("Logging in...")
        page.fill('input[type="email"]', 'uat_seller_1771063235380@example.com')
        page.fill('input[type="password"]', 'Password123!')
        page.click('button[type="submit"]')
        
        # Wait for redirection to onboarding
        page.wait_for_url('**/onboarding', timeout=10000)
        page.wait_for_load_state('networkidle')
        print("Reached onboarding page.")
        page.screenshot(path='uat_2_onboarding_step1.png')

        # Step 1: Store Name
        print("Waiting for store name input...")
        try:
            # Using a more robust selector: looking for the input after the 'STORE NAME' label
            # or just the first text input
            page.wait_for_selector('input[placeholder*="Lumina"]', timeout=15000)
            print("Entering store name...")
            page.fill('input[placeholder*="Lumina"]', 'Easy Luxury Boutique')
            page.wait_for_timeout(1000) # Wait for debounce/slugify
            page.screenshot(path='uat_3_onboarding_name_filled.png')
            
            # Audit mobile responsiveness here
            print("Auditing mobile responsiveness...")
            page.set_viewport_size({'width': 375, 'height': 812})
            page.wait_for_timeout(500)
            page.screenshot(path='uat_3_onboarding_mobile.png')
            page.set_viewport_size({'width': 1280, 'height': 800}) # Back to desktop
        except Exception as e:
            print(f"Failed to find Store Name input: {e}")
            page.screenshot(path='uat_error_onboarding_render.png', full_page=True)
            browser.close()
            return
        
        # Click Continue/Next
        print("Proceeding to industry selection...")
        page.click('button:has-text("Continue To Next Step")')
        page.wait_for_timeout(1000)
        
        # Step 2: Industry
        print("Selecting industry...")
        page.wait_for_selector('text=Fashion & Apparel', timeout=5000)
        page.click('text=Fashion & Apparel')
        page.screenshot(path='uat_4_onboarding_industry_selected.png')
        
        # Click Create Store
        print("Creating store...")
        page.click('button:has-text("Create My Store")')
        
        # Wait for redirection to setup/dashboard
        print("Waiting for dashboard redirect...")
        try:
            # Redirection to /admin/setup
            page.wait_for_url('**/admin/**', timeout=20000)
            print(f"Final URL: {page.url}")
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(2000) # Wait for animations to settle
            
            # PHASE 6: DESIGN AUDIT (Layout)
            print("Auditing Bento Grid layout...")
            page.screenshot(path='audit_1_dashboard_bento.png', full_page=True)
            
            # PHASE 6: DESIGN AUDIT (Interactions)
            print("Auditing interactive states...")
            # Hover over the first visible card in the bento grid or nav
            # We assume cards have specific classes or roles
            first_card = page.locator('div[class*="rounded-"], div[role="button"]').first
            if first_card:
                first_card.hover()
                page.wait_for_timeout(500)
                page.screenshot(path='audit_2_hover_state.png')
            
            # PHASE 2: PRODUCT ENGINE
            print("Navigating to Products...")
            page.click('text=Products')
            page.wait_for_url('**/admin/products**', timeout=10000)
            page.wait_for_load_state('networkidle')
            page.screenshot(path='uat_6_product_list.png')
            
            # Click Add Product
            page.click('button:has-text("Add Product"), button:has-text("New Product")')
            page.wait_for_timeout(1000)
            page.screenshot(path='uat_7_product_form.png')

        except Exception as e:
            print(f"Redirection or execution failed: {e}")
            page.screenshot(path='uat_error_dashboard_flow.png', full_page=True)

        browser.close()

if __name__ == "__main__":
    run_uat()
