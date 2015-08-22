# Open issues

## Currently working

Finish explore function; returning result list, etc.

## Todo

- Populate HUD with planet info and status info.
- Initialize `explored` data array with appropriate objects at creation.
- Add display of planet traits to planet info and docked screens
- Update starfield as ship travels
- Refactor status/planet panel in HUD to ease layout
- Add random encounters when traveling between planets
- Add random effects during travel (maybe a function of the above)
- Add back ability to pan map
- Draw line between current planet and target planet when on travel screen

## Bugs

- Starfield will still parallax scroll even if camera is pinned to world bounds
- There is some sort of inivisble button on the screen at about (400,450).
This problem may go away if I refactor the HUD code after all.