# E-Commerce Website

## Assumptions

- Each item has a quantity of 1. Items are sold as units and cannot be sold in bulk (e.g., cannot list 5 biscuits and allow a buyer to buy 3).
- Only users with an IIIT domain email can register.
- OTP is flashed upon regeneration and only its hash is stored.
- Both pending and completed orders are visible to the user.
- Reviews can only be made after an order is completed.
- Items that are placed for order are updated to status "sold" and do not appear in the view of other buyers or the seller.
- The seller can only delete an item if it has not been placed for order.
- The chatbot feauture is only available at home component
