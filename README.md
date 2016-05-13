# CS5610 Web Development
Developing sites that are dynamic, data driven and interactive - [http://webdev-amraje.rhcloud.com/](http://webdev-amraje.rhcloud.com/)  

RedHat Openshift Online application details:  
URL: [http://webdev-amraje.rhcloud.com/](http://webdev-amraje.rhcloud.com/)  
`node` version: `v4.4.4`  
`npm` version: `v2.15.1`  
MongoDB Community Edition version: `v3.2.6`  

# How to clone and host this project/application in RedHat Openshift Online?
1. Using Openshift Web Console, create an application and install `nodejs-0.10` cartridge provided by Openshift. Node.js version will be updated later using configuration code in [.openshift](https://github.com/rajeakshay/raje-akshay-web-dev/tree/master/.openshift) directory.
2. Navigate to the application's dashboard in Openshift Web Console, go to **Or, see the entire list of cartridges you can add**, paste the URL below in **Install your own cartridge** textbox at the bottom of the page and click **Next**.

        https://raw.githubusercontent.com/icflorescu/openshift-cartridge-mongodb/master/metadata/manifest.yml
        
  This will install a cartridge with **latest** version of **MongoDB Community Edition**. Note that this cartridge is bare-bones and provides `mongod` daemon with WiredTiger storage engine only. `mongo` shell and other goodies are not available and are not needed.
3. The URL to your application's Openshift Git repository can be found on Openshift Web Console's application dashboard. It looks something like `ssh://572f...000b8@appName-yourUserName.rhcloud.com/~/git/appName.git`. In your terminal, `git clone` `raje-akshay-web-dev` repository and add your application's Openshift Git repository as a remote repository.

        git clone https://github.com/rajeakshay/raje-akshay-web-dev.git
        git remote add openshift ssh://572f...000b8@appName-yourUserName.rhcloud.com/~/git/appName.git

4. By default, `nodejs` cartridge will be updated with **Node.js version 4.4.4**. To specify another version of Node.js, edit the **.openshift/markers/NODEJS_VERSION** file. Commit any changes using `git commit -a -m "<YOUR MESSAGE>"`. 
5. For the first time, force push the code from your local repository to the application's Openshift Git repository.

        git push openshift master -f

  Force push is required because `nodejs-0.10` cartridge provides a default starter code which should be overwritten. Normal `git push` will show merge conflicts and fail.  
  After force push, you should see messages stating that **Node.js version 4.4.4** or your specified Node.js version is being installed among others. For example -

        ....
        remote:   - Checking to see if Node.js version 4.4.4 is installed ...
        ....
        remote: CLIENT_RESULT: MongoDB started.
        ....
        remote: Git Post-Receive Result: success
        remote: Activation status: success
        remote: Deployment completed with status: success
        ....

6. Open `appName-yourUserName.rhcloud.com` in a browser and check if the project/application is working correctly.

# Developing and testing locally
1. Install **Node.js v4.4.4 LTS** or your desired Node.js version and **latest** version of **MongoDB Community Edition**. For best results, use the same version of Node.js and MongoDB that you have configured on Openshift. Verify your installation using following commands-

        node --version
        npm --version
        mongod --version

2. In a terminal, start MongoDB daemon using `mongod`. You will see a message like -

        ....
        2016-05-12T11:07:23.641-0400 I NETWORK  [initandlisten] waiting for connections on port 27017


3. In another terminal, navigate to the directory where you have cloned this repository. If you haven't yet cloned this repository, simply give the following command -

        git clone https://github.com/rajeakshay/raje-akshay-web-dev.git

4. Navigate to the project directory `raje-akshay-web-dev` and install required `node` modules using command `npm install`.
5. From inside the project directory, run the server using command `node server.js`.
6. Open `http://localhost:3000` in your browser and test the application.  
7. To modify code in an IDE, first set a run configuration stating `node` interpreter and the start up script as `server.js`. Follow your particular IDE's documentation for step-by-step instructions on how to specify run configurations for Node.js projects.

# Contributing

I'll be more than happy to look into any bugs or improvement suggestions. Please send me a [pull request](https://help.github.com/articles/using-pull-requests/).

# License

This project is released under MIT License. You are free to modify, distribute, copy or sublicense this project. For the full text of the license, see [LICENSE.md](https://github.com/rajeakshay/raje-akshay-web-dev/blob/master/LICENSE.md).

# Acknowledgements
The base template for this repository has been sourced from Prof. Annunziato's [web-dev-template](https://github.com/jannunzi/web-dev-template) designed specifically for CS5610.

Custom version of Node.js (v4.4.4 LTS) has been installed on RedHat's Openshift PaaS using configuration code sourced from ramr's excellent work [here](https://github.com/ramr/nodejs-custom-version-openshift). (See [.openshift](https://github.com/rajeakshay/raje-akshay-web-dev/tree/master/.openshift) directory)

Custom cartridge with latest version of MongoDB Community Edition has been installed on RedHat's Openshift PaaS using icflorescu's [openshift-cartridge-mongodb](https://github.com/icflorescu/openshift-cartridge-mongodb).
