// Error is a built-in JavaScript class, and we’re extending it to create our own custom error type.
class ApiError extends Error {
    constructor
    (
        statusCode,
        message= "Somthing went Wrong",
        errors = [], // example  "errors": ["Email is required","Password must be at least 8 characters"]
        stack = ""
    )
    {
        super(message) // super keyword for overriding
        this.statusCode = statusCode
        this.errors = errors
        this.success = false
        this.data = message

        if(stack){
            this.stack =stack
        }
        else { 
            Error.captureStackTrace(this , this.constructor)  // Automatically captures the stack trace from where this error was created.
            // this reference and instance pass it to captureStackTrace ERROR
        }
    }


}
export {ApiError}




// The stack and captureStackTrace
// This is a very powerful debugging feature.
//  stack
// It’s a string showing the chain of function calls (the “stack trace”) that led to the error.
// Example:
// Error: Something went wrong
//     at getUser (userController.js:15:9)
//     at processRequest (server.js:42:13)
// This helps you trace exactly where the error started.
// You can manually pass a custom stack if needed (e.g., rethrowing or logging errors differently), which is why you have the parameter stack = "".