# socialbore

Socialbore uses a headless Chrome browser to browse Facebook feeds on a regular basis. Each post found is parsed and saved into a database. A server listens and serves an RSS feed from this database at http://127.0.0.1:3000.

## Setup

```bash
# install dependencies
npm install

# set your facebook login/password
# (not required for public feeds)
export SOCIALBORE_USERNAME=user@example.org
export SOCIALBORE_PASSWORD=secret

# (temporary)
# if you want another feed besides your home page,
# edit borer.js line ~56 and change the url

# start the boring daemon and rss server
npm start

# RSS XML is now available at http://127.0.0.1:3000
```
