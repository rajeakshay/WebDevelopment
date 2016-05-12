# CS5610 Web Development
Developing sites that are dynamic, data driven and interactive.

GitHub URL: [https://github.com/rajeakshay/raje-akshay-web-dev](https://github.com/rajeakshay/raje-akshay-web-dev)

RedHat Openshift Online URL: [http://webdev-amraje.rhcloud.com/](http://webdev-amraje.rhcloud.com/)  
Openshift `node` version: `v4.4.4`  
Openshift `npm` version: `v2.15.1`  
Openshift MongoDB version: `v3.2.6`  

# Openshift configuration
1. Using Openshift Web Console, create an application and install `nodejs-0.10` cartridge provided by Openshift.
2. Using Openshift Web Console, go to **Or, see the entire list of cartridges you can add**, paste the URL below in **Install your own cartridge** textbox at the bottom of the page and click **Next**.

        https://github.com/rajeakshay/openshift-cartridge-mongodb/blob/mongo3.2.6/metadata/manifest.yml

3. The URL to Openshift Git repository can be found on Openshift Web Console's application dashboard. It looks something like `ssh://572f...000b8@appName-yourUserName.rhcloud.com/~/git/appName.git`. In your terminal, `git clone` this repository and add your Openshift Git repository as a remote repository.

        git clone https://github.com/rajeakshay/raje-akshay-web-dev.git
        git remote add openshift ssh://572f...000b8@appName-yourUserName.rhcloud.com/~/git/appName.git

4. For the first time, force push the code in this repository to Openshift.

        git push openshift master -f

  You should see messages stating that Node.js 4.4.4 is being installed among others like -

        ....
        remote:   - Checking to see if Node.js version 4.4.4 is installed ...
        ....
        remote: CLIENT_RESULT: MongoDB started.
        ....
        remote: Git Post-Receive Result: success
        remote: Activation status: success
        remote: Deployment completed with status: success
        ....

5. Visit [http://webdev-amraje.rhcloud.com/](http://webdev-amraje.rhcloud.com/) and check if the application is working correctly.

# Local configuration
1. Install Node.js v4.4.4 LTS and MongoDB v.3.2.6. Verify your installation using following commands-

        node --version
        npm --version
        mongod --version

2. In a terminal, start MongoDB daemon using `mongod`. You will see a message like -

        ....
        2016-05-12T11:07:23.641-0400 I NETWORK  [initandlisten] waiting for connections on port 27017


3. In your terminal, navigate to the directory where you have cloned this repository. If you haven't yet cloned this repository, simply give the following command -

        git clone https://github.com/rajeakshay/raje-akshay-web-dev.git

4. Navigate inside the project directory and install the project using `npm install`.
5. From inside the project directory, run the project using `node server.js`.
6. In your browser, visit `http://localhost:3000` and test the application.

# Contributing

I'll be more than happy to look into any bugs or improvement suggestions. Please send me a pull request.

# License

This project is released under MIT License. You are free to modify, distribute, copy or sublicense this project. For the full text of the license, see [LICENSE.md](https://github.com/rajeakshay/raje-akshay-web-dev/blob/master/LICENSE.md).

# Acknowledgements
The base template for this repository has been sourced from Prof.Annunziato's [web-dev-template](https://github.com/jannunzi/web-dev-template) designed specifically for CS5610.

Custom version of Node.js (v4.4.4 LTS) has been installed on RedHat's Openshift PaaS using configuration code sourced from ramr's excellent work [here](https://github.com/ramr/nodejs-custom-version-openshift). (See [.openshift](https://github.com/rajeakshay/raje-akshay-web-dev/tree/master/.openshift) directory)

Custom cartridge with latest version of MongoDB (v3.2.6) has been installed on RedHat's Openshift PaaS using code forked from icflorescu's repository. (See [openshift-cartridge-mongodb](https://github.com/rajeakshay/openshift-cartridge-mongodb/tree/mongo3.2.6))
