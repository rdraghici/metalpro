# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e8]
      - heading "Back-Office Login" [level=3] [ref=e12]
      - paragraph [ref=e13]: Sign in to access the MetalPro back-office system
    - generic [ref=e14]:
      - generic [ref=e15]:
        - alert [ref=e16]:
          - generic [ref=e17]: HTTP 401
        - generic [ref=e18]:
          - text: Email
          - textbox "Email" [ref=e19]:
            - /placeholder: operator@metalpro.com
            - text: admin@metalpro.ro
        - generic [ref=e20]:
          - text: Password
          - textbox "Password" [ref=e21]:
            - /placeholder: Enter your password
            - text: operator123
        - button "Sign In" [ref=e22] [cursor=pointer]
      - paragraph [ref=e24]: This is a secure area. Unauthorized access is prohibited.
```