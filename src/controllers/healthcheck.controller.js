import {asynchandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const healthcheck = asynchandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    return res.status(200)
    .json(new ApiResponse(200 ,"Everting is Ok Server is Running"))
})

export {
    healthcheck
    }