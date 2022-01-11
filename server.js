const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./route/users/usersRoute");
const { errorHandler, notFound } = require("./middlewares/error/errorHandler");
const postRoute = require("./route/posts/postRoute");
const CommentRoutes = require("./route/comments/commentRoute");
const emailMsgRoute = require("./route/emailMessage/emailMessageRoute");
const categoryRoute = require("./route/category/categoryRoute");
const cors = require("cors");
const app = express();
//DB
dbConnect();

//Middleware
app.use(express.json());

//cors
app.use(cors());

//Users route
app.use("/api/users", userRoutes);

//Post route
app.use("/api/posts", postRoute);

//STEP 55- Comment route
app.use("/api/comments", CommentRoutes);

//STEP 56- Comment route
app.use("/api/email", emailMsgRoute);

//STEP
app.use("/api/category", categoryRoute);

//err handler
app.use(notFound);
app.use(errorHandler);

//server
const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server is running ${PORT}`));

//{/* Loop through postsList */}
//{postList?.map(post => (

  /* <div>Loading</div>

                     <div className="text-red-400 text-base">
                       Categories Error goes here
                     </div>

                     <div className="text-xl text-gray-100 text-center">
                       No category
                     </div>*/
