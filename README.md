This repo consists of two folders. 
- First: `iframe`: contains a full-page app that embeds Reality Interactive's Dify chatbot using an <iframe>.
- Second: `iframe-helper`: a `sidebar-app` that includes a button. When clicked, it redirects the user to the full-page app, pre-filled with the URL of the current Freshdesk ticket.


`Further Context for this project`: 
This project relies on the Freshworks Developer Kit (FDK)—an SDK provided by Freshworks for building Freshdesk custom apps. FDK can be somewhat finicky, so here are some key commands and notes for using it effectively:

| Command          | Description                            |
| ---------------- | -------------------------------------- |
| `fdk create app` | Scaffolds a new Freshdesk app          |
| `fdk run`        | Runs the app locally with live preview |
| `fdk validate`   | Validates the app’s structure/config   |
| `fdk pack`       | Packages the app for deployment        |
| `fdk pack -s`    | Same as above, but skips validation    |

`Running the App Locally`:
To test the app locally:
- 1. Run fdk run inside the app folder.
- 2. Navigate to https://realityinteractive.freshdesk.com.
- 3. Visit the Tickets section.
- 4. Append ?dev=true to the URL.
  - Example: https://realityinteractive.freshdesk.com/a/tickets/{yourticketnumber}?dev=true
  - This enables development mode and loads your custom app in Freshdesk.

`Important Note on Uploading Custom Apps`:
- You cannot upload a Freshdesk custom app by simply zipping the project folder. Instead:
  - Use fdk pack -s to package the app. This command:
    - Skips validation.
    - Creates a dist folder.
    - Outputs a zip file in the correct structure for uploading to Freshdesk.
- Make sure your manifest.json is correctly configured before packaging.

If you wish to learn more about creating applications in Freshdesk, I'd recommend reading through some of their documentation:
https://developers.freshworks.com/docs/tutorials/

https://developers.freshworks.com/docs/tutorials/foundations/hello/freshdesk/step-3/
