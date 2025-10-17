 # npm init    
 npm  will intialze the repository for the project 

 # git init 
 intialize the git repo  and make repo for the project on the github
 add the files to git and make commit and also add the remote 
 repo link of github repo u have made like this(git remote add origin https://github.com/SydAsim/Youtube-clone.git)

 # Third party services 
 sometime we want to use the 3rd party services like AWS cloudinary 
 for image or video uploading if the connection somtimes fails then 
 we have to store the files temporory on our servers 

 # .gitkeep 
 to keep track of the files where git assumes it is empty we have to intialize .gitkeep in it .

 # .gitignore
 to ignorefiles we don't want to push

 # .env 
 it is taken from the system to make sure it is secure 
 not taken from files in AWS or other hosting platform where you want host your project there are fields key values etc so the backend take it from there 

 # src 
 main source code

 #  modulejs in package.json
commonjs to
 # nodemon 
 for  auto server reload it will be reloading the index.js file in the src we have to nodemon in package.json
"scripts": {
    "dev": "nodemon src/index.js"
  }



 # dev dep vs dep 
 in dev dep we mean in development what we need or require it just for our ease or use there is no effect of it development

