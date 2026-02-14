import asyncio
from playwright.async_api import async_playwright

async def run_quick_pass():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()
        
        # 1. Homepage
        print("Checking Homepage...")
        await page.goto("http://localhost:3000", wait_until="networkidle")
        await page.screenshot(path="verify_1_homepage.png")
        
        # 2. Storefront (using discovered slug)
        print("Checking Storefront...")
        await page.goto("http://localhost:3000/store/bharat-success-store", wait_until="networkidle")
        await page.screenshot(path="verify_2_storefront.png")
        
        # 3. Admin Login
        print("Checking Admin Login...")
        await page.goto("http://localhost:3000/login", wait_until="networkidle")
        await page.screenshot(path="verify_3_admin_login.png")
        
        await browser.close()
        print("Quick pass completed.")

if __name__ == "__main__":
    asyncio.run(run_quick_pass())
