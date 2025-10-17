// This class creates a standard structure for successful API responses (while ApiError handled failures).
class ApiResponse {
    constructor
    (
        statusCode,
        data,
        message="Success"
    )
    {
        this.statusCode = statusCode,
        this.data= data
        this.message = message
        this.success =  statusCode  < 400  //true if 400false if error
    }

}

export {ApiResponse}