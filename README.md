# Deviant Code @devops | Sentry Application

When building docker based microservices and API applications, you would want to divide up yourpublic applications and your private applications into different networks. Public apps are those that any user can reac freely. Perhaps that application alone handles its authentication. Private apps are those which have no IP address, have no route from the internet and exist sole inside of Dokcer networks. THese apps can only be reached by their service names. For example, lets say you have a paid subscription to a Geo Location Application and you need to control whom can use that application. You may have 100s of these SAAS type apps. Would you recreate authentications for all of them? THat answer is no. Sticking with the microservice principals we have Sentry. It is the bridge to the backend systems.

Sentry lives in both public and private docker networks. Its job is to proxy requests from a user to the private backend systems BUT it first looks for a valid User Access Token and a valid Client Key to check if the requestee is authorized to talk to the backend systems and to the service it is trying to reach.

Sentry has a middleware which calls the Crypt service to validate and user or client access tokens. As all requests which pass through Sentry MUST have such a key, and request which does not have a key or which has an invlid key, will be denied.

Sentry is the sole service which can communicate with all Docker backend services.

Sentry requires Crypt API.


## Installation

Clone this repo

```bash 
    git clone https://github.com/deviantdevops/sentry.git sentry 
```

Add npm packages

```bash 
    yarn install
```

## INTEGRITY
DevOps @Deviant.code signs all code with intrgrity hashing to detect code changes. Our code is uploaded via private key ssh and also signed in our GitHub account. Any contributors can submit new code, BUT beofre commit & merge, code must be reviewed and GPG signed by @DevOps. In addition to standard GitHub verification, we also provide the following:

Running the folloiwng command in the Sentry directory will got get our GPG key for you and verify the integrity of the software. FIrst it will compare a fresh hash of Sentry with a saved hash. THen it will verify the GPG signatures. 

```bash 
    node integrity_checker.js
```

You should see both:

```bash 
    INTEGRITY CHECK HAS PASSED!
    ...
    gpg: Good signature from ...
```

If so then all good.

## Configuration

Sentry needs to know the real location of your services.

```bash 
    ./lib/servers.js
```
Here is where you must configure the location of your services. Server.js is a JSON object which responds to various environments. For a request to be properly relayed, you must list new servers here else the request does not know where to go. When sending to Sentry, lets use this example:

Lets say you want a request to go to your cart application located at http://localhost:9025/item. If you were to communicate directly with Cart, then you would talk to that address. But as Sentry stands between you and the cart API, you must tell sentry where to proxy your request to. You would instead send your request to http://localhost:7006/cart/item where "/cart" corresponds to the key value pair below and port 7006 is this application. The proxy will remove that "cart" string from the request and then come here to look for the real location of Cart and then send the rest of the request forward. The finaly request will be http://localhost:9025/item


