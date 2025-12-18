# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]
    - main [ref=e4]:
      - table [ref=e9]:
        - rowgroup [ref=e10]:
          - row "Payout ID Date Bank Account Amount Status" [ref=e11]:
            - columnheader "Payout ID" [ref=e12]
            - columnheader "Date" [ref=e13]
            - columnheader "Bank Account" [ref=e14]
            - columnheader "Amount" [ref=e15]
            - columnheader "Status" [ref=e16]
        - rowgroup [ref=e17]:
          - row "po_123 2023-10-25 GTBank •••• 1234 NGN 50,000 PAID" [ref=e18]:
            - cell "po_123" [ref=e19]
            - cell "2023-10-25" [ref=e20]
            - cell "GTBank •••• 1234" [ref=e21]
            - cell "NGN 50,000" [ref=e22]
            - cell "PAID" [ref=e23]:
              - generic [ref=e24]: PAID
          - row "po_124 2023-11-01 GTBank •••• 1234 NGN 25,000 PROCESSING" [ref=e25]:
            - cell "po_124" [ref=e26]
            - cell "2023-11-01" [ref=e27]
            - cell "GTBank •••• 1234" [ref=e28]
            - cell "NGN 25,000" [ref=e29]
            - cell "PROCESSING" [ref=e30]:
              - generic [ref=e31]: PROCESSING
  - alert [ref=e32]
```