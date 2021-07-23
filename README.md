# Deviant Code @devops | Sentry Application

When building docker based microservices and API applications, you would want to divide up yourpublic applications and your private applications into different networks. Public apps are those that any user can reac freely. Perhaps that application alone handles its authentication. Private apps are those which have no IP address, have no route from the internet and exist sole inside of Dokcer networks. THese apps can only be reached by their service names. For example, lets say you have a paid subscription to a Geo Location Application and you need to control whom can use that application. You may have 100s of these SAAS type apps. Would you recreate authentications for all of them? THat answer is no. Sticking with the microservice principals we have Sentry. It is the bridge to the backend systems.

Sentry lives in both public and private docker networks. Its job is to proxy requests from a user to the private backend systems BUT it first looks for a valid User Access Token and a valid Client Key to check if the requestee is authorized to talk to the backend systems and to the service it is trying to reach.

Sentry has a middleware which calls the Crypt service to validate and user or client access tokens. As all requests which pass through Sentry MUST have such a key, and request which does not have a key or which has an invlid key, will be denied.

Sentry is the sole service which can communicate with all Docker backend services.

Sentry requires Crypt API.

