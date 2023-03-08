
# ZAREA

FRONT URL: https://zarea.fr

API URL: https://api.zarea.fr

The goal of this project is to discover, as a whole, the software platform that you have chosen through the
creation of a business application.
This software suite is broke into three parts :
- An application server
- A web client
- A mobile client
## Authors

- [@cmonteiro-ep](https://www.github.com/cmonteiro-ep)
- [@OxYz0n3](https://www.github.com/OxYz0n3)
- [@LunessFr](https://www.github.com/LunessFr)
- [@varakdom](https://www.github.com/varakdom)



## Installation

Run project with docker-compose at root of the project

```bash
  sudo docker-compose build
```
    
## Usage

The application will offer the following funtionalities:
- The user registers on the application in order to obtain an account
- The registered user then confirms their enrollment on the application before being able to use it
- The application then asks the authenticated user to subscribe to Services
- Each service offers the following components:
- type Action
- type REAction
- The authenticated user composes AREA by interconnecting an Action to a REAction previously configured
- The application triggers AREA automatically thanks to triggers
## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Primary | ![#26547c](https://via.placeholder.com/10/26547c?text=+) #26547c |
| Secondary | ![#fffcf9](https://via.placeholder.com/10/fffcf9?text=+) #fffcf9 |
| Main succes | ![#06d6a0](https://via.placeholder.com/10/00b48a?text=+) #06d6a0 |
| Main error | ![#ef476f](https://via.placeholder.com/10/ef476f?text=+) #ef476f |


## API Reference


https://zarea.fr/swagger (in development)

## Documentation

6 Services available
- Discord
- Facebook
- Twitter
- Spotify (Need pre access)
- Github
- Twitch

To see all the actions and reactions available fetch
"https://api.zarea.fr/about.json"
