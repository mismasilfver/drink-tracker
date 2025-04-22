# Drink Tracker 1.0

## Overview

A simple web application that allows users to track their bar tab in places
with less than perfect service.

This is a first trial of Cursor.ai and it's capabilities of agentic mode, ask mode.

## Features

- Uses local storate to keep track of state on user's device.

- Simple Mode:

  - Single drink counter
  - Add/subtract drinks with dedicated buttons
  - Reset counter functionality
  - Clean, minimalist interface

- Advanced Mode:

  - Track multiple drink types (alcoholic drinks, sodas, fun drinks)
  - Separate counters with emoji indicators
  - Add/subtract functionality for each drink type
  - Toggle between Simple and Advanced modes via header icon

- Responsive Design:
  - Modern, dark theme UI
  - Smooth transitions between modes
  - Mobile-friendly layout
  - Tactile button feedback

## Future Features

- Fix the layout of the reset button
- Fix the layout of the plus and minus buttons
- Fix the mobile viewport issue due to buttons not being responsive enough
- Add ability to view the log of clicks DONE
- Add button for staff drinks
- Add picture capability when clicking add button
- Set baseline price for each drink to be shown in the entry log
- ? Refactor the views to different files for better management

# Drink Tracker 1.1

- _FEATURE_ ADDED: log function that keeps track of when drink was added, removing latest addition if decrease is pressed
- ADDED: Debugging logs.

# Drink Tracker 1.1.1

- Fixed the order of the icons
- Added the flip animation back to the advanced mode toggle
