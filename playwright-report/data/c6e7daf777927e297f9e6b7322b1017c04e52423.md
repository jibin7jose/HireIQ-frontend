# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: job-pipeline.spec.ts >> Job Pipeline Flow >> should allow an employer to create a job and a candidate to apply
- Location: tests\integration\job-pipeline.spec.ts:6:7

# Error details

```
Test timeout of 120000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - banner [ref=f1e2]:
    - generic [ref=f1e3]:
      - link "CareerConnect" [ref=f1e4] [cursor=pointer]:
        - /url: /
      - navigation [ref=f1e5]:
        - link "Find Jobs" [ref=f1e6] [cursor=pointer]:
          - /url: /jobs
        - link "For Employers" [ref=f1e7] [cursor=pointer]:
          - /url: /employer
      - generic [ref=f1e8]:
        - link "Sign In" [ref=f1e9] [cursor=pointer]:
          - /url: /auth/login
        - link "Get Started" [ref=f1e10] [cursor=pointer]:
          - /url: /auth/register
  - main [ref=f1e11]:
    - generic [ref=f1e13]:
      - generic [ref=f1e14]:
        - heading "CareerConnect AI" [level=1] [ref=f1e15]
        - paragraph [ref=f1e16]: Your next career move, powered by AI
      - generic [ref=f1e19]:
        - generic [ref=f1e20]:
          - heading "Welcome back" [level=2] [ref=f1e21]
          - paragraph [ref=f1e22]: Enter your details to sign in to your account
        - generic [ref=f1e23]:
          - generic [ref=f1e24]:
            - textbox "Email address" [ref=f1e29]
            - textbox "Password" [ref=f1e34]
          - generic [ref=f1e35]:
            - generic [ref=f1e36] [cursor=pointer]:
              - checkbox "Remember me" [ref=f1e37]
              - generic [ref=f1e38]: Remember me
            - link "Forgot password?" [ref=f1e39] [cursor=pointer]:
              - /url: "#"
          - button "Sign In" [ref=f1e40]
        - generic [ref=f1e44]:
          - text: Don't have an account?
          - link "Sign up" [ref=f1e45] [cursor=pointer]:
            - /url: /auth/register
  - contentinfo [ref=f1e46]:
    - generic [ref=f1e47]:
      - generic [ref=f1e48]:
        - generic [ref=f1e49]:
          - generic [ref=f1e50]: CareerConnect
          - paragraph [ref=f1e51]: Connecting talent with opportunity through AI.
        - generic [ref=f1e52]:
          - link "Privacy Policy" [ref=f1e53] [cursor=pointer]:
            - /url: "#"
          - link "Terms" [ref=f1e54] [cursor=pointer]:
            - /url: "#"
          - link "Contact" [ref=f1e55] [cursor=pointer]:
            - /url: "#"
      - paragraph [ref=f1e56]: © 2026 CareerConnect AI. All rights reserved.
  - generic [ref=f1e61] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=f1e62]
    - generic [ref=f1e66]:
      - button "Open issues overlay" [ref=f1e67]:
        - generic [ref=f1e68]:
          - generic [ref=f1e69]: "1"
          - generic [ref=f1e70]: "2"
        - generic [ref=f1e71]:
          - text: Issue
          - generic [ref=f1e72]: s
      - button "Collapse issues badge" [ref=f1e73]
  - alert [ref=f1e76]
```