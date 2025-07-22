This repo consists of two folders. `iframe`, which is the folder containing the `full-page-app` with the iframe of Reality Interactive's Dify chatbot, and `iframe-helper`, a `sidebar-app` which consists of a button, which upon being clicked redirects you to the `full-page-app` which is pre-filled with the link of the previous Freshdesk ticket

`Further Context for this project`: 
This project is hingent on an SDK made by Freshworks known as FDK. FDK is quite finicky, so here are some key commands useful in ensuring you can use this project / create your own Freshdesk Custom App. 

| Command          | Description                            |
| ---------------- | -------------------------------------- |
| `fdk create app` | Scaffolds a new Freshdesk app          |
| `fdk run`        | Runs the app locally with live preview |
| `fdk validate`   | Validates the app’s structure/config   |
| `fdk pack`       | Packages the app for deployment        |
| `fdk pack -s`    | Same as above, but skips validation    |

Upon using `fdk run`, go to the `realityinteractive.freshdesk.com` page, and visit the `tickets` portion. There, type `?dev=true` into the URL, and the app should run as `In-Development`

Note: in order to upload custom apps to freshdesk, zipping it up as normal does NOT work. Please use `fdk pack -s` and ensure the project has the correct `manifest.json` before uploading.
`fdk pack -s` will pack the project into a specific type of zip, and will put that zip into a folder known as `dist`, which it automatically creates for you upon running the command. 

If you wish to learn more about creating applications in Freshdesk, I'd reccomend reading through some of their documentation:
https://developers.freshworks.com/docs/tutorials/

https://developers.freshworks.com/docs/tutorials/foundations/hello/freshdesk/step-3/
