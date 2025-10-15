from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:4200")

        # Fill in the request details
        page.get_by_placeholder("Enter request URL").fill("https://jsonplaceholder.typicode.com/todos/1")

        # Send the request
        page.get_by_role("button", name="Send").click()

        # Wait for the response to be displayed
        page.wait_for_selector("app-response-viewer")

        # Take a screenshot
        page.screenshot(path="jules-scratch/verification/verification.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)