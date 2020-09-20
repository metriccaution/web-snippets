# To Do List

- Styling
  - This is still very rough
- Mobile view
  - This _really_ doesn't work on mobile right now
- Spell list uploading
  - Parity with [the old version of this](https://github.com/metriccaution/dnd-spell-cards)
  - Allows for using a custom, non-open licensed version of this, without putting it online
- Update spell data model
  - The current merging logic is very slow, on account of the amount of text-matching it needs to do
  - Adding a primary key to records, and merging based on that seems like a neater, quicker way to go
