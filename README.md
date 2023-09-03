# T3 Social Network

## About
A basic social network built with the T3 stack using Next.js, NextAuth, Prisma, tRCP and Tailwind. This project is based on a tutorial from Web Dev Simplified.

## ToDo

### Features 
- [x] Re-create the application as it is in the tutorial
- [x] Add location to tweets
- [x] Add a button to delete tweets
  - [x] Add a button + hook + back to delete tweets
  - [x] Prevent users from deleting tweets that are not theirs
  - [x] Refetch tweets after deleting one
- [x] Enable full text search on tweets
- [x] Error handling (toast + modals)
- [x] Add skeleton loading
- [ ] Add a dark mode
- [ ] Update the front end of the login page
- [ ] ~~Create login page and add classic auth (email + password)~~
- [ ] Add image upload to tweets
- [ ] Add the possibility to reply to tweets
- [ ] Add emojis to tweets reactions
- [ ] Add a "Map" menu to the sidebar

### Fix & Refacto
- [x] Update the date format of tweets
- [x] No empty tweets
- [x] prevent users to add ampty tweets or tweets with more than 280 characters
- [x] Fix the style of the toasts
- [ ] Put the search button in the profile menu only + add counter 
- [ ] Fix the location of the tweets (when a part is missing) 

### CI/CD & Tech 
- [x] Create the repository on GitHub 
- [x] Create a database on PlanetScale
- [x] Deploy the application on Vercel 
- [ ] Add GoogleAuth authentication
- [ ] Add separate prod/dev databases