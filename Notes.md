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

# Prettier 
in Professional grade code we use it 
We use Prettier primarily to avoid merge conflicts due to spaces, commas, indentation, etc., and to maintain consistent, clean code across a production-grade codebase. so if the source code is same then it will just ignore what we want to be ignored

# prettierrc 
we define in it what to keep in mind in order to keep track of the 
commas etc 

# prettierignore 
we tell in this file that keep out of this file meaning do not apply any change in it 

# monogb connection do not use the Special characters 

# options for db connection 
we have 2 options one is write function in db and then load
it in index.js other is directly connecting the db in a function in index.js

# dotenv 
to load env vaiables as early as possible so when app is runs the env 
should be available anywhere we are using it 

# dbconnection
make sure the ./.env and other imports are correct main issue is in syntax 
not mongodb 

# Custom api response and error handling
how we can handle repetitive errors by handling it in custom classes and  functions and handle errors gracefully in utils 

# asyncHandler 
inthis type function we handles asynchrounous calls when requests are made

# ApiResponse 
we handle how the response should be when the api is successfull in ApiResponse
by sending success message payload (data) success status etc

# ApiError 
when api fails 

# Cloudinary


# connect mongodb with your backendserver 
to do that we will do that we can do that in the index.js file or server.js main file where the connectDB() method is called which was returning a Promise .the().catch()

# cors and Cookie parser 

we use cookie-parser for 
// app.use() used for when we use middlewares 
// To read cookies easily in Express routes.
// To access JWT tokens stored in cookies (for authentication).
// To track sessions.
// To implement “Remember me” or auto-login functionality.

and cors for 
cors (Cross-Origin Resource Sharing)
🔹 What it is
cors is an Express middleware that enables cross-origin communication between frontend and backen
By default, browsers block requests from a frontend hosted on one domain to a backend hosted on another.
For example:
Frontend (React): http://localhost:3000
Backend (Node/Express): http://localhost:8000
→ Without CORS, this gives you an error:
Access to fetch at 'http://localhost:8000/api' from origin 'http://localhost:3000' has been blocked by CORS policy
🔹 How it works
When you add:
import cors from "cors";
app.use(cors());

It automatically adds special HTTP headers like:
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
These tell the browser:
“It’s safe to allow this request from another origin.”

# models 
imported make through moongose which handles our mongoosedatabase

# npm i mongoose-aggregate-paginate-v2

It’s a Mongoose plugin that adds pagination (page-wise data loading) support for aggregation pipelines in MongoDB.
The package does not upload or store data —
it helps your backend load (fetch) limited chunks of data from MongoDB efficiently.
It’s purely for data reading (loading), not data uploading (inserting).

# jwt 
is a BearerToken if you have it then i will give you my access
Once the user’s email and password are verified, the backend creates a JWT (JSON Web Token) using a secret key.
This token contains the user’s ID, email, and username — and is signed so it can’t be tampered with.

The token acts as a temporary digital ID, allowing the user to make further requests without re-entering their password until it expires
// The user's details (like id, email, and username) already exist in the database.
// We include some of them in the JWT payload to identify the user when verifying the token later.
//But we’re not “checking” them in this function — we’re embedding them in the token payload so
//that when the client sends this token later, the backend can verify who the user is without re-checking the database every time.

# cloudinary
we will import the CLOUDINARY_API_SECRET and CLOUDINARY_API_KEY and CLOUDINARY_CLOUD_NAME from the cloudinary and also make the cloudinary 
util for easy hanling the like uploadonCloudinary() method 

# fs 
buid in filehandling in node we will use the unlink method

# multer 
Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.
// Client sends file → Multer triggers diskStorage() →
// destination(req, file, cb) → set folder
// filename(req, file, cb) → set name
// → File is written → req.file attached → next middleware

# controllers 
now till project is setup now we can wrtie controllers and routes 

# Aggregation Pipelines

