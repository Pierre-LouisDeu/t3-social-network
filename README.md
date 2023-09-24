# T3 Social Network

## About

A basic social network built with the T3 stack using Next.js, NextAuth, Prisma, tRCP and Tailwind. This project is based on a tutorial from Web Dev Simplified.

## Notes

- component: `sfc`
- useEffect: `uef`
- useState: `usfc`

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
- [x] Add the possibility to reply to tweets
  - [x] Create new pages "tweets/[tweetId]"
  - [x] Add a reply button to each tweet
  - [x] Redirect full-text search to the tweet
  - [x] Add the reply feature
  - [x] Fix like refetch
  - [ ] Update front end of the comment page
- [ ] Add image upload to tweets with [uploadthings](https://uploadthing.com/dashboard)
  - [x] Add a button to upload images
  - [x] Add a modal to upload images
  - [x] Update front to handle images in tweets
  - [ ] Add images to comments
  - [ ] Delete images automatically in [uploadthings](https://uploadthing.com/dashboard)
- [ ] Add websockets and real-time chat
- [ ] Add error pages (error 404, etc.)
- [ ] Responsive design
- [ ] Update the front end of the login page
- [ ] Add emojis to tweets reactions
- [ ] ~~Add a dark mode~~
- [ ] ~~Add classic auth (with [clerk](https://clerk.com))~~

### Fix & Refacto

- [x] Update the date format of tweets
- [x] No empty tweets
- [x] prevent users to add ampty tweets or tweets with more than 280 characters
- [x] Fix the style of the toasts
- [x] Fix the location of the tweets (when a part is missing)
- [x] Fix the toasts color (500 -> 400)
- [x] Fix useless full-text search queries
- [ ] Update error handling in tweets list
- [ ] Put the search button in the profile menu only + add counter
- [ ] Refacto DS

### CI/CD & Tech

- [x] Create the repository on GitHub
- [x] Create a database on PlanetScale
- [x] Deploy the application on Vercel
- [ ] Add GoogleAuth authentication
- [ ] Add separate prod/dev databases
